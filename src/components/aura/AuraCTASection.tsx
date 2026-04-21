import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const AuraCTASection = () => {
  const { t } = useTranslation();

  return (
    <SpotlightCard className="mx-4 sm:mx-6 max-w-7xl xl:mx-auto mb-8">
      <div className="relative bg-gradient-to-br from-primary/20 via-card to-card rounded-[40px] py-16 sm:py-24 px-6 sm:px-12 lg:px-16 text-center overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="aura-badge mb-8 mx-auto w-fit">
            <Sparkles className="w-4 h-4" />
            {t('indexPage.finalCTA.badge', 'Founding-member pricing')}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tighter text-white mb-6 leading-[1.1]">
            {t('indexPage.finalCTA.title')}
          </h2>

          <p className="text-muted-foreground text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            {t('indexPage.finalCTA.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <button className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] focus:outline-none text-sm font-bold text-white tracking-widest rounded-full py-4 px-10 relative items-center justify-center">
                <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                  <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,hsl(var(--primary))_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                  <div className="absolute inset-[1px] rounded-full bg-card"></div>
                </div>
                <div className="-z-10 overflow-hidden bg-card rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-primary/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-primary/30"></div>
                </div>
                <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
                  {t('indexPage.finalCTA.startTrial')}
                </span>
                <ArrowRight className="relative z-10 ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>

            <Link to="/demo">
              <button className="hover:bg-white/10 transition-all flex text-base font-medium text-foreground bg-white/5 rounded-full py-4 px-8 items-center justify-center relative overflow-hidden group/btn border border-white/10">
                <span className="text-base font-medium text-foreground/80 tracking-tight relative z-10">
                  {t('indexPage.finalCTA.bookDemo')}
                </span>
                <Play className="w-4 h-4 ml-2 opacity-70 relative z-10 group-hover/btn:scale-110 transition-transform" fill="currentColor" />
              </button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground font-medium">
            {t('indexPage.finalCTA.note')}
          </p>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default AuraCTASection;
