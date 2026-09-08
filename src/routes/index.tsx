import { createFileRoute } from "@tanstack/react-router";

import { useEnvironnement } from "../hooks/use-environnement";
import { Navigation } from "../components/Navigation";
import { BandeauOuverture } from "../components/BandeauOuverture";
import { SectionPourquoi } from "../components/SectionPourquoi";
import { SectionDiagramme } from "../components/SectionDiagramme";
import { SectionSeuil } from "../components/SectionSeuil";
import { SectionChiffres } from "../components/SectionChiffres";

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
  useEnvironnement();

  return (
    <>
      <Navigation />
      <main>
        <BandeauOuverture />
        <SectionPourquoi />
        <SectionDiagramme />
        <SectionChiffres />
        <SectionSeuil />
      </main>
    </>
  );
}
