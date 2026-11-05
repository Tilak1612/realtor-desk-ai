import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// ── Mobile build (`npm run build:mobile`, i.e. `vite build --mode mobile`) ──
//
// The iOS / Android app is this same web app, bundled into dist-mobile for
// Capacitor. Its JS is identical to the website's; what differs is index.html,
// which on the web carries things that are about the WEBSITE:
//
//   - the Google tag. The app ships with no analytics, which is what its App
//     Store and Play privacy declarations say. Removing the tag from the page
//     is what makes that true at the network level (src/utils/analytics.ts
//     also refuses to send in the app, as a second lock).
//   - the JSON-LD blocks (Organization, SoftwareApplication, Product). They
//     exist for search engines, and they state prices.
//   - the <noscript> fallback in <body>: marketing copy with "start your free
//     trial" and pricing links, which the app must not contain (App Store
//     guideline 3.1.3(f)).
//   - the Open Graph / Twitter card tags, which describe a share preview the
//     app can never produce and mention the trial.
//   - the HTML comments, which explain all of the above to a web developer.
//
// This plugin is only ever instantiated when mode === "mobile" (see the
// plugins array below), so a web build never runs a line of it.
const MOBILE_REQUIRED_ENV = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"];

// Files in public/ that exist for crawlers, link previews and the host
// (Vercel), copied into every build by Vite. Nothing in the app requests them;
// several restate pricing. Removed from dist-mobile after the build.
const MOBILE_PRUNE = [
  "_headers",
  "_redirects",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt",
  "ai-company-info.txt",
  "knowledge-base.json",
  "api-docs.md",
  "googleeec1cfed4e1b49f9.html",
  "og",
  "og-image.png",
  "og-image.webp",
  "og-image.avif",
  "og-image-640w.webp",
  "og-image-640w.avif",
  "og-image-960w.webp",
  "og-image-960w.avif",
  "downloads",
];

function mobileShell(): Plugin {
  let outDir = "";
  return {
    name: "rd-mobile-shell",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
      // On the web these come from the Vercel project's environment. A mobile
      // build runs on a laptop, where they come from .env / .env.mobile, and a
      // bundle built without them is an app that opens to a blank screen
      // (createClient throws on an undefined URL) -- discovered after it has
      // been through store review. Fail here instead.
      if (config.command !== "build") return;
      const missing = MOBILE_REQUIRED_ENV.filter((key) => !config.env[key]);
      if (missing.length > 0) {
        throw new Error(
          "build:mobile needs " + missing.join(" and ") +
            ". Put them in .env.mobile (or .env) next to package.json; " +
            "they are the same values the website is built with.",
        );
      }
    },
    transformIndexHtml: {
      // "pre": work on index.html as written, before Vite rewrites the entry
      // script and injects its own tags.
      order: "pre",
      handler(html) {
        const [head, ...rest] = html.split(/(?=<body[\s>])/i);
        const body = rest.join("");
        const out =
          head
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "")
            // The Google tag is three scripts: the consent defaults, the
            // loader, and the localhost debug flag. Matched by what they
            // mention rather than "every script", so an unrelated inline
            // script added to <head> later survives into the app.
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (tag) =>
              /googletagmanager|gtag|dataLayer/i.test(tag) ? "" : tag,
            )
            .replace(/<meta\s+(?:property=["']og:|name=["']twitter:)[^>]*>/gi, "") +
          body
            .replace(/<!--[\s\S]*?-->/g, "")
            // In <body> only: the <noscript> in <head> is the font stylesheet.
            .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");

        // The patterns above are written against today's index.html. If the
        // tag is ever reshaped so one of them stops matching, the build must
        // stop too, not quietly ship analytics in the app.
        const leak = out.match(/googletagmanager|google-analytics|gtag|dataLayer|application\/ld\+json/i);
        if (leak) {
          throw new Error(
            'build:mobile: index.html still contains "' + leak[0] +
              '" after stripping. Update mobileShell() in vite.config.ts.',
          );
        }
        // Collapse the blank lines the removals leave behind.
        return out.replace(/\n[ \t]*(?:\n[ \t]*)+/g, "\n");
      },
    },
    closeBundle() {
      // Fixed names inside the build's own output directory, nothing else.
      if (!outDir) return;
      for (const name of MOBILE_PRUNE) {
        fs.rmSync(path.join(outDir, name), { recursive: true, force: true });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" ? componentTagger() : null,
    mode === "mobile" ? mobileShell() : null,
    mode === "production" &&
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT
      ? sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
        })
      : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-popover", "@radix-ui/react-tooltip", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select", "@radix-ui/react-accordion"],
          // recharts is deliberately NOT listed here. Forcing it into a static
          // manual chunk made Vite modulepreload it in index.html on EVERY
          // page -- 376KB that a homepage visitor downloads and never
          // executes, because the only consumers (Reports, Market) are
          // lazy-loaded routes. Left unlisted, Rollup splits it into the route
          // chunks that actually use it.
          "vendor-query": ["@tanstack/react-query"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-i18n": ["i18next", "react-i18next"],
          "vendor-dnd": ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"],
        },
      },
    },
  },
}));
