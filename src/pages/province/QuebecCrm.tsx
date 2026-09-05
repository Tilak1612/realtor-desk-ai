import { Clock, Shield, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ProvinceLanding, type ProvinceData } from "./ProvinceLanding";

const data: ProvinceData = {
  slug: "real-estate-crm-quebec",
  province: "Quebec",
  demonym: "Quebec",
  title: "CRM immobilier pour courtiers du Québec | Realtor Desk",
  description:
    "CRM IA pour courtiers immobiliers du Québec — conforme à la Loi 25, bilingue FR/EN, OACIQ, prix en CAD. Essai gratuit de 14 jours.",
  keywords:
    "CRM immobilier Québec, real estate CRM Quebec, CRM for Quebec REALTORS, OACIQ CRM, Loi 25 CRM immobilier, bilingual real estate CRM Quebec, courtier immobilier logiciel",
  heroLede:
    "De Montréal à Québec à Gatineau — Realtor Desk aide les courtiers du Québec à répondre aux clients d'abord, en français comme en anglais, tout en respectant la Loi 25 et les normes de l'OACIQ.",
  reasons: [
    {
      icon: Globe,
      title: "Français d'abord, vraiment bilingue",
      body: "Le Québec est un marché francophone. Realtor Desk fonctionne entièrement en français et en anglais — interface, suivis IA et communications clients — sans traduction bricolée. (French-first, genuinely bilingual — not a bolt-on.)",
    },
    {
      icon: Shield,
      title: "Conçu pour la Loi 25 & l'OACIQ",
      body: "Le suivi du consentement et l'exportation des données appuient vos obligations sous la Loi 25 (la loi québécoise sur la protection des renseignements personnels, plus stricte que la LPRPDE) et les normes de l'OACIQ.",
    },
    {
      icon: Clock,
      title: "Répondez en premier à Montréal",
      body: "Sur les marchés urbains concurrentiels, le premier courtier à répondre gagne le client. Le suivi IA 24/7 répond en quelques secondes — même en visite ou en soirée.",
    },
    {
      icon: Zap,
      title: "Qualification des prospects par IA",
      body: "Chaque prospect est évalué et qualifié avant votre premier appel, pour concentrer votre temps sur les clients les plus prêts à transiger.",
    },
  ],
  complianceHeading: "Conformité au Québec, sans devinettes",
  complianceBody: (
    <>
      <p>
        Le courtage immobilier au Québec est encadré par l'{" "}
        <strong>Organisme d'autoréglementation du courtage immobilier du Québec (OACIQ)</strong>. En
        matière de vie privée, les courtiers du Québec sont assujettis à la{" "}
        <strong>Loi 25</strong> (la loi modernisée sur la protection des renseignements personnels,
        déployée de 2022 à 2024 et plus stricte que la LPRPDE fédérale), ainsi qu'aux règles
        anti-pourriel de la LCAP (CASL).
      </p>
      <p>
        Realtor Desk fournit l'infrastructure de tenue de dossiers pour appuyer ces obligations —
        consentement horodaté, exportation des données en un clic, et historique complet par
        contact — sans remplacer le programme de conformité de votre agence. Voir notre{" "}
        <Link to="/pipeda-compliance-real-estate-ai-tools-canada">guide de conformité en vie privée</Link>.
      </p>
    </>
  ),
  faqs: [
    {
      q: "Realtor Desk est-il conforme à la Loi 25 et aux normes de l'OACIQ ?",
      a: "Realtor Desk est conçu autour des lois qui s'appliquent aux courtiers du Québec — la Loi 25, la LPRPDE et la LCAP — avec suivi du consentement et exportation des données, et il appuie la tenue de dossiers attendue sous l'OACIQ. Il ne remplace pas le programme de conformité de votre agence. Ceci est une information générale, pas un avis juridique.",
    },
    {
      q: "L'outil fonctionne-t-il entièrement en français ?",
      a: "Oui. L'interface, les suivis automatisés et l'assistant IA fonctionnent en français comme en anglais, ce qui est essentiel pour servir la clientèle québécoise dans sa langue.",
    },
    {
      q: "Quel est le prix en dollars canadiens ?",
      a: "Le prix est en CAD à partir de 149 $/mois, sans exposition au taux de change, avec un essai gratuit de 14 jours sans carte de crédit pour commencer.",
    },
  ],
};

const QuebecCrm = () => <ProvinceLanding data={data} />;
export default QuebecCrm;
