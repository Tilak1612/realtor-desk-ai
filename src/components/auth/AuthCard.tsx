import { ReactNode } from 'react';
import { ShieldCheck, Lock, Users } from 'lucide-react';

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  logoIcon?: ReactNode;
}

const AuthCard = ({ children, title, subtitle, logoIcon }: AuthCardProps) => {
  return (
    <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div 
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-4 shadow-xl relative overflow-hidden"
          style={{ 
            boxShadow: '0 0 20px hsl(var(--primary) / 0.3), 0 0 40px hsl(var(--primary) / 0.2)',
            animation: 'float 6s ease-in-out infinite'
          }}
        >
          {logoIcon || (
            <svg 
              className="w-8 h-8 text-white relative z-10" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">{title}</h1>
        <p className="text-sm text-gray-300">{subtitle}</p>
        
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/15 border border-green-500/30 rounded-full text-xs font-medium text-green-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Protected Session</span>
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
          <span>PIPEDA Compliant</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-800/50 transition-all duration-200">
          <Lock className="w-4 h-4 text-primary" />
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-800/50 transition-all duration-200">
          <Users className="w-4 h-4 text-purple-400" />
          <span>Canadian Data</span>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
