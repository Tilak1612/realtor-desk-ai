import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

// /fr/loi-25-courtier-immobilier — French twin of /law-25-quebec-real-estate
// (src/pages/Law25QuebecRealEstate.tsx), written 2026-10-12. The two are paired
// in src/config/hreflangPairs.ts and must say the same thing: change one, change
// the other.
//
// Every legal statement is taken from the Commission d'accès à l'information du
// Québec, « Principaux changements apportés par la Loi 25 », read 12 October
// 2026 (SOURCE below), in the Commission's own vocabulary (responsable de la
// protection des renseignements personnels, évaluation des facteurs relatifs à
// la vie privée, incident de confidentialité). Dates appear only where that page
// gives them. Product statements are the same as on the English page.
//
// The French has not had a native review; that is on the owner's list.

const SOURCE =
  "https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25";
const CONSULTE = "12 octobre 2026";

type Obligation = { titre: string; regle: string; pratique: string };

const OBLIGATIONS: Obligation[] = [
  {
    titre: "Un responsable",
    regle: "La personne ayant la plus haute autorité dans l'entreprise est responsable de la protection des renseignements personnels et peut déléguer cette fonction par écrit. Son titre et ses coordonnées doivent être publiés sur le site Web de l'entreprise.",
    pratique: "Si vous travaillez pour une agence, demandez qui exerce cette fonction. Si vous avez votre propre entreprise, c'est vous, tant que vous ne l'avez pas déléguée.",
  },
  {
    titre: "Des politiques de gouvernance",
    regle: "L'entreprise doit établir et appliquer des politiques et des pratiques sur la conservation et la destruction des renseignements, les rôles et responsabilités du personnel et le traitement des plaintes, et publier de l'information détaillée à leur sujet.",
    pratique: "Mettez par écrit combien de temps vous gardez les dossiers, qui peut les consulter et comment un client porte plainte.",
  },
  {
    titre: "Une politique de confidentialité",
    regle: "L'entreprise qui recueille des renseignements personnels par un moyen technologique doit diffuser une politique de confidentialité en termes simples et clairs, et aviser de toute modification.",
    pratique: "Un formulaire de contact sur votre site est une collecte par un moyen technologique.",
  },
  {
    titre: "La transparence à la collecte",
    regle: "Depuis septembre 2023, au moment de la collecte, l'entreprise doit indiquer les fins et les moyens de la collecte, les droits d'accès et de rectification, le droit de retirer son consentement, les tiers concernés et la possibilité que les renseignements soient communiqués à l'extérieur du Québec.",
    pratique: "Vérifiez que vos formulaires et votre première rencontre avec un client couvrent chaque point.",
  },
  {
    titre: "Le consentement",
    regle: "Depuis septembre 2023, le consentement doit être demandé pour chacune des fins, en termes simples et clairs. Une demande écrite doit être présentée distinctement de toute autre information. Sauf exception, un renseignement ne peut servir à une autre fin sans consentement.",
    pratique: "Accepter d'être joint au sujet d'une propriété n'est pas accepter une infolettre. Demandez chacun.",
  },
  {
    titre: "L'évaluation des facteurs relatifs à la vie privée",
    regle: "Une évaluation est exigée avant de communiquer un renseignement personnel à l'extérieur du Québec (depuis septembre 2023) et pour tout projet d'acquisition, de développement ou de refonte d'un système d'information impliquant des renseignements personnels. Elle est proportionnée à la sensibilité et à la quantité des renseignements.",
    pratique: "Le choix d'un nouveau CRM est le genre de projet que vise la règle. Demandez où le fournisseur héberge et traite les données.",
  },
  {
    titre: "Les incidents de confidentialité",
    regle: "L'entreprise doit aviser la Commission et les personnes concernées de tout incident présentant un risque de préjudice sérieux, et tenir un registre des incidents.",
    pratique: "Un portable perdu ou un courriel envoyé au mauvais client s'inscrit au registre, même si aucun avis n'est requis.",
  },
  {
    titre: "Le profilage et l'identification",
    regle: "L'entreprise qui recueille des renseignements au moyen d'une technologie permettant d'identifier, de localiser ou de profiler une personne doit l'en informer au préalable et indiquer comment activer ces fonctions. Elles ne peuvent pas être activées par défaut.",
    pratique: "Demandez à vos fournisseurs si un outil attribue un pointage aux contacts ou les suit, et ce que vous devez en dire aux clients.",
  },
  {
    titre: "Les décisions automatisées",
    regle: "La personne doit être informée lorsqu'une décision la concernant est fondée exclusivement sur un traitement automatisé, et pouvoir présenter ses observations à un membre du personnel en mesure de la réviser.",
    pratique: "Gardez une personne dans toute décision qui touche un client.",
  },
  {
    titre: "La portabilité",
    regle: "Depuis le 22 septembre 2024, sur demande, l'entreprise doit communiquer à la personne les renseignements personnels informatisés recueillis auprès d'elle, dans un format technologique structuré et couramment utilisé.",
    pratique: "Vérifiez que vous pouvez exporter la fiche d'un client depuis votre CRM.",
  },
];

