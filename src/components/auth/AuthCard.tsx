import { ReactNode } from 'react';
import { ShieldCheck, Lock, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RDMark } from '@/components/rd/Logo';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  logoIcon?: ReactNode;
}

// Re-themed to match the marketing site: white card on warm paper, navy
// headings, terracotta accent, subtle line borders.
//
// What changed and why:
//   - The card was gray-800/95 with a purple-to-primary gradient overlay and
//     white text. Marketing has no purple anywhere.
//   - The trust row used green / violet / purple icons. Now navy + terracotta,
//     the only two accent hues the brand actually uses.
//   - "Protected Session" was a green pill borrowed from a security-tool
//     aesthetic. It now reads as a quiet navy chip, consistent with the
//     "Now in public beta" pill on the marketing hero.
const AuthCard = ({ children, title, subtitle, logoIcon }: AuthCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="relative z-10 w-full max-w-md px-6 lg:px-0 animate-fade-in">
      {/* Back to Website */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-rd-ink-500 hover:text-rd-navy-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('auth.backToWebsite', 'Back to realtordesk.ai')}
        </Link>
      </div>

      {/* Brand lockup — the real RDMark (navy house-R + terra accent), on
          paper rather than reversed out of a dark shell. */}
      <div className="text-center mb-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform"
          aria-label="Realtor Desk"
        >
          {logoIcon || <RDMark size={56} tone="navy" />}
        </Link>
        <h1 className="text-[28px] leading-tight font-bold text-rd-navy-900 tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-sm text-rd-ink-600 leading-relaxed">{subtitle}</p>

        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rd-navy-50 border border-rd-navy-200 rounded-full text-xs font-semibold text-rd-navy-800">
            <ShieldCheck className="w-3 h-3" />
            <span>{t('auth.protectedSession', 'Protected Session')}</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative bg-white rounded-[14px] border border-rd-line shadow-[0_1px_2px_rgba(11,37,64,0.04),0_8px_24px_rgba(11,37,64,0.06)] p-6">
        {children}
      </div>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-4 mt-8 text-xs text-rd-ink-500 flex-wrap">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md">
          <ShieldCheck className="w-4 h-4 text-rd-navy-600" />
          <span>{t('auth.pipedaCompliant', 'PIPEDA Compliant')}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md">
          <Lock className="w-4 h-4 text-rd-navy-600" />
          <span>{t('auth.ssl', '256-bit SSL')}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md">
          <MapPin className="w-4 h-4 text-rd-terra-600" />
          <span>{t('auth.canadianData', 'Canadian Data')}</span>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
