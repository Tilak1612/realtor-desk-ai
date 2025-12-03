import { useTranslation } from "react-i18next";

const brands = [
  { name: "RE/MAX", lettermark: "RE/MAX" },
  { name: "Coldwell Banker", lettermark: "CB" },
  { name: "Century 21", lettermark: "C21" },
  { name: "Royal LePage", lettermark: "RL" },
  { name: "Keller Williams", lettermark: "KW" },
  { name: "Sotheby's International Realty", lettermark: "SIR" },
];

const TrustedBrandsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 md:py-12 bg-muted/30 border-y border-border/50">
      <div className="container-custom">
        {/* Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-1">
            {t('trustedBrands.title', 'Trusted by agents from these brands')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('trustedBrands.subtitle', 'Serving agents and brokerages across Canada.')}
          </p>
        </div>

        {/* Brand Logos - Desktop: single row, Mobile: scrolling or 2 rows */}
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group flex flex-col items-center gap-2 transition-all duration-300"
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg bg-background border border-border/50 flex items-center justify-center shadow-sm grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:border-primary/30 transition-all duration-300">
                <span className="text-lg lg:text-xl font-bold text-foreground/80 group-hover:text-primary transition-colors duration-300">
                  {brand.lettermark}
                </span>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center max-w-[80px]">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile: 2 rows grid */}
        <div className="md:hidden grid grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group flex flex-col items-center gap-1.5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-lg bg-background border border-border/50 flex items-center justify-center shadow-sm grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors duration-300">
                  {brand.lettermark}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsSection;
