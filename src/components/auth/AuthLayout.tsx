import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
  children: ReactNode;
  /**
   * Optional value column shown to the LEFT of `children` at >=1024px.
   * Below lg it is not rendered at all: on a phone the form must come first,
   * and a duplicated pitch above it just pushes the CTA off-screen.
   */
  aside?: ReactNode;
}

// Auth shell used by /login and /signup.
//
// Theme: this used to be a near-black `bg-gray-950` shell with an animated
// MatrixRain canvas and green "hacker" accents, which read as a different
// product from the marketing site a visitor had just come from. The public
// pages are warm paper, deep navy and terracotta with an Instrument Serif
// accent, so the auth surfaces now use the same rd-* tokens. Signing up
// should feel like the same company as the page that sold you.
//
// Retained from the previous version: the persistent EN/FR toggle (a Quebec
// visitor landing directly on /signup must not be trapped in whatever locale
// the cookie last set), the form-first DOM order, and reduced-motion safety.

const AuthLayout = ({ children, aside }: AuthLayoutProps) => {
  const { i18n } = useTranslation();
  const active = (i18n.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const setLang = (next: 'en' | 'fr') => {
    if (next !== active) void i18n.changeLanguage(next);
  };

  return (
    <div
      data-auth-shell
      className="min-h-screen flex items-center justify-center antialiased relative bg-rd-paper overflow-hidden"
    >
      {/* Soft navy wash from the top, mirroring the marketing hero's calm
          gradient. Kept very low contrast so form text clears 4.5:1 easily. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(11,37,64,0.07), transparent 70%)',
        }}
      />

      {/* Faint dot grid — same device as the marketing background, in ink
          rather than white so it reads on paper. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B2540' fill-opacity='0.035'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm terracotta bloom in the lower corner — the marketing accent. */}
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(215,113,78,0.10), transparent 65%)',
        }}
      />

      {/* Language toggle — top-right, above the card stacking context. */}
      <div
        role="group"
        aria-label="Language / Langue"
        className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full border border-rd-line bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-rd-ink-600 shadow-sm"
      >
        <button
          type="button"
          onClick={() => setLang('en')}
          aria-pressed={active === 'en'}
          className={`min-w-[28px] min-h-[28px] px-2 rounded-full transition-colors ${
            active === 'en'
              ? 'bg-rd-navy-800 text-white'
              : 'hover:bg-rd-ink-100 text-rd-ink-600'
          }`}
        >
          EN
        </button>
        <span className="text-rd-ink-300" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          onClick={() => setLang('fr')}
          aria-pressed={active === 'fr'}
          className={`min-w-[28px] min-h-[28px] px-2 rounded-full transition-colors ${
            active === 'fr'
              ? 'bg-rd-navy-800 text-white'
              : 'hover:bg-rd-ink-100 text-rd-ink-600'
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

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [data-auth-shell] * { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
