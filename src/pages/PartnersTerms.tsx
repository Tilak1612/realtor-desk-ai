import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

// /partners/terms — static program terms. Baseline agreement; specific
// partners can have separately-negotiated contracts that override.
// Content is intentionally factual (no marketing claims) and mirrors
// the schema + constants in src/lib/affiliate/* and the v1 migration.
//
// LEGAL-REVIEW NOTE: these terms are a good-faith baseline drafted to
// match the technical implementation (25/30/40 tiers, 60d clawback,
// 90d attribution, CAD $50 payout floor, Alberta governing law). They
// have NOT been reviewed by counsel. Before any partner dispute or
// enforcement action, have a Canadian-licensed lawyer review this page.

const SECTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const PartnersTerms = () => {
  const { t, i18n } = useTranslation();

  // Fixed effective date — update via new deploy when terms change.
  // Format in the active locale so FR renders "24 avril 2026" etc.
  const effectiveDate = new Date("2026-04-24");
  const effectiveDateStr = new Intl.DateTimeFormat(
    i18n.language === "fr" || i18n.language.startsWith("fr") ? "fr-CA" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" },
  ).format(effectiveDate);

  return (
    <div className="min-h-screen">
      <SEO
        title={t("pageSeo.partnersTermsTitle")}
        description={t("pageSeo.partnersTermsDesc")}
        canonicalUrl="https://www.realtordesk.ai/partners/terms"
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-16">
        <div className="container-custom max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("partnersTerms.pageHeading")}
          </h1>
          <p className="text-sm text-muted-foreground mb-2">
            {t("partnersTerms.effective", { date: effectiveDateStr })}
          </p>
          <p className="text-sm text-muted-foreground italic mb-10">
            {t("partnersTerms.draftNotice")}
          </p>

          <div className="prose prose-slate max-w-none">
            {SECTIONS.map((n) => (
              <section key={n} className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  {t(`partnersTerms.sect${n}Title`)}
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {t(`partnersTerms.sect${n}Body`)}
                </p>
              </section>
            ))}

            <section className="mt-12 p-6 bg-muted/30 rounded-lg border">
              <h2 className="text-lg font-bold mb-2">
                {t("partnersTerms.contactHeading")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("partnersTerms.contactBody")}
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PartnersTerms;
