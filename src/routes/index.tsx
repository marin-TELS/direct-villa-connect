import { createFileRoute } from "@tanstack/react-router";

import { Navigation } from "../components/Navigation";
import { BandeauOuverture } from "../components/BandeauOuverture";
import { SectionPourquoi } from "../components/SectionPourquoi";
import { SectionDiagramme } from "../components/SectionDiagramme";
import { SectionReponse } from "../components/SectionReponse";
import { SectionMethode } from "../components/SectionMethode";
import { SectionTarifs } from "../components/SectionTarifs";
import { BandeAudit } from "../components/BandeAudit";
import { SectionFaq } from "../components/SectionFaq";
import { Cloture } from "../components/Cloture";
import { PiedDePage } from "../components/PiedDePage";

const DESCRIPTION =
  "Le studio qui construit le canal de réservation directe des villas de location premium. Site sur mesure, espace de gestion, visibilité dans les réponses des IA.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Demeure — studio" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Demeure — studio" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: PageAccueil,
});

function PageAccueil() {
  return (
    <>
      <Navigation />
      <main>
        <BandeauOuverture />
        <SectionPourquoi />
        <SectionDiagramme />
        <SectionReponse />
        <SectionMethode />
        <SectionTarifs />
        <BandeAudit />
        <SectionFaq />
        <Cloture />
      </main>
      <PiedDePage />
    </>
  );
}
