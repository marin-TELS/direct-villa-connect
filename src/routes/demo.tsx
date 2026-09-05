import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { OngletDemandes } from "../components/demo/OngletDemandes";
import { OngletCalendrier } from "../components/demo/OngletCalendrier";
import { OngletAvis } from "../components/demo/OngletAvis";
import { OngletFinance } from "../components/demo/OngletFinance";
import { OngletVisibilite } from "../components/demo/OngletVisibilite";
import {
  FormesLignes,
  FormesTableau,
  ModuleVerrouille,
} from "../components/demo/ModuleVerrouille";

const DESCRIPTION =
  "Espace de gestion de démonstration : demandes, calendrier, avis, finance et visibilité, avec des données entièrement fictives.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Espace de démonstration — Mas des Oliviers" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Espace de démonstration" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/demo" }],
  }),
  component: PageDemo,
});

type CleOnglet =
  | "demandes"
  | "calendrier"
  | "avis"
  | "finance"
  | "visibilite";

const ONGLETS: { cle: CleOnglet; libelle: string }[] = [
  { cle: "demandes", libelle: "Demandes" },
  { cle: "calendrier", libelle: "Calendrier" },
  { cle: "avis", libelle: "Avis" },
  { cle: "finance", libelle: "Finance" },
  { cle: "visibilite", libelle: "Visibilité" },
];

/*
 * Écran de démonstration : tout est fictif et tout tient en mémoire dans le
 * navigateur. Aucune requête réseau, aucun stockage, aucune donnée bancaire.
 */
function PageDemo() {
  const [onglet, setOnglet] = useState<CleOnglet>("demandes");
  const [reglages, setReglages] = useState(false);
  const [demande, setDemande] = useState<string | null>("lasserre");

  const ouvrirDemande = (cle: string) => {
    setDemande(cle);
    setOnglet("demandes");
    setReglages(false);
  };

  return (
    <div className="demo-racine">
      <header className="demo-entete">
        <div className="demo-entete-gauche">
          <p className="demo-maison">Mas des Oliviers</p>
          <p className="demo-mention">Espace propriétaire</p>
        </div>
        <div className="demo-entete-droite">
          <p className="demo-bandeau">Démonstration · données fictives</p>
          <Link to="/reponse" className="demo-lien-retour">
            Revenir au site
          </Link>
        </div>
      </header>

      <nav className="demo-onglets" aria-label="Sections de l’espace">
        <div className="demo-onglets-piste">
          {ONGLETS.map((o) => (
            <button
              key={o.cle}
              type="button"
              aria-current={!reglages && onglet === o.cle ? "page" : undefined}
              className={`demo-onglet${!reglages && onglet === o.cle ? " est-actif" : ""}`}
              onClick={() => {
                setReglages(false);
                setOnglet(o.cle);
              }}
            >
              {o.libelle}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`demo-onglet demo-onglet-reglages${reglages ? " est-actif" : ""}`}
          aria-label="Réglages"
          aria-pressed={reglages}
          onClick={() => setReglages(true)}
        >
          Réglages
        </button>
      </nav>

      <main className="demo-corps">
        {reglages ? (
          <ModuleVerrouille titre="Réglages" className="demo-verrou-plein">
            <FormesTableau lignes={6} />
            <FormesLignes lignes={4} />
          </ModuleVerrouille>
        ) : onglet === "demandes" ? (
          <OngletDemandes selection={demande} onSelection={setDemande} />
        ) : onglet === "calendrier" ? (
          <OngletCalendrier onSejour={ouvrirDemande} />
        ) : onglet === "avis" ? (
          <OngletAvis />
        ) : onglet === "finance" ? (
          <OngletFinance />
        ) : (
          <OngletVisibilite />
        )}
      </main>

      <footer className="demo-pied">
        <p className="demo-pied-texte">
          Vous venez de parcourir l’espace tel qu’un propriétaire le voit. Le
          vôtre serait construit sur votre maison, vos tarifs et vos
          prestataires.
        </p>
        <Link to="/reponse" hash="contact" className="demo-bouton-principal">
          Parlons de votre maison
        </Link>
      </footer>
    </div>
  );
}