const QUESTIONS_FOURNISSEUR = [
  "Dans quel pays et quelle région la base de données est-elle hébergée ?",
  "Quels fournisseurs externes reçoivent des données de clients, à quelle fin, et où les traitent-ils ?",
  "Puis-je exporter la fiche d'une personne dans un format structuré, et toutes mes données si je pars ?",
  "Puis-je supprimer un contact, et que deviennent les copies de sauvegarde ?",
  "Comment et dans quel délai serai-je avisé d'un incident de confidentialité ?",
  "Le produit attribue-t-il un pointage aux contacts, les suit-il ou les profile-t-il, et puis-je voir comment ?",
  "Quelque chose est-il envoyé à un contact sans qu'une personne l'approuve ?",
];

const FAQS = [
  {
    q: "Qu'est-ce que la Loi 25 ?",
    a: "La Loi 25 est le nom courant de la loi québécoise adoptée en 2021 qui a modernisé les lois sur la protection des renseignements personnels, dont la Loi sur la protection des renseignements personnels dans le secteur privé. Ses changements sont entrés en vigueur par étapes, en septembre 2022, en septembre 2023 et en septembre 2024.",
  },
  {
    q: "La Loi 25 s'applique-t-elle aux courtiers immobiliers ?",
    a: "La Loi sur le privé rend toute personne qui exploite une entreprise responsable des renseignements personnels qu'elle détient. Un courtier ou une agence qui conserve des noms, des coordonnées et des renseignements financiers de clients détient des renseignements personnels. Le partage des obligations entre le courtier et l'agence est une question à poser à votre agence ou à un avocat en protection de la vie privée.",
  },
  {
    q: "La Loi 25 est-elle la même chose que la LPRPDE ?",
    a: "Non. La LPRPDE est la loi fédérale sur la protection des renseignements personnels dans le secteur privé. La Loi 25 a modifié la loi québécoise, qui encadre généralement le traitement des renseignements personnels par une entreprise au Québec. Un courtier québécois qui travaille aussi hors de la province peut devoir tenir compte des deux.",
  },
  {
    q: "Puis-je conserver les données de mes clients dans un CRM hébergé hors Québec ?",
    a: "La loi ne l'interdit pas, mais une évaluation vient d'abord. Depuis septembre 2023, une évaluation des facteurs relatifs à la vie privée est exigée avant de communiquer un renseignement personnel à l'extérieur du Québec. La communication peut avoir lieu si l'évaluation démontre que le renseignement bénéficierait d'une protection adéquate, et elle doit faire l'objet d'une entente écrite.",
  },
  {
    q: "Quelles sont les sanctions prévues par la Loi 25 ?",
    a: "La Commission d'accès à l'information peut imposer des sanctions administratives pécuniaires aux entreprises qui contreviennent à la Loi sur le privé. Selon le résumé de la Commission, ces sanctions pourraient atteindre 2 % du chiffre d'affaires mondial ou 10 millions de dollars. Ce sont des plafonds, pas des montants typiques.",
  },
  {
    q: "Utiliser Realtor Desk me rend-il conforme à la Loi 25 ?",
    a: "Non. Un logiciel ne rend pas une entreprise conforme. Realtor Desk héberge sa base de données au Canada, consigne la date et la source du consentement de chaque contact et vous permet d'exporter vos données. L'évaluation, les politiques, le responsable et le registre des incidents restent les vôtres.",
  },
];

