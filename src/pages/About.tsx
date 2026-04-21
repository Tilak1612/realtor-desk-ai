import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Scaffold per 2026-04-20 UX audit §4: named-founder presence is the #1
// credibility signal for a beta product. Replace the placeholder headshot
// and refine the copy once Tilak has a headshot he's happy with.
// Until then: honest text + real attribution, no stock photos.

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <SEO
        title="About RealtorDesk AI | Built in Canada, built on honesty"
        description="RealtorDesk AI is built by Brainfy AI Inc. in Edmonton, Alberta. Founder Tilak Raj on why we're building a Canadian-first CRM for real estate agents."
        canonicalUrl="https://www.realtordesk.ai/about"
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">{t("about.badge", "Who we are")}</Badge>
          <h1 className="mb-4">{t("about.title", "Built in Canada. Built on honesty.")}</h1>
          <p className="text-lg text-muted-foreground">
            {t(
              "about.subtitle",
              "RealtorDesk AI is the CRM we wished existed when we watched Canadian agents lose leads to American-built software that didn't know what CASL was."
            )}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto space-y-10">
          {/* Founder block */}
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground flex-shrink-0">
                TR
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">{t("about.founder.name", "Tilak Raj")}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("about.founder.role", "Founder, Brainfy AI Inc.")}
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "about.founder.p1",
                    "I started Brainfy AI Inc. to build software for businesses that US-based SaaS treats as an afterthought. RealtorDesk AI is the first of those products. Canadian real estate agents navigate PIPEDA, CASL, provincial regulators (RECO, BCFSA, OACIQ), and bilingual markets — and then are sold American CRMs that don't ship with a CASL-compliant email footer, much less a bilingual chatbot."
                  )}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    "about.founder.p2",
                    "We're in public beta. That means you pay Founding-Member pricing while we ship against your feedback, you see our public roadmap, and you can cancel any time. We'd rather tell you what doesn't work yet than claim things that aren't true."
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Company block */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-3">
              {t("about.company.title", "Brainfy AI Inc.")}
            </h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>{t("about.company.hqLabel", "Headquarters:")}</strong>{" "}
                {t("about.company.hq", "Edmonton, Alberta, Canada")}
              </p>
              <p>
                <strong>{t("about.company.foundedLabel", "Founded:")}</strong>{" "}
                {t("about.company.founded", "2025")}
              </p>
              <p>
                <strong>{t("about.company.stageLabel", "Stage:")}</strong>{" "}
                {t("about.company.stage", "Public beta — founding members from across Canada")}
              </p>
              <p>
                <strong>{t("about.company.contactLabel", "Contact:")}</strong>{" "}
                <a href="mailto:support@realtordesk.ai" className="text-primary underline">
                  support@realtordesk.ai
                </a>
              </p>
            </div>
          </Card>

          {/* Honesty principles */}
          <Card className="p-8 bg-accent/5 border-accent/20">
            <h2 className="text-xl font-semibold mb-4">
              {t("about.principles.title", "Four things we will not do")}
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">
                  {t("about.principles.p1Title", "Claim certifications we don't have.")}
                </strong>{" "}
                {t(
                  "about.principles.p1",
                  "We're not SOC 2 certified today — that's on the roadmap for Q1 2027. We do not put badges for standards we haven't actually passed."
                )}
              </li>
              <li>
                <strong className="text-foreground">
                  {t("about.principles.p2Title", "Fabricate customer counts.")}
                </strong>{" "}
                {t(
                  "about.principles.p2",
                  "We have 50+ active beta users. When we hit 500, we'll say 500. We don't round up."
                )}
              </li>
              <li>
                <strong className="text-foreground">
                  {t("about.principles.p3Title", "Oversell AI outcomes.")}
                </strong>{" "}
                {t(
                  "about.principles.p3",
                  "Our AI answers leads 24/7 and scores them. It does not close deals for you. Anyone promising '3x more deals' is selling you a vibe, not software."
                )}
              </li>
              <li>
                <strong className="text-foreground">
                  {t("about.principles.p4Title", "Lock you in.")}
                </strong>{" "}
                {t(
                  "about.principles.p4",
                  "Month-to-month billing, full data export, 30-day money-back on annual. If RealtorDesk AI isn't working for you, we'll help you leave."
                )}
              </li>
            </ul>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/roadmap">
              <Button variant="outline">
                {t("about.ctaRoadmap", "See the public roadmap")}
              </Button>
            </Link>
            <Link to="/signup">
              <Button>{t("about.ctaTrial", "Start your 14-day free trial")}</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
