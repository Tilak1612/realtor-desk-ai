import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import MatrixRain from './MatrixRain';

interface AuthLayoutProps {
  children: ReactNode;
}

// Auth shell used by /login and /signup. Hosts the background layers
// and a persistent EN/FR toggle in the top-right so a Quebec visitor
// landing directly on the auth routes isn't trapped in whatever locale
// the cookie last set (2026-04 audit finding).

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { i18n } = useTranslation();
  const active = (i18n.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  const setLang = (next: 'en' | 'fr') => {
    if (next !== active) void i18n.changeLanguage(next);
  };

  return (
    <div className="min-h-screen flex items-center justify-center antialiased relative bg-gray-950 overflow-hidden">
      {/* Matrix Rain Animation */}
      <MatrixRain />

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-40"
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

      {/* Content */}
      {children}

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
