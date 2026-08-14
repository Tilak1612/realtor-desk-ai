import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

// ROI / speed-to-lead calculator. All outputs are computed from the agent's
// OWN inputs with transparent, adjustable assumptions — no fabricated "10x"
// claims (the repo is strict about unverifiable stats). The recovery-uplift
// input is explicitly the agent's own assumption, defaulted conservatively.

const cad = (n: number) =>
  n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

const RoiCalculator = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [leadsPerMonth, setLeadsPerMonth] = useState(40);
  const [conversionPct, setConversionPct] = useState(3);
  const [avgCommission, setAvgCommission] = useState(12000);
  const [recoveryPct, setRecoveryPct] = useState(20); // agent's own assumption

  const result = useMemo(() => {
    const leadsYear = leadsPerMonth * 12;
    const baselineClients = leadsYear * (conversionPct / 100);
    const recoveredClients = baselineClients * (recoveryPct / 100);
    const addedGci = recoveredClients * avgCommission;
    return {
      leadsYear,
      baselineClients: Math.round(baselineClients * 10) / 10,
      recoveredClients: Math.round(recoveredClients * 10) / 10,
      addedGci,
    };
  }, [leadsPerMonth, conversionPct, avgCommission, recoveryPct]);

  const faqs = [
    {
      q: "How is the estimate calculated?",
      a: "It multiplies your annual lead volume by your current conversion rate to get your baseline clients, then applies the follow-up recovery percentage you set to estimate additional clients, and multiplies by your average commission. Every figure comes from inputs you control — nothing is assumed on your behalf except the recovery rate, which you can change.",
    },
    {
      q: "Is the recovery percentage a guarantee?",
      a: "No. It's an adjustable assumption representing how many otherwise-lost leads faster 24/7 follow-up might recover for you. Speed-to-lead is widely shown to improve contact rates, but your actual result depends on your market, lead sources, and process. Set it to whatever you consider realistic.",
    },
    {
      q: "Why does response speed affect conversion?",
      a: "Leads that aren't contacted quickly often engage another agent or go cold. 24/7 AI follow-up responds in seconds even when you're in a showing or asleep, so more of your leads reach a real conversation. See our lead-response-time guide for the detail.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Realtor Desk ROI Calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Estimate the additional gross commission income a Canadian real estate agent could earn from faster 24/7 lead follow-up.",
      url: "https://www.realtordesk.ai/roi-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const field = (
    id: string,
    label: string,
    value: number,
    setValue: (n: number) => void,
    suffix?: string,
    min = 0,
  ) => (
    <div>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-2 mt-1">
        <Input
          id={id}
          type="number"
          min={min}
          value={value}
          onChange={(e) => setValue(Math.max(min, Number(e.target.value) || 0))}
        />
        {suffix && <span className="text-sm text-muted-foreground whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate Lead ROI Calculator | Realtor Desk"
        description="Estimate the extra commission income faster 24/7 lead follow-up could earn you. Free calculator for Canadian real estate agents — your inputs, transparent math."
        keywords="real estate ROI calculator, lead follow-up ROI, speed to lead calculator, real estate commission calculator Canada, CRM ROI real estate"
        canonicalUrl="https://www.realtordesk.ai/roi-calculator"
        structuredData={structuredData}
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center max-w-3xl">
          <h1 className="mb-4">
            What is slow follow-up <span className="gradient-text">costing you?</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Estimate the extra commission income faster, always-on lead follow-up could earn you.
            Every number below is yours to set — the math is transparent.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Inputs */}
            <Card className="p-6 space-y-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" /> Your numbers
              </h2>
              {field("leads", "Leads per month", leadsPerMonth, setLeadsPerMonth, "leads")}
              {field("conv", "Current lead-to-client conversion", conversionPct, setConversionPct, "%")}
              {field("comm", "Average commission per closing", avgCommission, setAvgCommission, "CAD")}
              {field(
                "recovery",
                "Extra leads recovered with faster follow-up (your assumption)",
                recoveryPct,
                setRecoveryPct,
                "%",
              )}
            </Card>

            {/* Output */}
            <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
              <h2 className="text-xl font-bold mb-4">Your estimate</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-white/80 text-sm">Leads worked per year</div>
                  <div className="text-2xl font-bold">{result.leadsYear.toLocaleString("en-CA")}</div>
                </div>
                <div>
                  <div className="text-white/80 text-sm">Baseline clients / year</div>
                  <div className="text-2xl font-bold">{result.baselineClients}</div>
                </div>
                <div>
                  <div className="text-white/80 text-sm">Additional clients from faster follow-up</div>
                  <div className="text-2xl font-bold">+{result.recoveredClients}</div>
                </div>
                <div className="pt-4 border-t border-white/20">
                  <div className="text-white/80 text-sm">Estimated additional GCI / year</div>
                  <div className="text-4xl font-extrabold">{cad(result.addedGci)}</div>
                </div>
              </div>
              <Link to="/signup" className="block mt-6">
                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                  Start your 14-day free trial
                </Button>
              </Link>
            </Card>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
            Estimates only, based on the inputs you provide. Actual results vary by market, lead
            source, and process. The recovery percentage is your own assumption, not a guarantee.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted">
        <div className="container-custom max-w-3xl">
          <h2 className="text-center mb-10">How this works</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <Card key={f.q} className="p-6">
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            See the detail in our{" "}
            <Link to="/lead-response-time-canadian-realtors">lead response time guide</Link> or the{" "}
            <Link to="/real-estate-database-reactivation-canada">database reactivation playbook</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoiCalculator;
