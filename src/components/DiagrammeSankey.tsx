import { useMemo, useState } from "react";

import {
  calculerDisposition,
  type NoeudSankey,
} from "../lib/sankey-disposition";

interface PosteSankey {
  cle: string;
  libelle: string;
  montant: number;
}

interface DiagrammeSankeyProps {
  revenus: number;
  commission: number;
  totalCharges: number;
  reste: number;
  postes: PosteSankey[];
  estVisible: boolean; // déclenche l'animation d'entrée, une seule fois
  formatMontant: (v: number) => string;
}

const COULEURS: Record<string, string> = {
  revenus: "var(--signal)",
  commission: "var(--alerte)", // seul emploi du rouge dans tout le site
  charges: "var(--craie-3)",
  reste: "var(--signal)",
};

const couleurPoste = "var(--craie-3)";

export function DiagrammeSankey({
  revenus,
  commission,
  totalCharges,
  reste,
  postes,
  estVisible,
  formatMontant,
}: DiagrammeSankeyProps) {
  const [survol, setSurvol] = useState<string | null>(null);

  const disposition = useMemo(
    () =>
      calculerDisposition({
        revenus,
        commission,
        totalCharges,
        reste,
        postes: postes.map((p) => p.montant),
      }),
    [revenus, commission, totalCharges, reste, postes],
  );

  const noeuds: { noeud: NoeudSankey; couleur: string; interactive: boolean }[] =
    [
      { noeud: disposition.noeudRevenus, couleur: COULEURS.revenus, interactive: false },
      { noeud: disposition.noeudCommission, couleur: COULEURS.commission, interactive: true },
      { noeud: disposition.noeudCharges, couleur: COULEURS.charges, interactive: true },
      { noeud: disposition.noeudReste, couleur: COULEURS.reste, interactive: true },
      ...disposition.noeudsPostes.map((n) => ({
        noeud: n,
        couleur: couleurPoste,
        interactive: true,
      })),
    ];

  const flux = [
    ...disposition.fluxPrincipaux.map((f) => ({
      ...f,
      couleur: COULEURS[f.cle],
    })),
    ...disposition.fluxPostes.map((f) => ({ ...f, couleur: couleurPoste })),
  ];

  const libelles: {
    cle: string;
    nom: string;
    montant: number;
    cote: "gauche" | "milieu" | "droite";
    fort: boolean;
    noeud: NoeudSankey;
  }[] = [
    {
      cle: "revenus",
      nom: "Revenus locatifs",
      montant: revenus,
      cote: "gauche",
      fort: false,
      noeud: disposition.noeudRevenus,
    },
    {
      cle: "commission",
      nom: "Commission",
      montant: commission,
      cote: "milieu",
      fort: true,
      noeud: disposition.noeudCommission,
    },
    {
      cle: "charges",
      nom: "Charges d’exploitation",
      montant: totalCharges,
      cote: "milieu",
      fort: false,
      noeud: disposition.noeudCharges,
    },
    {
      cle: "reste",
      nom: "Ce qu’il vous reste",
      montant: reste,
      cote: "milieu",
      fort: true,
      noeud: disposition.noeudReste,
    },
    ...postes.map((p, index) => ({
      cle: `poste-${index}`,
      nom: p.libelle,
      montant: p.montant,
      cote: "droite" as const,
      fort: false,
      noeud: disposition.noeudsPostes[index],
    })),
  ];

  return (
    <div
      className={`sankey-conteneur${estVisible ? " est-visible" : ""}`}
      role="img"
      aria-label={`Diagramme des flux : ${formatMontant(revenus)} de revenus, dont ${formatMontant(commission)} de commission, ${formatMontant(totalCharges)} de charges et ${formatMontant(reste)} de résultat.`}
    >
      <svg
        viewBox="0 0 1000 520"
        preserveAspectRatio="xMidYMid meet"
        className="sankey-svg"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="masque-flux-sankey">
            <rect className="rect-masque" x="0" y="0" height="520" />
          </clipPath>
        </defs>
        <g clipPath="url(#masque-flux-sankey)">
          {flux.map((f) => (
            <path
              key={f.cle}
              d={f.d}
              fill={f.couleur}
              className="flux-sankey"
              style={{ fillOpacity: survol === f.cle ? 0.45 : 0.22 }}
              onMouseEnter={() => setSurvol(f.cle)}
              onMouseLeave={() => setSurvol(null)}
            />
          ))}
        </g>
        {noeuds.map(({ noeud, couleur, interactive }) => (
          <rect
            key={noeud.cle}
            className="noeud-sankey"
            x={noeud.x}
            y={noeud.y}
            width={noeud.largeur}
            height={noeud.hauteur}
            fill={couleur}
            onMouseEnter={
              interactive ? () => setSurvol(noeud.cle) : undefined
            }
            onMouseLeave={interactive ? () => setSurvol(null) : undefined}
          />
        ))}
      </svg>

      {libelles.map((l) => (
        <div
          key={l.cle}
          className={`libelle-sankey libelle-${l.cote}${l.fort ? " est-fort" : ""}${survol === l.cle ? " est-survole" : ""}`}
          style={{
            top: `${((l.noeud.y + l.noeud.hauteur / 2) / 520) * 100}%`,
          }}
        >
          <span className="libelle-nom">{l.nom}</span>
          <span className="libelle-montant">{formatMontant(l.montant)}</span>
        </div>
      ))}
    </div>
  );
}