const Loi25CourtierImmobilier = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Loi 25 : guide pour le courtier immobilier"
        description="Ce que la Loi 25 exige d'un courtier immobilier au Québec, d'après le résumé de la Commission d'accès à l'information, et les questions à poser sur votre CRM."
        keywords="loi 25, loi 25 québec, loi 25 courtier immobilier, loi 25 immobilier, protection des renseignements personnels courtier, loi 25 CRM"
        canonicalUrl="https://www.realtordesk.ai/fr/loi-25-courtier-immobilier"
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
            <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted-foreground">
              <Link to="/fr/crm-immobilier" className="hover:underline">
                CRM immobilier
              </Link>
              <span aria-hidden="true"> / </span>
              <span>Loi 25</span>
            </nav>
            <h1 className="mb-6">La Loi 25 pour le courtier immobilier</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ce que la loi québécoise sur la protection des renseignements personnels exige
              d&rsquo;une entreprise qui détient des renseignements de clients, ce que cela
              donne dans une agence, et les questions à poser au sujet de votre CRM. Information
              générale, et non un avis juridique.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              <Link to="/law-25-quebec-real-estate" className="underline" hrefLang="en-CA" lang="en">
                Read this page in English
              </Link>
            </p>
          </div>
        </section>

        <section className="pb-16">
          <div className="container-custom max-w-3xl space-y-12">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-3">En bref</h2>
              <p className="text-base mb-0">
                La Loi 25 a modifié la Loi sur la protection des renseignements personnels dans
                le secteur privé en trois étapes, en septembre 2022, 2023 et 2024. Une entreprise
                qui détient des renseignements personnels doit désigner un responsable, publier
                ses pratiques, demander le consentement pour chaque fin, évaluer les facteurs
                relatifs à la vie privée avant de communiquer des renseignements hors Québec ou
                d&rsquo;adopter un nouveau système, tenir un registre des incidents et remettre à
                une personne ses données dans un format utilisable lorsqu&rsquo;elle le demande.
              </p>
            </Card>

            <div>
              <h2 className="mb-4">Ce que la loi exige</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                La colonne du centre résume l&rsquo;aperçu publié par la Commission
                d&rsquo;accès à l&rsquo;information du Québec, consulté le {CONSULTE}. La colonne
                de droite est notre suggestion pour une agence, et non une décision.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <caption className="sr-only">
                    Obligations de la Loi 25, ce qu&rsquo;en dit la Commission, et quoi faire dans
                    une agence.
                  </caption>
                  <thead>
                    <tr className="border-b-2 text-left">
                      <th scope="col" className="py-2 pr-4 font-semibold">Obligation</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Ce que dit la Commission</th>
                      <th scope="col" className="py-2 font-semibold">En pratique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OBLIGATIONS.map((o) => (
                      <tr key={o.titre} className="border-b align-top">
                        <th scope="row" className="py-3 pr-4 text-left font-semibold">{o.titre}</th>
                        <td className="py-3 pr-4 text-muted-foreground">{o.regle}</td>
                        <td className="py-3 text-muted-foreground">{o.pratique}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Source :{" "}
                <a className="underline" href={SOURCE} rel="noopener noreferrer" target="_blank">
                  Commission d&rsquo;accès à l&rsquo;information du Québec, principaux changements
                  apportés par la Loi 25
                </a>
                . La Commission précise que ses textes de vulgarisation n&rsquo;ont pas force de
                loi; les textes législatifs prévalent.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Les sanctions</h2>
              <p className="text-muted-foreground leading-relaxed">
                La Commission peut imposer des sanctions administratives pécuniaires aux
                entreprises qui contreviennent à la Loi sur le privé. Selon son résumé, ces
                sanctions pourraient atteindre 2&nbsp;% du chiffre d&rsquo;affaires mondial ou
                10 millions de dollars. Ce sont des plafonds. Une entreprise en défaut peut aussi
                prendre un engagement auprès de la Commission pour y remédier.
              </p>
            </div>

            <div>
              <h2 className="mb-4">Sept questions à poser à tout fournisseur de CRM</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Un CRM contient la plupart des renseignements personnels qu&rsquo;un courtier
                recueille. Il est donc au centre de l&rsquo;évaluation. Posez ces questions par
                écrit :
              </p>
              <ol className="space-y-2 text-muted-foreground leading-relaxed list-decimal pl-5">
                {QUESTIONS_FOURNISSEUR.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="mb-4">Les réponses de Realtor Desk</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  La base de données de production et le stockage de fichiers sont au Canada,
                  dans la région ca-central-1.
                </li>
                <li>
                  Certaines fonctions transmettent du contenu à des fournisseurs externes, comme
                  l&rsquo;envoi de textos, l&rsquo;envoi de courriels et l&rsquo;assistant de
                  rédaction, et ces fournisseurs peuvent le traiter à l&rsquo;extérieur du Canada.
                  Votre évaluation doit en tenir compte.
                </li>
                <li>
                  La date et la source du consentement sont consignées pour chaque contact, et un
                  message est refusé si aucun consentement n&rsquo;est enregistré.
                </li>
                <li>Vous pouvez exporter vos données à partir des paramètres et supprimer un contact.</li>
                <li>
                  Le pointage des clients potentiels repose sur des règles, et la fiche montre la
                  contribution de chaque élément. Un pointage fondé sur l&rsquo;engagement
                  d&rsquo;un contact peut relever de ce que la loi appelle le profilage; décidez
                  avec votre conseiller de ce que vous devez dire aux clients.
                </li>
                <li>Rien n&rsquo;est envoyé à un contact sans vous.</li>
                <li>L&rsquo;interface et les courriels aux clients fonctionnent en français, selon le contact.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Ce qu&rsquo;il ne fait pas : réaliser votre évaluation, rédiger votre politique
                de confidentialité, désigner votre responsable ou tenir votre registre des
                incidents. Nous ne détenons aucune certification de sécurité et n&rsquo;en
                revendiquons aucune.
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

            <div>
              <h2 className="mb-4">À lire aussi</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                <li>
                  <Link to="/fr/lcap-courriels-immobilier" className="underline">
                    La LCAP et les courriels d&rsquo;un courtier immobilier
                  </Link>
                  , la loi fédérale anti-pourriel, qui s&rsquo;applique aussi au Québec.
                </li>
                <li>
                  <Link to="/fr/importer-contacts-csv" className="underline">
                    Importer des contacts par CSV
                  </Link>
                  , et pourquoi le consentement n&rsquo;est pas importé.
                </li>
                <li>
                  <Link to="/fr/crm-immobilier" className="underline">
                    Un CRM immobilier en français
                  </Link>
                  .
                </li>
              </ul>
            </div>

            <Card className="p-8 text-center">
              <h2 className="mb-3">Un CRM hébergé au Canada, en français et en anglais</h2>
              <p className="text-muted-foreground mb-6">
                Essai de 14 jours; une carte est demandée au départ et rien n&rsquo;est facturé
                avant le 14e jour. Ensuite, 149 $ CA par mois pour un courtier seul.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Commencer l&rsquo;essai</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/demo">Réserver une démo</Link>
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

export default Loi25CourtierImmobilier;
