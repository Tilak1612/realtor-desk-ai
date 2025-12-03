import { useTranslation } from "react-i18next";

const brands = [
  { name: "Royal LePage", accent: true },
  { name: "RE/MAX Canada", accent: false },
  { name: "Century 21", accent: true },
  { name: "Coldwell Banker", accent: false },
  { name: "Keller Williams", accent: true },
  { name: "Sutton Group", accent: false },
  { name: "HomeLife", accent: true },
  { name: "Engel & Völkers", accent: false },
  { name: "Sotheby's Realty", accent: true },
  { name: "EXIT Realty", accent: false },
];

const TrustedBrands = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 bg-muted/50 overflow-hidden">
      <div className="container-custom mb-8">
        <p className="text-center text-muted-foreground text-sm font-medium uppercase tracking-wider">
          {t('trustedBy', 'Trusted by leading Canadian brokerages')}
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/50 to-transparent z-10" />
        
        {/* Scrolling container */}
        <div className="flex animate-marquee">
          {/* First set of logos */}
          <div className="flex items-center gap-12 px-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center min-w-[180px] h-16 px-6 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <span className={`text-lg font-semibold whitespace-nowrap ${
                  brand.accent ? 'text-primary' : 'text-foreground/70'
                }`}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
          
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-12 px-6">
            {brands.map((brand, index) => (
              <div
                key={`dup-${index}`}
                className="flex items-center justify-center min-w-[180px] h-16 px-6 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <span className={`text-lg font-semibold whitespace-nowrap ${
                  brand.accent ? 'text-primary' : 'text-foreground/70'
                }`}>
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;
