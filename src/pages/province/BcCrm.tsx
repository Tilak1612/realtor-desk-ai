import { Clock, Shield, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ProvinceLanding, type ProvinceData } from "./ProvinceLanding";

const data: ProvinceData = {
  slug: "real-estate-crm-british-columbia",
  province: "British Columbia",
  demonym: "BC",
  title: "Real Estate CRM for BC REALTORS® | Realtor Desk",
  description:
    "AI CRM built for British Columbia real estate agents — BCFSA-aware, PIPA/PIPEDA-native, CASL-compliant, bilingual, CAD pricing. 14-day free trial.",
  keywords:
    "real estate CRM British Columbia, CRM for BC REALTORS, Vancouver real estate CRM, BCFSA CRM, PIPA BC real estate, AI CRM BC",
  heroLede:
    "From Metro Vancouver to Victoria to the Fraser Valley — Realtor Desk helps BC REALTORS® respond to leads first, keep clean records under BC's rules, and never lose a lead in one of North America's most competitive markets.",
  reasons: [
    {
      icon: Clock,
      title: "Win Metro Vancouver's speed race",
      body: "Greater Vancouver is one of the most competitive markets on the continent — online leads are contacted by several agents within minutes. 24/7 AI follow-up replies in seconds so you're first, even mid-showing.",
    },
    {
      icon: Shield,
      title: "Built for BCFSA & BC privacy law",
      body: "Consent tracking and data-export tools support your obligations under both federal CASL and BC's own Personal Information Protection Act (PIPA), alongside the standards overseen by the BC Financial Services Authority (BCFSA).",
    },
    {
      icon: Zap,
      title: "AI lead scoring & qualification",
      body: "Every inbound lead is scored and qualified before your first call — so your limited hours go to the buyers and sellers most likely to transact in a high-stakes market.",
    },
    {
      icon: Globe,
      title: "Bilingual & Canadian-hosted",
      body: "Fully bilingual (EN/FR) with Canadian data handling — the right fit for BC brokerages that care where client data lives.",
    },
  ],
  complianceHeading: "BC compliance, without the guesswork",
  complianceBody: (
    <>
      <p>
        Real estate in British Columbia is regulated by the{" "}
        <strong>BC Financial Services Authority (BCFSA)</strong>, which took over real estate
        regulation in 2021. On privacy, BC agents are subject to both federal CASL anti-spam rules
        and British Columbia's own{" "}
        <strong>Personal Information Protection Act (PIPA)</strong>, in addition to PIPEDA where it
        applies.
      </p>
      <p>
        Realtor Desk gives you the infrastructure to support these: timestamped CASL consent
        records, one-click data export for access requests, and a complete retained activity
        history per contact. It complements — it doesn't replace — your brokerage's compliance
        program. See our{" "}
        <Link to="/pipeda-compliance-real-estate-ai-tools-canada">privacy compliance guide</Link>{" "}
        and{" "}
        <Link to="/resources/casl-compliance-real-estate-email-marketing-canada">CASL guide</Link>.
      </p>
    </>
  ),
  faqs: [
    {
      q: "Is Realtor Desk compliant with BC real estate and privacy rules?",
      a: "Realtor Desk is built around the federal and BC privacy and anti-spam laws that apply to BC REALTORS® — CASL, PIPEDA, and BC's PIPA — with consent tracking and data export, and it supports the record-keeping expected under BCFSA oversight. It does not replace your brokerage's compliance program. This is general information, not legal advice.",
    },
    {
      q: "Does it work for Greater Vancouver REALTORS® and other BC boards?",
      a: "Yes — Realtor Desk is board-agnostic and works across Greater Vancouver, the Fraser Valley, Victoria, and every other BC board. Native CREA DDF® (Canadian MLS) integration is on the Q3 2026 roadmap.",
    },
    {
      q: "How much does it cost in Canadian dollars?",
      a: "Pricing is in CAD from $149/month, with no US-dollar exchange exposure and a 14-day free trial that needs no credit card to start.",
    },
  ],
};

const BcCrm = () => <ProvinceLanding data={data} />;
export default BcCrm;
