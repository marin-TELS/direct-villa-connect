import { createFileRoute } from "@tanstack/react-router";

import { useEnvironnement } from "../hooks/use-environnement";
import { Navigation } from "../components/Navigation";
import { SectionReponse } from "../components/SectionReponse";
import { SectionMethode } from "../components/SectionMethode";
import { SectionTarifs } from "../components/SectionTarifs";
import { BandeAudit } from "../components/BandeAudit";
import { SectionFaq } from "../components/SectionFaq";
import { Cloture } from "../components/Cloture";
import { PiedDePage } from "../components/PiedDePage";

const DESCRIPTION =
  "Le studio qui construit le canal de réservation directe des villas de location premium. Site sur mesure, espace de gestion, visibilité dans les réponses des IA.";

export const Route = createFileRoute("/reponse")({
  head: () => ({
    meta: [
      { title: "Notre réponse" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Notre réponse" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/reponse" }],
  }),
  component: PageReponse,
});

function PageReponse() {
  useEnvironnement();

  return (
    <>
      <Navigation />
      <main className="entree-panneau">
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
