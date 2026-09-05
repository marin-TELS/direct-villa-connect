import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * Module verrouillé : la structure reste visible, le contenu est du faux
 * texte de forme (barres et formes, jamais de phrase réelle), rendu
 * illisible par un flou. Le cartouche s'agrandit au survol.
 */
export function ModuleVerrouille({
  titre,
  children,
  className,
}: {
  titre?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`demo-verrou${className ? ` ${className}` : ""}`}>
      {titre ? <p className="demo-carte-titre">{titre}</p> : null}
      <div className="demo-verrou-corps" aria-hidden="true">
        {children}
      </div>
      <div className="demo-verrou-voile">
        <div className="demo-cartouche">
          <p className="demo-cartouche-titre">Actif chez nos clients</p>
          <div className="demo-cartouche-plus">
            <p className="demo-cartouche-texte">
              Cette partie fonctionne dans l’espace de chaque propriétaire.
              Parlons de la vôtre.
            </p>
            <Link to="/reponse" hash="contact" className="demo-bouton-contour">
              En parler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Faux texte de forme : lignes pleines, aucun mot. */
export function FormesLignes({ lignes = 4 }: { lignes?: number }) {
  const largeurs = [92, 74, 84, 61, 88, 70, 79, 55];
  return (
    <div className="demo-formes">
      {Array.from({ length: lignes }, (_, i) => (
        <span
          key={i}
          className="demo-forme-ligne"
          style={{ width: `${largeurs[i % largeurs.length]}%` }}
        />
      ))}
    </div>
  );
}

/** Faux graphique de forme : colonnes muettes. */
export function FormesGraphe({ colonnes = 12 }: { colonnes?: number }) {
  const hauteurs = [42, 58, 35, 70, 64, 48, 82, 55, 39, 76, 61, 50];
  return (
    <div className="demo-graphe">
      {Array.from({ length: colonnes }, (_, i) => (
        <span
          key={i}
          className="demo-graphe-colonne"
          style={{ height: `${hauteurs[i % hauteurs.length]}%` }}
        />
      ))}
    </div>
  );
}

/** Faux tableau de forme : lignes et cellules muettes. */
export function FormesTableau({ lignes = 4 }: { lignes?: number }) {
  return (
    <div className="demo-formes-tableau">
      {Array.from({ length: lignes }, (_, i) => (
        <div key={i} className="demo-formes-tableau-ligne">
          <span className="demo-forme-ligne" style={{ width: "38%" }} />
          <span className="demo-forme-ligne" style={{ width: "18%" }} />
          <span className="demo-forme-ligne" style={{ width: "22%" }} />
        </div>
      ))}
    </div>
  );
}
