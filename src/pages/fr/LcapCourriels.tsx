import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// /fr/lcap-courriels-immobilier — a French page for "LCAP courriel courtier
// immobilier". It is a short, sourced companion to the English CASL guide, not a
// translation of it: the English guide is long and leads with a penalty story we
// cannot source, so this page carries only what the law itself says.
//
// WHERE EACH STATEMENT COMES FROM
//   consent windows, content of a message, unsubscribe timing, penalties,
//   burden of proof     the Act (L.C. 2010, ch. 23) and the CRTC's guidance,
//                       linked in the body. Same figures as the corrected English
//                       guide: inquiry 6 months, purchase or contract 2 years,
//                       express consent until withdrawn, maximums of 1 M$
//                       (individuals) and 10 M$ (other cases).
//   SMS is refused with no  supabase/functions/send-sms/index.ts, "fails closed".
//   recorded consent
//   a withdrawn contact     supabase/functions/email-automation/index.ts.
//   gets no automated email
// It does not say Realtor Desk makes anyone compliant, and it names no case or
// fine as an example.

const WINDOWS = [
  { situation: "Consentement exprès (la personne a dit oui)", duree: "Sans échéance, jusqu'à ce qu'elle le retire" },
  { situation: "Achat, bail ou contrat avec vous", duree: "2 ans après la fin de la relation" },
  { situation: "Demande de renseignements ou de visite", duree: "6 mois après la demande" },
  { situation: "Adresse publiée sans mention contraire, message pertinent pour sa fonction", duree: "Pas de délai fixe; la pertinence doit tenir" },
];

const FAQS = [
  {
    q: "Mon courriel de réponse à une demande est-il visé par la LCAP ?",
    a: "Une réponse à la demande d'une personne, qui ne contient que ce qu'elle a demandé, n'a pas besoin de consentement préalable. Dès que vous y ajoutez de la promotion, comme une infolettre ou une série de courriels, il s'agit d'un message commercial et le consentement s'applique.",
  },
  {
    q: "Combien de temps puis-je écrire à quelqu'un qui m'a contacté ?",
    a: "Six mois après sa demande de renseignements, à moins qu'elle n'ait donné un consentement exprès. Le délai court à partir de la demande, pas de votre dernier message.",
  },
  {
    q: "Qui doit prouver le consentement ?",
    a: "L'expéditeur. Si une plainte est déposée, c'est à vous de montrer la date, la source et la forme du consentement. Sans trace, vous ne pouvez pas le démontrer.",
  },
  {
    q: "Que doit contenir chaque message commercial ?",
    a: "Votre identité, vos coordonnées et un mécanisme de désabonnement simple, qui reste fonctionnel au moins 60 jours après l'envoi. Une demande de désabonnement doit être traitée dans les 10 jours ouvrables.",
  },
  {
    q: "Un logiciel peut-il me rendre conforme ?",
    a: "Non. Un logiciel peut conserver la date et la source du consentement et refuser certains envois, mais la façon dont vous obtenez le consentement vous revient. Cette page est de l'information générale, pas un avis juridique.",
  },
];

const LcapCourriels = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="LCAP et courriels pour courtiers immobiliers"
        description="Ce que la LCAP exige pour écrire à un client ou à un prospect : délais de consentement, contenu du message, désabonnement et preuve. Information générale."
        keywords="LCAP courriel courtier immobilier, loi anti-pourriel immobilier, consentement implicite 6 mois, LCAP courtier immobilier Québec"
        canonicalUrl="https://www.realtordesk.ai/fr/lcap-courriels-immobilier"
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
            <h1 className="mb-6">La LCAP et les courriels d&rsquo;un courtier immobilier</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              La Loi canadienne anti-pourriel (LCAP) s&rsquo;applique aux messages
              commerciaux que vous envoyez par courriel, texto ou message direct.
              Voici les règles qui comptent le plus pour un courtier : les délais de
              consentement, ce que chaque message doit contenir et qui doit prouver
              quoi.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">En bref</h2>
              <p className="text-base mb-0">
                Il vous faut le consentement de la personne avant de lui envoyer un
                message commercial. Le consentement exprès dure jusqu&rsquo;à son
                retrait; le consentement implicite expire, après 6 mois pour une
                demande de renseignements et 2 ans pour un achat ou un contrat. La
                preuve du consentement vous incombe.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">Combien de temps dure le consentement</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">
                    Situations de consentement et durée pendant laquelle vous pouvez écrire.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Situation</th>
                      <th scope="col" className="py-2 font-semibold">Durée</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WINDOWS.map((w) => (
                      <tr key={w.situation} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{w.situation}</th>
                        <td className="py-3 text-muted-foreground">{w.duree}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Une personne qui assiste à une visite libre et inscrit son nom sur une
                feuille de présence n&rsquo;a pas pour autant consenti à recevoir
                votre infolettre. Demandez-lui son accord, de façon claire, et
                conservez la trace.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Ce que chaque message commercial doit contenir</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>Votre nom et celui de votre maison de courtage, si vous écrivez en son nom.</li>
                <li>Une adresse postale ou une autre coordonnée valide.</li>
                <li>Un moyen de se désabonner qui fonctionne au moins 60 jours après l&rsquo;envoi.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Une demande de désabonnement doit être respectée dans les 10 jours
                ouvrables. Pour les règles complètes, consultez les{" "}
                <a
                  className="underline"
                  href="https://crtc.gc.ca/fra/internet/anti.htm"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  pages du CRTC sur la loi
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="mb-4">Les sanctions</h2>
              <p className="text-muted-foreground leading-relaxed">
                La loi prévoit des sanctions administratives pécuniaires pouvant
                atteindre 1 million de dollars pour un particulier et 10 millions de
                dollars dans les autres cas. Ce sont des plafonds, pas des montants
                typiques.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Ce que fait Realtor Desk, et ce qu&rsquo;il ne fait pas</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>Un texto est refusé si aucun consentement n&rsquo;est enregistré pour le numéro.</li>
                <li>Un contact qui a retiré son consentement ne reçoit plus de courriels automatisés.</li>
                <li>
                  Les contacts importés par fichier CSV n&rsquo;arrivent pas avec un
                  consentement; voir{" "}
                  <Link className="underline" to="/fr/importer-contacts-csv">
                    l&rsquo;importation de contacts
                  </Link>
                  .
                </li>
                <li>
                  Il ne détermine pas pour vous si un consentement est valide. Cette
                  décision, et la preuve qui la soutient, restent les vôtres.
                </li>
              </ul>
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
              <h2 className="mb-3">Un CRM qui garde la trace du consentement</h2>
              <p className="text-muted-foreground mb-6">
                Essai de 14 jours; une carte est demandée au départ et rien n&rsquo;est
                facturé avant le 14e jour. Ensuite, 149 $ CA par mois pour un courtier seul.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Commencer l&rsquo;essai</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/fr/crm-immobilier">CRM immobilier bilingue</Link>
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

export default LcapCourriels;
