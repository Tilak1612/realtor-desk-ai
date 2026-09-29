import { CAL_ROUTE } from "@/config/booking";
import type { FaqItem } from "@/components/rd/marketing/FAQAccordion";
import type { ResourceLink } from "@/components/rd/marketing/ResourceCards";

// Homepage prose for the two sections added from the redesign brief's sequence
// (step 9, resources; step 10, FAQ). Kept out of Home.tsx because the brief
// asks for new prose to live outside JSX, and because the FAQ array has to be
// readable from two places at once: the visible accordion and the FAQPage
// JSON-LD. One array, both consumers — the markup cannot drift from the text.
//
// French is written, not machine-translated from the English. These are the
// answers a Quebec buyer reads before deciding whether the bilingual claim is
// real, so an obviously-translated FAQ would undercut the thing it describes.
//
// EVERY ANSWER TRACES TO SOMETHING SHIPPED:
//   14 days, card up front, nothing before day 14  → /pricing, Stripe config
//   $149 / $299 CAD                                 → the same
//   no automatic sending                            → deliberate; CASL posture
//   EN/FR per contact                               → /features/bilingual-crm
//   Zapier, Make, n8n, Twilio live                  → /integrations
//   Calendar connects but does not sync             → api/integrations/google
//   CREA DDF® Q3 2026                               → /roadmap
//   data in Canada                                  → ca-central-1
// Nothing here claims a conversion lift, a time saving or a customer count.

export function HOME_FAQS(isFr: boolean): FaqItem[] {
  if (isFr) {
    return [
      {
        q: "À qui s’adresse Realtor Desk ?",
        a: "Aux courtiers immobiliers canadiens. C’est aujourd’hui un produit pour un courtier seul : il n’y a ni sièges, ni attribution, ni pipeline partagé. Nos pages Équipes et Agences l’expliquent franchement plutôt que de vous le laisser découvrir en troisième semaine.",
      },
      {
        q: "Puis-je l’essayer d’abord ?",
        a: "Oui, pendant 14 jours. Une carte est demandée au départ et rien n’est facturé avant le 14e jour. Ensuite, 149 $ CA par mois pour un courtier seul et 299 $ pour le forfait Équipe, sans frais d’installation.",
      },
      {
        q: "Est-ce que ça fonctionne vraiment en français ?",
        a: "Oui, et les deux moitiés comptent : l’interface que vous utilisez et les courriels que votre client reçoit. La langue se règle par contact, donc un client montréalais peut être suivi entièrement en français même si vous travaillez en anglais.",
      },
      {
        q: "Le logiciel relance-t-il mes prospects automatiquement ?",
        a: "Non. Realtor Desk propose une prochaine action et un moment pour l’effectuer, puis s’arrête. Aucun message ne part sans vous. C’est un choix : sous la LCAP, un système qui envoie généreusement en votre nom crée un risque en votre nom.",
      },
      {
        q: "Quelles intégrations fonctionnent aujourd’hui ?",
        a: "Zapier, Make et n8n poussent les nouveaux prospects directement. Twilio envoie des SMS, conditionnés au consentement. Google Agenda et Outlook se connectent, mais la synchronisation des rendez-vous n’est pas encore active. La synchronisation SDD® de l’ACI est prévue pour le T3 2026. La page Intégrations sépare le disponible du prévu.",
      },
      {
        q: "Où sont hébergées les données de mes clients ?",
        a: "Au Canada. Cela aide à respecter vos obligations sous la LPRPDE et la Loi 25, sans les remplacer : un logiciel ne vous rend pas conforme.",
      },
    ];
  }

  return [
    {
      q: "Who is Realtor Desk for?",
      a: "Canadian real estate agents. Today it is a single-agent product — there are no seats, no lead assignment and no shared pipeline. Our Teams and Brokerages pages say so plainly rather than letting you find out in week three.",
    },
    {
      q: "Can I try it first?",
      a: "Yes, for 14 days. A card is collected up front and nothing is charged before day 14. After that it is CAD $149 a month for a single agent and $299 for the Team plan, with no setup fee.",
    },
    {
      q: "Does it actually work in French?",
      a: "Yes, and both halves matter: the interface you use and the email your client receives. Language is set per contact, so a Montreal client can be worked entirely in French while you work in English.",
    },
    {
      q: "Does it follow up with my leads automatically?",
      a: "No. Realtor Desk suggests a next action and a time to take it, then stops. Nothing goes out without you. That is deliberate — under CASL, a system that sends generously on your behalf creates risk in your name, not ours.",
    },
    {
      q: "Which integrations work today?",
      a: "Zapier, Make and n8n push new leads straight in. Twilio sends SMS, gated on consent. Google Calendar and Outlook connect, but appointment sync is not live yet. Native CREA DDF® sync is on the roadmap for Q3 2026. The integrations page separates what is available from what is planned.",
    },
    {
      q: "Where is my client data stored?",
      a: "In Canada. That helps you meet obligations under PIPEDA and Quebec's Law 25 — it does not replace them. Software cannot make you compliant.",
    },
  ];
}

