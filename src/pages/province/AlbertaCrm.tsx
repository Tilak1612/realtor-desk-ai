import { Clock, Shield, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ProvinceLanding, type ProvinceData } from "./ProvinceLanding";

const data: ProvinceData = {
  slug: "real-estate-crm-alberta",
  province: "Alberta",
  demonym: "Alberta",
  title: "Real Estate CRM for Alberta REALTORS® | Realtor Desk",
  description:
    "AI CRM built for Alberta real estate agents — RECA-aware, PIPA/PIPEDA-native, CASL-compliant, bilingual, CAD pricing. 14-day free trial.",
  keywords:
    "real estate CRM Alberta, CRM for Alberta REALTORS, Calgary real estate CRM, Edmonton real estate CRM, RECA CRM, PIPA Alberta real estate, AI CRM Alberta",
  heroLede:
    "From Calgary to Edmonton and beyond — Realtor Desk helps Alberta REALTORS® steady a pipeline through the province's market cycles, respond to leads first, and keep clean records under Alberta's rules.",
  reasons: [
    {
      icon: TrendingUp,
      title: "Steady your pipeline through the cycles",
      body: "Alberta's energy-linked economy makes lead flow swing hard. AI lead scoring, automated follow-up, and database reactivation help you keep deals moving in both hot and slow markets.",
    },
    {
      icon: Clock,
      title: "Respond first in Calgary & Edmonton",
      body: "Competitive urban leads go to whoever answers fastest. 24/7 AI follow-up replies in seconds — during showings, evenings, and long weekends — so you engage before the competition.",
    },
    {
      icon: Shield,
      title: "Built for RECA & Alberta privacy law",
      body: "Consent tracking and data-export tools support your obligations under federal CASL, PIPEDA, and Alberta's own Personal Information Protection Act (PIPA), alongside the standards set by the Real Estate Council of Alberta (RECA).",
    },
    {
      icon: Zap,
      title: "AI qualification before your first call",
      body: "Every inbound lead is scored and qualified automatically, so your time goes to the buyers and sellers most ready to transact.",
    },
  ],
  complianceHeading: "Alberta compliance, without the guesswork",
  complianceBody: (
    <>
      <p>
        Real estate in Alberta is regulated by the{" "}
        <strong>Real Estate Council of Alberta (RECA)</strong>. On privacy, Alberta REALTORS® are
        subject to federal CASL anti-spam rules and Alberta's own{" "}
        <strong>Personal Information Protection Act (PIPA)</strong>, in addition to PIPEDA where it
        applies.
      </p>
      <p>
        Realtor Desk provides the records infrastructure to support these obligations — timestamped
        CASL consent, one-click data export, and full per-contact activity history — without
        replacing your brokerage's own compliance program. See our{" "}
        <Link to="/pipeda-compliance-real-estate-ai-tools-canada">privacy compliance guide</Link>{" "}
        and our{" "}
        <Link to="/edmonton-real-estate-market-2025">Edmonton market overview</Link>.
      </p>
    </>
  ),
  faqs: [
    {
      q: "Is Realtor Desk compliant with Alberta real estate and privacy rules?",
      a: "It is built around the laws that apply to Alberta REALTORS® — CASL, PIPEDA, and Alberta's PIPA — with consent tracking and data export, and it supports the record-keeping expected under RECA. It does not replace your brokerage's compliance program. This is general information, not legal advice.",
    },
    {
      q: "Does it help when the Alberta market slows down?",
      a: "Yes. When new-lead flow drops with the cycle, the highest-ROI leads are the ones you already have. Realtor Desk's automation and database reactivation tools help you generate repeat and referral business from your existing contacts.",
    },
    {
      q: "How much does it cost in Canadian dollars?",
      a: "Pricing is in CAD from $149/month, with no exchange exposure and a 14-day free trial that needs no credit card to start.",
    },
  ],
};

const AlbertaCrm = () => <ProvinceLanding data={data} />;
export default AlbertaCrm;
