import { useMemo, useRef, useState, type CSSProperties } from "react";

import {
  calculerDisposition,
  type EntreesFiscales,
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
  fiscal?: EntreesFiscales | undefined;
  estVisible: boolean; // déclenche l'animation d'entrée, une seule fois
  formatMontant: (v: number) => string;
  formatPart: (v: number) => string;
}

const COULEUR_REVENUS = "var(--signal)";
const COULEUR_COMMISSION = "var(--alerte)"; // seul emploi du rouge dans tout le site
const COULEUR_CHARGES = "var(--craie-3)";
const COULEUR_RESTE = "var(--signal)";
const COULEUR_DISPONIBLE = "var(--signal)";

const COULEURS: Record<string, string> = {
  revenus: COULEUR_REVENUS,
  commission: COULEUR_COMMISSION,
  charges: COULEUR_CHARGES,
  reste: COULEUR_RESTE,
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
  fiscal,
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
        fiscal,
      }),
    [revenus, commission, totalCharges, reste, postes, fiscal],
  );

  const largeur = disposition.largeurVue;

  const noeuds: { noeud: NoeudSankey; couleur: string }[] = [
    { noeud: disposition.noeudRevenus, couleur: COULEUR_REVENUS },
    { noeud: disposition.noeudCommission, couleur: COULEUR_COMMISSION },
    { noeud: disposition.noeudCharges, couleur: COULEUR_CHARGES },
    { noeud: disposition.noeudReste, couleur: COULEUR_RESTE },
    ...disposition.noeudsPostes.map((n) => ({ noeud: n, couleur: couleurPoste })),
    ...disposition.noeudsFiscaux.map((n) => ({
      noeud: n,
      couleur: n.cle === "disponible" ? COULEUR_DISPONIBLE : couleurPoste,
    })),
  ];

  const flux = [
    ...disposition.fluxPrincipaux.map((f) => ({
      ...f,
      couleur: COULEURS[f.cle] ?? couleurPoste,
    })),
    ...disposition.fluxPostes.map((f) => ({ ...f, couleur: couleurPoste })),
    ...disposition.fluxFiscaux.map((f) => ({ ...f, couleur: couleurPoste })),
  ];

  type Libelle = {
    cle: string;
    nom: string;
    montant: number;
    cote: "gauche" | "milieu" | "droite";
    fort: boolean;
    noeud: NoeudSankey;
  };

  const libellesFiscaux: Libelle[] = fiscal
    ? [
        { cle: "cotisations", nom: "Cotisations sociales", fort: false },
        { cle: "impot", nom: "Impôt sur le revenu", fort: false },
        { cle: "disponible", nom: "Revenu disponible", fort: true },
      ].flatMap((entree, index) => {
        const noeud = disposition.noeudsFiscaux[index];
        if (!noeud) return [];
        const montant =
          entree.cle === "cotisations"
            ? fiscal.cotisations
            : entree.cle === "impot"
              ? fiscal.impot
              : fiscal.disponible;
        return [
          {
            cle: entree.cle,
            nom: entree.nom,
            montant,
            cote: "droite" as const,
            fort: entree.fort,
            noeud,
          },
        ];
      })
    : [];

  const libelles: Libelle[] = [
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
    ...libellesFiscaux,
  ];

  // Les postes de charges ne sont pas légendés dans le diagramme :
  // le détail est affiché dans la colonne voisine.
  const parCle = new Map<string, { nom: string; montant: number }>([
    ...libelles.map(
      (l) => [l.cle, { nom: l.nom, montant: l.montant }] as const,
    ),
    ...postes.map(
      (p, index) =>
        [`poste-${index}`, { nom: p.libelle, montant: p.montant }] as const,
    ),
  ]);
  const survole = survol ? parCle.get(survol) : undefined;

  const suivrePointeur = (evenement: { clientX: number; clientY: number }) => {
    const cadre = refConteneur.current?.getBoundingClientRect();
    if (!cadre) return;
    setPosition({
      x: evenement.clientX - cadre.left,
      y: evenement.clientY - cadre.top,
    });
  };

  const entrer = (cle: string) => setSurvol(cle);
  const sortir = () => setSurvol(null);

  const positionLibelle = (l: Libelle): CSSProperties => {
    const haut = `${((l.noeud.y + l.noeud.hauteur / 2) / 520) * 100}%`;
    if (l.cote === "gauche") return { top: haut, left: 0 };
    if (l.cote === "milieu")
      return {
        top: haut,
        left: `${((l.noeud.x + l.noeud.largeur + 14) / largeur) * 100}%`,
      };
    return { top: haut, right: 0 };
  };

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
        viewBox={`0 0 ${largeur} 520`}
        preserveAspectRatio="xMidYMid meet"
        className="sankey-svg"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="masque-flux-sankey">
            <rect
              className="rect-masque"
              x="0"
              y="0"
              height="520"
              style={{ "--largeur-vue": `${largeur}px` } as CSSProperties}
            />
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
        {noeuds.map(({ noeud, couleur }) => (
          <rect
            key={noeud.cle}
            className={`noeud-sankey${survol === noeud.cle ? " est-survole" : ""}`}
            x={noeud.x}
            y={noeud.y}
            width={noeud.largeur}
            height={noeud.hauteur}
            style={styleNoeud(noeud)}
            fill={couleur}
            onMouseEnter={() => entrer(noeud.cle)}
          />
        ))}
      </svg>

      {libelles.map((l) => (
        <div
          key={l.cle}
          className={`libelle-sankey libelle-${l.cote}${l.fort ? " est-fort" : ""}${survol === l.cle ? " est-survole" : ""}`}
          style={positionLibelle(l)}
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
