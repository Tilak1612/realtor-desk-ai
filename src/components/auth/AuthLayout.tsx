import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import MatrixRain from './MatrixRain';

interface AuthLayoutProps {
  children: ReactNode;
  /**
   * Optional value column shown to the LEFT of `children` at >=1024px.
   * Below lg it is not rendered at all: on a phone the form must come first,
   * and a duplicated pitch above it just pushes the CTA off-screen.
   */
  aside?: ReactNode;
}

// Auth shell used by /login and /signup. Hosts the background layers
// and a persistent EN/FR toggle in the top-right so a Quebec visitor
// landing directly on the auth routes isn't trapped in whatever locale
// the cookie last set (2026-04 audit finding).

const AuthLayout = ({ children, aside }: AuthLayoutProps) => {
  const { i18n } = useTranslation();
  const active = (i18n.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const setLang = (next: 'en' | 'fr') => {
    if (next !== active) void i18n.changeLanguage(next);
  };

  return (
    <div data-auth-shell className="min-h-screen flex items-center justify-center antialiased relative bg-gray-950 overflow-hidden">
      {/* Matrix Rain Animation */}
      <MatrixRain />

      {/* Background Pattern. Dimmed when a value column sits on top of it —
          body text over a moving backdrop has to clear 4.5:1 against the
          darkest frame, not the average one. */}
      <div
        className={aside ? "absolute inset-0 opacity-70" : "absolute inset-0 opacity-40"}
        style={{
          background: 'radial-gradient(ellipse at center, hsl(220 20% 20%), hsl(220 20% 10%), hsl(220 20% 5%))'
        }}
      />

      {/* Dot Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Language toggle — top-right, above the card stacking context */}
      <div
        role="group"
        aria-label="Language / Langue"
        className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-white/80"
      >
        <button
          type="button"
          onClick={() => setLang('en')}
          aria-pressed={active === 'en'}
          className={`min-w-[28px] min-h-[28px] px-2 rounded-full transition-colors ${
            active === 'en' ? 'bg-white/15 text-white' : 'hover:bg-white/10'
          }`}
        >
          EN
        </button>
        <span className="opacity-40">/</span>
        <button
          type="button"
          onClick={() => setLang('fr')}
          aria-pressed={active === 'fr'}
          className={`min-w-[28px] min-h-[28px] px-2 rounded-full transition-colors ${
            active === 'fr' ? 'bg-white/15 text-white' : 'hover:bg-white/10'
          }`}
        >
          FR
        </button>
      </div>

      {/* Content. Single centered card when there is no aside (login, reset);
          two columns from lg up when there is. */}
      {aside ? (
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20">
          {/* Order matters: the card is FIRST in the DOM so keyboard and
              screen-reader users reach the form before the marketing copy,
              and lg:order flips it visually on desktop. */}
          <div className="order-1 w-full lg:order-2 lg:w-auto lg:flex-shrink-0">{children}</div>
          <div className="order-2 hidden lg:order-1 lg:block lg:flex-1">{aside}</div>
        </div>
      ) : (
        children
      )}

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          /* Vestibular safety: freeze the float and hide the animated rain
             canvas entirely rather than letting it run at speed. */
          [data-auth-shell] * { animation: none !important; }
          [data-auth-shell] canvas { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
