import { GenericCrmCompare, type GenericCompareData } from "./GenericCrmCompare";

const data: GenericCompareData = {
  slug: "realtor-desk-vs-hubspot",
  competitor: "HubSpot",
  title: "Realtor Desk vs HubSpot for REALTORS® | Realtor Desk",
  description:
    "HubSpot is a powerful general CRM, but it's not built for real estate. See how Realtor Desk compares for Canadian REALTORS® — MLS, CASL, bilingual, CAD.",
  keywords:
    "Realtor Desk vs HubSpot, HubSpot for real estate, HubSpot alternative realtors, real estate CRM vs HubSpot, best CRM for Canadian realtors",
  intro: (
    <>
      <p>
        HubSpot is an excellent general-purpose CRM and marketing platform. But it was built for
        B2B sales and marketing teams — not for a real estate agent juggling showings, offers, and
        Canadian compliance.
      </p>
      <p>
        Realtor Desk is AI-native and purpose-built for Canadian REALTORS®: lead scoring tuned to
        buyer/seller intent, CASL-aware follow-up, bilingual EN/FR, CAD pricing, and CREA DDF® (MLS)
        integration on the roadmap. Here's how the two compare for real estate specifically.
      </p>
    </>
  ),
  rows: [
    { capability: "Purpose-built for real estate", realtorDesk: "Yes, AI-native", competitor: "General B2B CRM", competitorHas: false },
    { capability: "Real-estate lead scoring", realtorDesk: "Buyer/seller intent", competitor: "Generic scoring", competitorHas: false },
    { capability: "CREA DDF® / Canadian MLS", realtorDesk: "On the Q3 2026 roadmap", competitor: "Not built-in", competitorHas: false },
    { capability: "CASL-tuned email/SMS follow-up", realtorDesk: "Yes", competitor: "Generic, not CASL-tuned", competitorHas: false },
    { capability: "Bilingual EN/FR", realtorDesk: "Yes, first-class", competitor: "UI localization only", competitorHas: true },
    { capability: "PIPEDA-oriented consent & export", realtorDesk: "Built-in", competitor: "Configurable", competitorHas: true },
    { capability: "Pricing", realtorDesk: "CAD from $149/mo", competitor: "USD, scales up fast", competitorHas: true },
    { capability: "Setup complexity", realtorDesk: "Agent-ready in minutes", competitor: "Often needs an admin", competitorHas: true },
  ],
  faqs: [
    {
      q: "Can't I just configure HubSpot for real estate?",
      a: "You can, with time and often an admin or paid marketplace add-ons. Realtor Desk gives you real-estate lead scoring, CASL-aware follow-up, bilingual support, and Canadian compliance tooling out of the box — without building it yourself.",
    },
    {
      q: "Is Realtor Desk cheaper than HubSpot?",
      a: "Realtor Desk is priced in CAD from $149/month with real-estate features included. HubSpot's real cost depends on which hubs and seat tiers you need, priced in USD; for a solo agent or small team the total is often higher once you add the pieces real estate requires.",
    },
    {
      q: "What if I already use HubSpot?",
      a: "Many agents move contact and deal data over during their free trial. See our broader CRM guidance in the Canadian AI CRM guide.",
    },
  ],
};

const VsHubspot = () => <GenericCrmCompare data={data} />;
export default VsHubspot;
