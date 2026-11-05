import type { CapacitorConfig } from '@capacitor/cli';

// Realtor Desk for iOS and Android.
//
// The app is the web app, bundled. There is deliberately no `server.url`: the
// previous version of this file pointed the webview at a remote scaffold URL
// with cleartext traffic allowed, which meant the "app" was whatever that
// server returned. The bundle in `dist-mobile` is built by `npm run
// build:mobile` (a plain Vite build, without the marketing prerender).
//
// androidScheme stays https so the webview is a secure context (Supabase's PKCE
// flow needs WebCrypto) and so storage is not lost by a scheme change later.
const config: CapacitorConfig = {
  appId: 'com.brainfyai.realtordesk',
  appName: 'Realtor Desk',
  webDir: 'dist-mobile',
  server: {
    androidScheme: 'https',
  },
  // The webview paints this before the first frame of the app. Without it the
  // screen is black between the splash and the sign-in page on a slow start.
  backgroundColor: '#FAFAF7',
  ios: {
    contentInset: 'never',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#FAFAF7',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'native',
    },
    // Dark icons on the light app background, set natively so the bars are right
    // before the JavaScript bundle has run. src/lib/native/bootstrap.ts sets the
    // same style again once it has.
    SystemBars: {
      style: 'LIGHT',
    },
  },
};

export default config;
