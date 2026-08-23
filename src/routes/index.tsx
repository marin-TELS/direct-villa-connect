import { createFileRoute } from "@tanstack/react-router";

import { Navigation } from "../components/Navigation";
import { BandeauOuverture } from "../components/BandeauOuverture";
import { SectionPourquoi } from "../components/SectionPourquoi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Demeure — studio" },
      {
        name: "description",
        content:
          "Le studio qui construit le canal de réservation directe des villas de location premium. Site sur mesure, espace de gestion, visibilité sur les assistants conversationnels.",
      },
      { property: "og:title", content: "Demeure — studio" },
      {
        property: "og:description",
        content:
          "Le studio qui construit le canal de réservation directe des villas de location premium. Site sur mesure, espace de gestion, visibilité sur les assistants conversationnels.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary" },
    ],
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

        {/* Sections réservées aux passes suivantes — volontairement vides */}
        <section id="diagramme" className="section-ancree" />
        <section id="reponse" className="section-ancree" />
        <section id="methode" className="section-ancree" />
        <section id="tarifs" className="section-ancree" />
        <section id="contact" className="section-ancree" />
      </main>
    </>
  );
}