export function HOME_RESOURCES(isFr: boolean): ResourceLink[] {
  if (isFr) {
    return [
      {
        to: "/what-is-a-real-estate-crm",
        title: "Qu’est-ce qu’un CRM immobilier ?",
        blurb: "Commencez ici si vous travaillez encore dans un chiffrier et vous demandez ce qu’un CRM changerait vraiment.",
      },
      {
        to: "/resources/casl-compliance-real-estate-email-marketing-canada",
        title: "La LCAP et le courriel immobilier",
        blurb: "Ce que le consentement exige réellement, et les erreurs courantes qui coûtent cher.",
      },
      {
        to: "/resources/real-estate-crm-pricing",
        title: "Ce que coûte vraiment un CRM immobilier",
        blurb: "Qui publie ses prix, qui ne le fait pas, et ce que cela révèle avant même la démonstration.",
      },
    ];
  }

  return [
    {
      to: "/what-is-a-real-estate-crm",
      title: "What a real estate CRM actually is",
      blurb: "Start here if you are still working from a spreadsheet and wondering what a CRM would genuinely change.",
    },
    {
      to: "/resources/casl-compliance-real-estate-email-marketing-canada",
      title: "CASL and real estate email",
      blurb: "What consent actually requires, and the common mistakes that get expensive.",
    },
    {
      to: "/resources/real-estate-crm-pricing",
      title: "What a real estate CRM really costs",
      blurb: "Who publishes their pricing, who does not, and what that tells you before the demo.",
    },
  ];
}

// ── The Canadian-workflow prose block ─────────────────────────────────────
//
// This ran to roughly 700 words of hardcoded English in Home.tsx, and it stayed
// English when the site switched to French — on the homepage, for a product
// whose central claim is that it works in both languages. The brief names this
// exact failure ("Do not silently show English while marking the page lang=fr")
// and the file's own header comment claimed every string already flowed through
// t(), which stopped being true as the section grew.
//
// Paragraphs are segment arrays rather than strings because several carry
// inline links. A translated string with markup baked in cannot be linked
// safely; splitting the segments keeps the link targets identical across
// locales while letting the sentence around them be rewritten rather than
// word-swapped.

export type ProseSegment = string | { to: string; text: string };

export interface ProseBlock {
  h: string;
  p: ProseSegment[];
}

