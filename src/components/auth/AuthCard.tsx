import { ReactNode } from 'react';
import { ShieldCheck, Lock, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RDMark } from '@/components/rd/Logo';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  logoIcon?: ReactNode;
}

const AuthCard = ({ children, title, subtitle, logoIcon }: AuthCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
      {/* Back to Website */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('auth.backToWebsite', 'Back to realtordesk.ai')}
        </Link>
      </div>

      {/* Logo Section — unified brand lockup per 2026-04 revision. The
          previous purple-gradient lightning-bolt tile was generic;
          replaced with the real RDMark (navy house-R + terra accent)
          so auth surfaces read as the same brand as marketing. */}
      <div className="text-center mb-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform"
          aria-label="Realtor Desk"
        >
          {logoIcon || <RDMark size={56} tone="paper" />}
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{title}</h1>
        <p className="text-sm text-gray-300">{subtitle}</p>
        
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/15 border border-green-500/30 rounded-full text-xs font-medium text-green-400">
            <ShieldCheck className="w-3 h-3" />
            <span>{t('auth.protectedSession', 'Protected Session')}</span>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div 
        className="relative bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 overflow-hidden"
        style={{ animationDelay: '0.2s' }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-600/10 pointer-events-none" />
        
        <div className="relative z-10">
          {children}
        </div>
      </div>

      {/* Trust Indicators */}
      <div 
        className="flex items-center justify-center gap-4 mt-8 text-xs text-gray-400 flex-wrap"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-800/50 transition-all duration-200">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>{t('auth.pipedaCompliant', 'PIPEDA Compliant')}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-800/50 transition-all duration-200">
          <Lock className="w-4 h-4 text-primary" />
          <span>{t('auth.ssl', '256-bit SSL')}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-800/50 transition-all duration-200">
          <Users className="w-4 h-4 text-purple-400" />
          <span>{t('auth.canadianData', 'Canadian Data')}</span>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
