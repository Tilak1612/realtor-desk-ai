import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// /fr/importer-contacts-csv — French counterpart of /features/import-contacts.
// Every statement is the same as the English page and comes from the same
// place, src/lib/csvImport.ts and ImportContactsModal.tsx, read 2026-10-02:
// accepted headers, name splitting, semicolon tags, company/website/title/notes
// kept in the contact's metadata, rows with neither name nor email skipped,
// no consent in the payload, no duplicate merging, CSV only.

const CHAMPS = [
  { champ: "Prénom", entetes: "first name, firstname, given name" },
  { champ: "Nom de famille", entetes: "last name, lastname, family name, surname" },
  { champ: "Nom complet", entetes: "full name, name, contact name, display name. Séparé au premier espace s'il n'y a ni prénom ni nom de famille" },
  { champ: "Courriel", entetes: "email, email address, e-mail, emailaddress" },
  { champ: "Téléphone", entetes: "phone, mobile, phone number, mobile phone, cell, cell phone, telephone" },
  { champ: "Source", entetes: "source, lead source. Une étiquette d'importation par défaut si la cellule est vide" },
  { champ: "Étiquettes", entetes: "tags, labels. Séparez plusieurs étiquettes par des points-virgules" },
];

const FAQS = [
  {
    q: "Quels formats de fichier puis-je importer ?",
    a: "Le format CSV seulement. Exportez votre chiffrier ou les contacts de votre ancien CRM en CSV, puis téléversez le fichier. L'importateur gère les champs entre guillemets contenant des virgules, la marque d'ordre d'octets qu'Excel ajoute et les fins de ligne Windows ou mixtes.",
  },
  {
    q: "Les noms de colonnes doivent-ils être identiques ?",
    a: "Non, mais ils doivent être proches. Les en-têtes sont comparés sans tenir compte des majuscules, des espaces et de la ponctuation, et les noms reconnus sont les noms anglais du tableau : une colonne « Prénom » n'est pas reconnue, il faut la renommer first name. Il n'y a pas d'écran de correspondance, alors renommez les colonnes dans le fichier avant d'importer.",
  },
  {
    q: "Que deviennent les colonnes non reconnues ?",
    a: "L'entreprise, le site web, le titre du poste et les notes sont conservés dans les métadonnées du contact. Toute autre colonne n'est pas importée.",
  },
  {
    q: "Les contacts importés sont-ils prêts à recevoir des courriels ?",
    a: "Non. L'importation n'enregistre pas de consentement, et sous la LCAP, c'est à vous de prouver que vous l'avez. Consignez la date et la source du consentement de chaque contact avant de lui écrire.",
  },
  {
    q: "L'importateur supprime-t-il les doublons ?",
    a: "Non. Il insère les lignes telles quelles : un contact qui apparaît deux fois dans le fichier sera créé deux fois. Nettoyez le fichier avant d'importer et n'importez un fichier qu'une seule fois.",
  },
  {
    q: "Comment saurai-je ce qui a été importé ?",
    a: "À la fin de l'importation, le nombre de lignes importées et non importées est affiché. Les lignes sans nom ni courriel sont ignorées et comptées parmi les erreurs.",
  },
];

const ImporterContacts = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Importer des contacts dans un CRM par CSV"
        description="Importez vos contacts dans Realtor Desk par CSV : colonnes reconnues, ce qui est conservé ou ignoré, et pourquoi le consentement n'est pas importé."
        keywords="importer contacts CRM, importer contacts CSV, CRM immobilier importation, changer de CRM immobilier, migrer contacts chiffrier"
        canonicalUrl="https://www.realtordesk.ai/fr/importer-contacts-csv"
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
            <h1 className="mb-6">Importer vos contacts depuis un chiffrier ou un autre CRM</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Exportez un fichier CSV, téléversez-le, et vos contacts sont en place.
              Cette page indique les colonnes que l&rsquo;importateur lit, ce qu&rsquo;il
              conserve et ce qu&rsquo;il ne fait pas, pour que vous prépariez le
              fichier avant de commencer.
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">En bref</h2>
              <p className="text-base mb-0">
                Realtor Desk importe des contacts depuis un fichier CSV. Il lit les
                noms, le courriel, le téléphone, la source et les étiquettes, conserve
                l&rsquo;entreprise, le titre du poste et les notes dans les métadonnées
                du contact, et ignore les lignes sans nom ni courriel. Il n&rsquo;importe
                pas le consentement, ne fusionne pas les doublons et n&rsquo;apporte
                pas les transactions : nettoyez le fichier d&rsquo;abord, consignez le
                consentement ensuite.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">Les colonnes reconnues</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Les en-têtes sont reconnus par leur nom anglais, sans tenir compte des
                majuscules, des espaces et de la ponctuation. Renommez une colonne
                « Prénom » en first name avant d&rsquo;importer.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">Champs d&rsquo;un contact et en-têtes CSV reconnus pour chacun.</caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Champ</th>
                      <th scope="col" className="py-2 font-semibold">En-têtes reconnus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHAMPS.map((c) => (
                      <tr key={c.champ} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{c.champ}</th>
                        <td className="py-3 text-muted-foreground">{c.entetes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="mb-4">Avant d&rsquo;importer</h2>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-5">
                <li>
                  <strong className="text-foreground">Éliminez les doublons.</strong>{" "}
                  Triez par courriel et supprimez les répétitions, car l&rsquo;importateur ne le fait pas.
                </li>
                <li>
                  <strong className="text-foreground">Vérifiez les en-têtes.</strong>{" "}
                  Renommez toute colonne absente du tableau ci-dessus.
                </li>
                <li>
                  <strong className="text-foreground">Essayez vingt lignes.</strong>{" "}
                  Voyez comment elles arrivent, puis importez le reste.
                </li>
                <li>
                  <strong className="text-foreground">Consignez le consentement ensuite.</strong>{" "}
                  Voir{" "}
                  <Link className="underline" to="/fr/lcap-courriels-immobilier">
                    la LCAP et les courriels d&rsquo;un courtier
                  </Link>
                  .
                </li>
              </ol>
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
              <h2 className="mb-3">Essayez avec vingt contacts</h2>
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

export default ImporterContacts;