export function HOME_WORKFLOW(isFr: boolean): { heading: string; blocks: ProseBlock[] } {
  if (isFr) {
    return {
      heading: "Un CRM immobilier conçu autour du flux de travail canadien",
      blocks: [
        {
          h: "Tous vos prospects au même endroit",
          p: [
            "Les demandes venues de votre site web, des portails, des visites libres et des références arrivent dans une seule liste plutôt que dans trois boîtes de réception et un carnet. Chacune devient un contact avec sa source, dédoublonné par adresse courriel — la même personne qui écrit deux fois ne devient donc pas deux fiches.",
          ],
        },
        {
          h: "Savoir quelle relance compte aujourd’hui",
          p: [
            "Chaque prospect porte une note fondée sur son engagement réel. C’est une invitation à regarder, pas un verdict : vous voyez ce qui l’alimente et vous pouvez la contredire. Le but n’est pas de classer des gens, c’est d’éviter que le prospect chaud s’éteigne pendant que vous traitez la liste dans l’ordre d’arrivée.",
          ],
        },
        {
          h: "Une conversation par client, pas cinq",
          p: [
            "Appels, courriels, notes et rendez-vous se rattachent au contact. Avant de décrocher le téléphone, « qu’est-ce que je lui ai dit la dernière fois ? » a une seule réponse à un seul endroit — c’est la différence entre une relance informée et un appel à froid.",
          ],
        },
        {
          h: "Un pipeline lisible en dollars canadiens",
          p: [
            "Glissez les transactions entre les étapes et voyez les totaux en dollars canadiens. Aucun taux de change ne s’interpose entre vous et vos propres chiffres — le reproche constant fait aux logiciels facturés en USD quand on gère une entreprise canadienne.",
          ],
        },
        {
          h: "Pensé pour les règles canadiennes, pas adapté après coup",
          p: [
            "Les données clients sont hébergées au Canada. Chaque courriel porte un enregistrement de consentement et un lien de désabonnement fonctionnel, parce que la LCAP n’est pas facultative. L’interface et les courriels destinés au client fonctionnent en français, pas seulement le site web. Les fiches s’importent depuis Realtor.ca aujourd’hui; la synchronisation native SDD® de l’ACI est prévue pour le T3 2026, et nous le disons plutôt que de laisser croire que c’est déjà actif.",
          ],
        },
        {
          h: "Ce à quoi il se connecte",
          p: [
            "Zapier, Make et n8n poussent les nouveaux prospects directement. Twilio envoie des SMS, conditionnés au consentement. Google Agenda et Outlook se connectent aujourd’hui, mais l’envoi automatique des rendez-vous est encore en développement. La ",
            { to: "/integrations", text: "page des intégrations" },
            " sépare ce qui est actif de ce qui est prévu, au lieu de compter les deux sous un même chiffre.",
          ],
        },
        {
          h: "Par où commencer",
          p: [
            "Si vous vous demandez encore ce qu’un CRM devrait faire pour vous, commencez par ",
            { to: "/what-is-a-real-estate-crm", text: "ce qu’est réellement un CRM immobilier" },
            ". Si vous comparez des produits, ",
            { to: "/blog/best-crm-canada-2025", text: "notre comparatif des options canadiennes" },
            " dit franchement où un autre produit convient mieux. Si vous êtes prêt à regarder celui-ci, la ",
            { to: CAL_ROUTE, text: "démonstration" },
            " parcourt le produit en direct et la page ",
            { to: "/pricing", text: "tarifs" },
            " détaille ce qu’implique l’essai de 14 jours.",
          ],
        },
      ],
    };
  }

  return {
    heading: "A real estate CRM built around the Canadian workflow",
    blocks: [
      {
        h: "Keep every lead in one place",
        p: [
          "Enquiries from your website, from portals, from open houses and from referrals land in one list instead of three inboxes and a notebook. Each one becomes a contact with a source attached, de-duplicated by email address, so the same person asking twice does not become two records.",
        ],
      },
      {
        h: "Know which follow-up matters today",
        p: [
          "Every lead carries a score based on how it has actually engaged. It is a prompt for your attention, not a verdict — you can see what fed it and overrule it. The point is not to rank people; it is to stop the warm one going quiet while you work through the list in the order it arrived.",
        ],
      },
      {
        h: "One conversation per client, not five",
        p: [
          "Calls, emails, notes and appointments attach to the contact. Before you pick up the phone, “what did I last tell this person?” has one answer in one place, which is the difference between a follow-up that sounds informed and one that sounds like a cold call.",
        ],
      },
      {
        h: "A pipeline you can read in CAD",
        p: [
          "Drag deals between stages and see totals in Canadian dollars. No exchange rate sitting between you and your own numbers, which is the standing complaint about running a Canadian business on US-billed software.",
        ],
      },
      {
        h: "Built for Canadian rules, not adapted to them",
        p: [
          "Client data is hosted in Canada. Email carries a consent record and a working unsubscribe path, because CASL is not optional. The interface and the client-facing email both work in French, not just the marketing site. Listings import from Realtor.ca today; native CREA DDF® sync is on the roadmap for Q3 2026, and we say so rather than implying it already works.",
        ],
      },
      {
        h: "What it connects to",
        p: [
          "Zapier, Make and n8n push new leads straight in. Twilio sends SMS, gated on consent. Google Calendar and Outlook connect today, with automatic appointment push still in build. The ",
          { to: "/integrations", text: "integrations page" },
          " separates what is live from what is planned rather than listing both under one number.",
        ],
      },
      {
        h: "Where to start",
        p: [
          "If you are still deciding what a CRM should do for you, start with ",
          { to: "/what-is-a-real-estate-crm", text: "what a real estate CRM actually is" },
          ". If you are comparing products, ",
          { to: "/blog/best-crm-canada-2025", text: "our comparison of Canadian options" },
          " is honest about where another product fits better. If you are ready to look at this one, the ",
          { to: CAL_ROUTE, text: "demo" },
          " walks the live product and ",
          { to: "/pricing", text: "pricing" },
          " lists what the 14-day trial involves.",
        ],
      },
    ],
  };
}
