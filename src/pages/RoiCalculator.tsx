import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator, TrendingUp, Clock } from "lucide-react";

// Interactive ROI / speed-to-lead calculator. All outputs derive from the
// user's own inputs — no fabricated benchmark numbers. Transparent math,
// clearly labelled as an estimate. High-intent, linkable lead-capture page.

const CAD = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(n)),
  );

const Field = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  id,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  id: string;
}) => (
  <div>
    <label htmlFor={id} className="flex justify-between text-sm font-medium mb-2">
      <span>{label}</span>
      <span className="text-primary font-semibold">
        {value}
        {suffix}
      </span>
    </label>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-primary"
      aria-valuenow={value}
    />
  </div>
);

const RoiCalculator = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [leads, setLeads] = useState(40); // inbound leads / month
  const [commission, setCommission] = useState(12000); // avg GCI per closed deal, CAD
  const [closeRate, setCloseRate] = useState(3); // % of contacted leads that close
  const [currentContact, setCurrentContact] = useState(40); // % of leads you reach today
  const [targetContact, setTargetContact] = useState(80); // % reached with instant follow-up

  const result = useMemo(() => {
    const annualLeads = leads * 12;
    const dealsNow = annualLeads * (currentContact / 100) * (closeRate / 100);
    const dealsWith = annualLeads * (targetContact / 100) * (closeRate / 100);
    const extraDeals = Math.max(0, dealsWith - dealsNow);
    return {
      extraDeals,
      extraGci: extraDeals * commission,
      lostNow: annualLeads * (1 - currentContact / 100) * (closeRate / 100) * commission,
    };
  }, [leads, commission, closeRate, currentContact, targetContact]);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Realtor Desk ROI Calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Estimate the annual GCI a Canadian real estate agent loses to slow lead follow-up, and the upside of instant AI response.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Real Estate CRM ROI Calculator | Realtor Desk"
        description="Estimate the GCI you lose to slow lead follow-up — and what instant AI response could add. Free interactive calculator for Canadian real estate agents."
        keywords="real estate ROI calculator, CRM ROI calculator, cost of missed leads calculator, speed to lead calculator, real estate lead conversion calculator Canada"
        canonicalUrl="https://www.realtordesk.ai/roi-calculator"
        structuredData={structuredData}
      />
      <Navbar />

      <section className="pt-32 md:pt-40 pb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container-custom text-center max-w-3xl">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-6 h-6 text-accent" />
          </div>
          <h1 className="mb-4">What is slow follow-up costing you?</h1>
          <p className="text-lg text-muted-foreground">
            Move the sliders to your numbers. This estimates the annual commission you leave on the
            table by not reaching every lead — and the upside of instant AI follow-up.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <Card className="p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold">Your numbers</h2>
              <Field id="leads" label="Inbound leads per month" value={leads} onChange={setLeads} min={5} max={300} step={5} />
              <Field id="commission" label="Average commission per deal" value={commission} onChange={setCommission} min={3000} max={40000} step={500} suffix=" CAD" />
              <Field id="close" label="Close rate on contacted leads" value={closeRate} onChange={setCloseRate} min={1} max={15} step={1} suffix="%" />
              <Field id="current" label="Leads you actually reach today" value={currentContact} onChange={setCurrentContact} min={10} max={95} step={5} suffix="%" />
              <Field id="target" label="Leads reached with instant AI follow-up" value={targetContact} onChange={setTargetContact} min={targetContact < currentContact ? currentContact : 20} max={98} step={2} suffix="%" />
              <p className="text-xs text-muted-foreground">
                Estimates only, based entirely on the values you enter. Not a guarantee of results.
              </p>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card className="p-6 md:p-8 bg-gradient-to-br from-primary to-primary/80 text-white">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" /> Potential added GCI / year
                </div>
                <div className="text-4xl font-bold mb-1">{CAD(result.extraGci)}</div>
                <div className="text-white/80 text-sm">
                  ≈ {result.extraDeals.toFixed(1)} additional deals per year from reaching more leads
                </div>
              </Card>

              <Card className="p-6 md:p-8 border-destructive/20">
                <div className="flex items-center gap-2 text-destructive text-sm mb-1">
                  <Clock className="w-4 h-4" /> Estimated GCI lost to unreached leads today
                </div>
                <div className="text-3xl font-bold text-destructive mb-1">{CAD(result.lostNow)}</div>
                <div className="text-sm text-muted-foreground">
                  Leads that go uncontacted at your current reach rate never get the chance to close.
                </div>
              </Card>

              <Card className="p-6 text-center">
                <p className="font-semibold mb-3">Realtor Desk answers leads in seconds, 24/7.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/signup">
                    <Button className="btn-gradient w-full sm:w-auto">Start free trial</Button>
                  </Link>
                  <Link to="/lead-response-time-canadian-realtors">
                    <Button variant="outline" className="w-full sm:w-auto">Why speed wins</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
            How it works: annual leads × reach rate × close rate × commission. The gap between your
            current reach and instant-follow-up reach is the opportunity. Read the deeper breakdown in{" "}
            <Link to="/lead-response-time-canadian-realtors" className="text-primary underline">
              our lead-response-time guide
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoiCalculator;
