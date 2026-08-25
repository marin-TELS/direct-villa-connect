import { useMemo, useRef, useState, type CSSProperties } from "react";

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
  formatPart: (v: number) => string;
}

const COULEURS: Record<string, string> = {
  revenus: "var(--signal)",
  commission: "var(--alerte)", // seul emploi du rouge dans tout le site
  charges: "var(--craie-3)",
  reste: "var(--signal)",
};

const couleurPoste = "var(--craie-3)";

/** Les propriétés géométriques SVG passées en style pour être animables. */
function styleNoeud(noeud: NoeudSankey): CSSProperties {
  return {
    x: noeud.x,
    y: noeud.y,
    width: noeud.largeur,
    height: noeud.hauteur,
  } as CSSProperties;
}

export function DiagrammeSankey({
  revenus,
  commission,
  totalCharges,
  reste,
  postes,
  estVisible,
  formatMontant,
  formatPart,
}: DiagrammeSankeyProps) {
  const [survol, setSurvol] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const refConteneur = useRef<HTMLDivElement>(null);

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
      {
        noeud: disposition.noeudRevenus,
        couleur: COULEURS.revenus,
        interactive: true,
      },
      {
        noeud: disposition.noeudCommission,
        couleur: COULEURS.commission,
        interactive: true,
      },
      {
        noeud: disposition.noeudCharges,
        couleur: COULEURS.charges,
        interactive: true,
      },
      {
        noeud: disposition.noeudReste,
        couleur: COULEURS.reste,
        interactive: true,
      },
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
      nom: "Résultat d’exploitation",
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

  const parCle = new Map(libelles.map((l) => [l.cle, l]));
  const survole = survol ? parCle.get(survol) : undefined;

  const suivrePointeur = (evenement: {
    clientX: number;
    clientY: number;
  }) => {
    const cadre = refConteneur.current?.getBoundingClientRect();
    if (!cadre) return;
    setPosition({
      x: evenement.clientX - cadre.left,
      y: evenement.clientY - cadre.top,
    });
  };

  const entrer = (cle: string) => setSurvol(cle);
  const sortir = () => setSurvol(null);

  return (
    <div
      ref={refConteneur}
      className={`sankey-conteneur${estVisible ? " est-visible" : ""}${
        survol ? " a-survol" : ""
      }`}
      onMouseMove={suivrePointeur}
      onMouseLeave={sortir}
      role="img"
      aria-label={`Diagramme des flux : ${formatMontant(revenus)} de revenus, dont ${formatMontant(commission)} de commission, ${formatMontant(totalCharges)} de charges et ${formatMontant(reste)} de résultat d’exploitation.`}
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
              className={`flux-sankey${survol === f.cle ? " est-survole" : ""}`}
              style={{ d: `path("${f.d}")` } as CSSProperties}
              onMouseEnter={() => entrer(f.cle)}
            />
          ))}
        </g>
        {noeuds.map(({ noeud, couleur, interactive }) => (
          <rect
            key={noeud.cle}
            className={`noeud-sankey${survol === noeud.cle ? " est-survole" : ""}`}
            x={noeud.x}
            y={noeud.y}
            width={noeud.largeur}
            height={noeud.hauteur}
            style={styleNoeud(noeud)}
            fill={couleur}
            onMouseEnter={interactive ? () => entrer(noeud.cle) : undefined}
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

      {survole ? (
        <div
          className="infobulle-sankey"
          style={{ left: position.x, top: position.y }}
          aria-hidden="true"
        >
          <span className="infobulle-nom">{survole.nom}</span>
          <span className="infobulle-montant">
            {formatMontant(survole.montant)}
          </span>
          <span className="infobulle-part">
            {revenus > 0
              ? `${formatPart((survole.montant / revenus) * 100)} % des revenus`
              : "Part indéterminée"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
