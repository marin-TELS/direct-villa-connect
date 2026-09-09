import { createFileRoute } from "@tanstack/react-router";

import { useEnvironnement } from "../hooks/use-environnement";
import { Navigation } from "../components/Navigation";
import { BandeAudit } from "../components/BandeAudit";
import { PiedDePage } from "../components/PiedDePage";

const DESCRIPTION =
  "Le studio qui construit le canal de réservation directe des villas de location premium. Site sur mesure, espace de gestion, visibilité dans les réponses des IA.";

const TITRE = "L’audit de visibilité IA";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITRE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/audit" }],
  }),
  component: PageAudit,
});

function PageAudit() {
  useEnvironnement();

  return (
    <>
      <Navigation />
      <main className="entree-panneau page-audit" data-env="signal">
        <BandeAudit />
      </main>
      <PiedDePage environnement="signal" />
    </>
  );
}
