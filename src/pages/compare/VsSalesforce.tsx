import { GenericCrmCompare, type GenericCompareData } from "./GenericCrmCompare";

const data: GenericCompareData = {
  slug: "realtor-desk-vs-salesforce",
  competitor: "Salesforce",
  title: "Realtor Desk vs Salesforce for REALTORS® | Realtor Desk",
  description:
    "Salesforce is enterprise-grade but heavy and generic. See how Realtor Desk compares for Canadian real estate agents — purpose-built, bilingual, CAD, no admin.",
  keywords:
    "Realtor Desk vs Salesforce, Salesforce for real estate, Salesforce alternative realtors, real estate CRM vs Salesforce, best CRM for Canadian realtors",
  intro: (
    <>
      <p>
        Salesforce is the enterprise CRM standard — endlessly customizable and powerful. But that
        power comes with weight: it typically needs an admin or consultant to configure, and it
        wasn't designed for how a real estate agent actually works.
      </p>
      <p>
        Realtor Desk is the opposite trade-off: AI-native, purpose-built for Canadian REALTORS®, and
        usable the day you sign up — with real-estate lead scoring, CASL-aware follow-up, bilingual
        support, and CAD pricing. Here's the comparison for real estate specifically.
      </p>
    </>
  ),
  rows: [
    { capability: "Purpose-built for real estate", realtorDesk: "Yes, AI-native", competitor: "Generic, needs config", competitorHas: false },
    { capability: "Time to value", realtorDesk: "Minutes, agent-ready", competitor: "Weeks, often an admin", competitorHas: false },
    { capability: "Real-estate lead scoring", realtorDesk: "Buyer/seller intent", competitor: "Build-your-own", competitorHas: false },
    { capability: "CREA DDF® / Canadian MLS", realtorDesk: "On the Q3 2026 roadmap", competitor: "Custom integration", competitorHas: false },
    { capability: "CASL-tuned follow-up", realtorDesk: "Yes", competitor: "Configurable", competitorHas: false },
    { capability: "Bilingual EN/FR", realtorDesk: "Yes, first-class", competitor: "Enterprise localization", competitorHas: true },
    { capability: "Pricing", realtorDesk: "CAD from $149/mo", competitor: "USD, enterprise tiers", competitorHas: true },
    { capability: "Admin required", realtorDesk: "No", competitor: "Usually yes", competitorHas: false },
  ],
  faqs: [
    {
      q: "Is Salesforce overkill for a real estate agent or small team?",
      a: "For most individual agents and small teams, yes — Salesforce's power is aimed at large sales organizations and typically requires configuration and administration. Realtor Desk delivers the real-estate-specific features agents need without that overhead.",
    },
    {
      q: "Can Salesforce do real estate?",
      a: "With enough customization or a real-estate add-on, it can. Realtor Desk includes real-estate lead scoring, CASL-aware follow-up, bilingual support, and Canadian compliance tooling out of the box, so you don't build or pay for that separately.",
    },
    {
      q: "How is pricing different?",
      a: "Realtor Desk is CAD from $149/month with real-estate features included. Salesforce is priced in USD across enterprise tiers, and the total cost of ownership usually includes implementation and admin time.",
    },
  ],
};

const VsSalesforce = () => <GenericCrmCompare data={data} />;
export default VsSalesforce;
