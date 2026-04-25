import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Clock, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { COMMUNITY_URL, isCommunityEnabled } from "@/lib/community";

// Launch announcement for the Realtor Desk Community. Body sourced from
// i18n keys so EN + FR-CA ship together. CTA is gated on
// isCommunityEnabled() — the post is public regardless, but the
// "Join community" button only renders once VITE_COMMUNITY_URL is set,
// so the article holds up as evergreen content even if the server URL
// shifts later.

const CommunityLaunch = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title={t("communityLaunch.seoTitle", "Introducing the Realtor Desk Community")}
        description={t(
          "communityLaunch.seoDesc",
          "We just launched a community space where Canadian real estate agents using Realtor Desk can share tips, ask questions, and shape the product.",
        )}
        article
        publishedTime="2026-04-24"
        modifiedTime="2026-04-24"
        author="Realtor Desk"
        canonicalUrl="https://www.realtordesk.ai/blog/community-launch"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Introducing the Realtor Desk Community",
            "author": { "@type": "Organization", "name": "Realtor Desk" },
            "publisher": { "@type": "Organization", "name": "Realtor Desk" },
            "datePublished": "2026-04-24",
            "dateModified": "2026-04-24",
          },
        ]}
      />
      <Navbar />

      <article className="pt-32 md:pt-40 pb-20">
        <div className="container-custom max-w-3xl">
          <Link to="/resources">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("communityLaunch.backToResources", "Back to Resources")}
            </Button>
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold">
                {t("communityLaunch.tag", "Product update")}
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>{t("communityLaunch.publishDate", "April 24, 2026")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{t("communityLaunch.readTime", "3 min read")}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t("communityLaunch.h1", "Introducing the Realtor Desk Community")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t(
                "communityLaunch.lede",
                "A space for Canadian agents using Realtor Desk to share tips, ask questions, and shape what we build next.",
              )}
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <h2>{t("communityLaunch.sec1Heading", "Why we're doing this")}</h2>
            <p>{t("communityLaunch.sec1P1")}</p>
            <p>{t("communityLaunch.sec1P2")}</p>

            <h2>{t("communityLaunch.sec2Heading", "What's inside")}</h2>
            <p>{t("communityLaunch.sec2Intro")}</p>
            <ul>
              <li>{t("communityLaunch.sec2Item1")}</li>
              <li>{t("communityLaunch.sec2Item2")}</li>
              <li>{t("communityLaunch.sec2Item3")}</li>
              <li>{t("communityLaunch.sec2Item4")}</li>
              <li>{t("communityLaunch.sec2Item5")}</li>
            </ul>

            <h2>{t("communityLaunch.sec3Heading", "Ground rules")}</h2>
            <p>{t("communityLaunch.sec3P1")}</p>
            <ul>
              <li>{t("communityLaunch.sec3Item1")}</li>
              <li>{t("communityLaunch.sec3Item2")}</li>
              <li>{t("communityLaunch.sec3Item3")}</li>
              <li>{t("communityLaunch.sec3Item4")}</li>
            </ul>

            <h2>{t("communityLaunch.sec4Heading", "How to join")}</h2>
            <p>{t("communityLaunch.sec4P1")}</p>
            <p>{t("communityLaunch.sec4P2")}</p>
          </div>

          {isCommunityEnabled() && (
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center">
              <MessageCircle className="w-10 h-10 text-primary mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-2xl font-bold mb-2">
                {t("communityLaunch.ctaHeading", "Ready to join?")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("communityLaunch.ctaBody", "Free to join. Bring your curiosity and one tip from your last deal.")}
              </p>
              <Button asChild size="lg" className="btn-gradient">
                <a href={COMMUNITY_URL} target="_blank" rel="noopener noreferrer">
                  {t("communityLaunch.ctaButton", "Join the community")}
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default CommunityLaunch;
