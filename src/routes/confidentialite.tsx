import { createFileRoute } from "@tanstack/react-router";

import { Navigation } from "../components/Navigation";
import { PiedDePage } from "../components/PiedDePage";
import { useEnvironnement } from "../hooks/use-environnement";

const DESCRIPTION =
  "Ce que Demeure fait des informations envoyées par les formulaires du site : répondre à votre demande, rien d’autre.";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Confidentialité — Demeure studio" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Confidentialité — Demeure studio" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/confidentialite" }],
  }),
  component: PageConfidentialite,
});

function PageConfidentialite() {
  useEnvironnement();

  return (
    <>
      <Navigation />
      <main>
        <section data-env="jour" className="page-legale">
          <div className="conteneur">
            <div className="grille-12">
              <h1 className="t-section pos-titre-section">Confidentialité</h1>
              <p className="t-corps pos-bloc-a mt-10">
                Les informations envoyées par les formulaires de ce site
                (prénom, téléphone, email, disponibilités, question) servent
                uniquement à répondre à votre demande et à vous recontacter à ce
                sujet. Elles ne sont ni partagées, ni revendues, ni utilisées
                pour une lettre d’information. Vous pouvez en demander la
                consultation ou la suppression à tout moment en écrivant à
                l’adresse de contact indiquée au pied de page.
              </p>
            </div>
          </div>
        </section>
      </main>
      <PiedDePage />
    </>
  );
}
