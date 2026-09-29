import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Brief 18 of the keyword plan: a fully French pillar at /fr/crm-immobilier,
// targeting "CRM immobilier" and "logiciel CRM courtier immobilier".
//
// WHY THIS WORKS WHEN ?lang=fr DOES NOT. The French variant of the rest of the
// site lives behind a query parameter, and Vercel checks the filesystem before
// applying rewrites and ignores the query string — so ?lang=fr can never be
// served statically, and a French visitor's page is invisible to any crawler
// that does not run JavaScript. That was verified on a preview deploy and is
// recorded in SEO-AUDIT.md.
//
// This page sidesteps that entirely: it is a normal route at a real path, so
// the prerenderer emits it like any other page and a crawler gets French HTML.
// It is one French page, not a locale migration — the sitewide fix still needs
// path-based locales.
//
// The copy is written in French rather than translated from an English draft.
// Product facts match the English pages exactly: 149 $ CA, hosted in Canada,
// Realtor.ca import today, CREA DDF® Q3 2026 roadmap, no automatic sending.

const FAQS = [
  {
    q: "Qu'est-ce qu'un CRM immobilier ?",
    a: "Un logiciel qui regroupe vos clients et vos prospects au même endroit, conserve l'historique de vos échanges et vous indique qui relancer ensuite. Il remplace le mélange habituel de chiffrier, de notes de téléphone et de recherches dans la boîte de réception.",
  },
  {
    q: "Realtor Desk fonctionne-t-il vraiment en français ?",
    a: "Oui. L'interface que vous utilisez et les courriels que votre client reçoit fonctionnent tous les deux en français. Ce n'est pas un site web traduit devant un produit anglais : la langue se règle par contact, donc un client montréalais peut être suivi entièrement en français même si vous travaillez en anglais.",
  },
  {
    q: "Où sont hébergées les données de mes clients ?",
    a: "Au Canada. C'est la question que posent le plus souvent les clients québécois, et la réponse compte autant pour la Loi 25 que pour la LPRPDE.",
  },
  {
    q: "Le logiciel répond-il automatiquement à mes prospects ?",
    a: "Non. Realtor Desk classe vos prospects, propose une prochaine action et un moment pour l'effectuer, mais aucun message n'est envoyé sans vous. C'est un choix délibéré : sous la LCAP, un système qui envoie généreusement en votre nom crée un risque en votre nom.",
  },
  {
    q: "Et les fiches inscriptions ?",
    a: "Vous pouvez importer une propriété à partir d'une adresse Realtor.ca ou d'un numéro MLS dès aujourd'hui. La synchronisation native SDD® de l'ACI est prévue pour le T3 2026 et n'est pas encore active — nous le disons plutôt que de laisser croire le contraire.",
  },
  {
    q: "Combien ça coûte ?",
    a: "149 $ CA par mois pour un courtier seul, 299 $ pour le forfait Équipe, sans frais d'installation. Essai de 14 jours; une carte est demandée au départ et rien n'est facturé avant le 14e jour.",
  },
];

const CrmImmobilier = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="CRM immobilier bilingue pour courtiers"
        description="Un CRM immobilier où l'interface et les courriels clients fonctionnent en français. Données hébergées au Canada et tarifs en dollars canadiens."
        keywords="crm immobilier, logiciel crm courtier immobilier, crm immobilier québec, logiciel immobilier français"
        canonicalUrl="https://www.realtordesk.ai/fr/crm-immobilier"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: "fr-CA",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />
      <Navbar />

      <main lang="fr-CA">
        <section className="pt-32 md:pt-40 pb-10">
          <div className="container-custom max-w-3xl">
            <h1 className="mb-6">CRM immobilier bilingue pour courtiers</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Realtor Desk est un CRM immobilier dont l&rsquo;interface et les
              courriels clients fonctionnent en français comme en anglais. Les
              données sont hébergées au Canada et la facturation est en dollars
              canadiens. La différence se voit la première fois qu&rsquo;un client
              vous répond en français.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <div>
              <h2 className="mb-4">Deux choses s&rsquo;appellent « bilingue »</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                La première est un site web traduit avec un produit anglais
                derrière. La seconde est un logiciel que votre équipe utilise en
                français et des courriels que votre client reçoit en français.
                L&rsquo;écart entre les deux est considérable, et il apparaît au
                pire moment : quand vous devez écrire à un client.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Chez Realtor Desk, la langue se règle par contact. Votre interface
                peut rester en anglais pendant qu&rsquo;un client de la Rive-Sud
                reçoit tout en français.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Pourquoi c&rsquo;est si rare</h2>
              <p className="text-muted-foreground leading-relaxed">
                La plupart des CRM immobiliers sont conçus pour le marché
                américain, où le bilinguisme est un cas particulier plutôt
                qu&rsquo;une exigence. L&rsquo;ajouter après coup coûte cher : il ne
                s&rsquo;agit pas seulement de traduire des mots, mais de transporter
                une préférence linguistique dans chaque gabarit, chaque
                notification et chaque message envoyé au client. Les fournisseurs
                qui se localisent commencent donc par le site web, parce que
                c&rsquo;est la moitié facile. Vérifiez laquelle on vous vend.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Ce que fait le produit</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  Tous vos prospects dans une seule liste, dédoublonnés par adresse
                  courriel.
                </li>
                <li>
                  Une note de 0 à 100 par prospect, calculée à partir de
                  l&rsquo;engagement, du comportement, de la correspondance au
                  budget, de l&rsquo;échéancier et de la qualification — avec le
                  détail visible, pas une boîte noire.
                </li>
                <li>
                  Un fil de conversation unique par client : appels, courriels,
                  notes et rendez-vous au même endroit.
                </li>
                <li>
                  Un pipeline glisser-déposer avec les totaux en dollars canadiens.
                </li>
                <li>
                  Consentement LCAP enregistré par contact : sans consentement,
                  l&rsquo;envoi est refusé plutôt que tenté.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-4">Ce que nous ne prétendons pas</h2>
              <p className="text-muted-foreground leading-relaxed">
                Un logiciel ne vous rend pas conforme. Héberger les données au
                Canada et écrire à vos clients dans leur langue vous aide à
                respecter vos obligations sous la LPRPDE, la LCAP et la Loi 25 du
                Québec; cela ne les remplace pas. La façon dont vous obtenez le
                consentement et traitez les demandes demeure votre responsabilité.
              </p>
            </div>

            <div>
              <h2 className="mb-6">Questions fréquentes</h2>
              <div className="space-y-6">
                {FAQS.map((f) => (
                  <div key={f.q}>
                    <h3 className="text-base font-semibold mb-2">{f.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Travaillez dans les deux langues</h2>
              <p className="text-muted-foreground mb-6">
                149 $ CA par mois, sans frais d&rsquo;installation. Données au
                Canada, essai de 14 jours.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/pricing">Voir les tarifs</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/features/bilingual-crm">En savoir plus</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CrmImmobilier;
