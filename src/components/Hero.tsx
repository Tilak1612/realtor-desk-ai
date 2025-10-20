import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Play, MapPin } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-28 lg:pt-36 pb-12 sm:pb-16 md:pb-20 lg:pb-28 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-in-up order-2 lg:order-1">
            {/* Beta and Canadian Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                BETA
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <MapPin className="w-3 h-3" />
                🇨🇦 Built by Canadian Realtors, for Canadian Realtors
              </Badge>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] sm:text-xs font-medium">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{t('hero.badge1')}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] sm:text-xs font-medium">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{t('hero.badge2')}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] sm:text-xs font-medium">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="whitespace-nowrap">{t('hero.badge3')}</span>
              </span>
            </div>

            <h1 className="mb-3 sm:mb-4 md:mb-6 leading-[1.1] sm:leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTAs - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6 md:mb-8">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="btn-gradient text-base sm:text-lg w-full sm:w-auto min-h-[52px] sm:min-h-[56px]">
                  {t('hero.getStarted')}
                </Button>
              </Link>
              <Link to="/demo" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-base sm:text-lg w-full sm:w-auto min-h-[52px] sm:min-h-[56px]">
                  {t('hero.watchDemo')}
                </Button>
              </Link>
            </div>

            {/* Trust Line */}
            <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed">
              {t('hero.trustLine')}
            </p>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-fade-in animation-delay-200 order-1 lg:order-2 px-2 sm:px-0">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
              <img
                src={heroDashboard}
                alt="Realtor Desk AI Dashboard showing AI analytics, property listings, and chat interface"
                className="w-full h-auto"
              />
              {/* Beta Badge Overlay */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-orange-500 text-white backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg animate-scale-in animation-delay-400">
                <div className="text-xs sm:text-sm font-bold uppercase leading-none">Beta</div>
              </div>
            </div>

            {/* Decorative Elements - Hidden on mobile */}
            <div className="hidden md:block absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="hidden md:block absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
