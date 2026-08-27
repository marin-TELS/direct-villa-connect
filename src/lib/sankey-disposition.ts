/*
 * Disposition du diagramme de Sankey — calculée à la main, sans bibliothèque.
 * viewBox 1000 × 520, hauteur utile 500px, trois colonnes de nœuds.
 */

export interface NoeudSankey {
  cle: string;
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
}

export interface FluxSankey {
  cle: string; // clé du nœud cible
  d: string;
}

export interface EntreesFiscales {
  cotisations: number;
  impot: number;
  disponible: number;
}

export interface DispositionSankey {
  largeurVue: number;
  noeudRevenus: NoeudSankey;
  noeudCommission: NoeudSankey;
  noeudCharges: NoeudSankey;
  noeudReste: NoeudSankey;
  noeudsPostes: NoeudSankey[];
  fluxPrincipaux: FluxSankey[]; // revenus → commission / charges / reste
  fluxPostes: FluxSankey[]; // charges → six postes
  noeudsFiscaux: NoeudSankey[]; // cotisations, impôt, revenu disponible
  fluxFiscaux: FluxSankey[]; // résultat d'exploitation → étage fiscal
}

const LARGEUR_NOEUD = 14;
const X_GAUCHE = 0;
/* Sans étage fiscal : trois colonnes sur 1000 unités.
   Avec étage fiscal : quatre colonnes sur 1400 unités. */
const LARGEUR_COURTE = 1000;
const LARGEUR_LONGUE = 1400;
const X_MILIEU_COURT = 493;
const X_DROITE_COURT = 986;
const X_MILIEU_LONG = 470;
const X_DROITE_LONG = 900;
const X_FISCAL = 1386;
const MARGE_VERTICALE = 10;
const HAUTEUR_UTILE = 500;
const ESPACE_MILIEU = 10;
const ESPACE_DROITE = 6;
const HAUTEUR_MIN = 3;

/** Bande horizontale en courbes de Bézier cubiques, épaisseur constante. */
function cheminFlux(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  epaisseur: number,
): string {
  const xm = (x0 + x1) / 2;
  return [
    `M ${x0} ${y0}`,
    `C ${xm} ${y0} ${xm} ${y1} ${x1} ${y1}`,
    `L ${x1} ${y1 + epaisseur}`,
    `C ${xm} ${y1 + epaisseur} ${xm} ${y0 + epaisseur} ${x0} ${y0 + epaisseur}`,
    "Z",
  ].join(" ");
}

function positif(valeur: number): number {
  return Number.isFinite(valeur) ? Math.max(0, valeur) : 0;
}

export function calculerDisposition(entrees: {
  revenus: number;
  commission: number;
  totalCharges: number;
  reste: number;
  postes: number[];
  fiscal?: EntreesFiscales | undefined;
}): DispositionSankey {
  const fiscal = entrees.fiscal;
  const largeurVue = fiscal ? LARGEUR_LONGUE : LARGEUR_COURTE;
  const X_MILIEU = fiscal ? X_MILIEU_LONG : X_MILIEU_COURT;
  const X_DROITE = fiscal ? X_DROITE_LONG : X_DROITE_COURT;
  const revenus = positif(entrees.revenus);
  const commission = positif(entrees.commission);
  const totalCharges = positif(entrees.totalCharges);
  const reste = positif(entrees.reste);
  const postes = entrees.postes.map(positif);

  const sommeMilieu = commission + totalCharges + reste;
  const sommePostes = postes.reduce((s, v) => s + v, 0);

  // Une seule échelle pour tout le diagramme : la plus contraignante
  // des trois colonnes, pour que les flux conservent leur épaisseur.
  const candidats = [
    revenus > 0 ? HAUTEUR_UTILE / revenus : Infinity,
    sommeMilieu > 0
      ? (HAUTEUR_UTILE - 2 * ESPACE_MILIEU) / sommeMilieu
      : Infinity,
    sommePostes > 0
      ? (HAUTEUR_UTILE - 5 * ESPACE_DROITE) / sommePostes
      : Infinity,
  ];
  const brut = Math.min(...candidats);
  const echelle = Number.isFinite(brut) ? brut : 0;

  const hauteur = (v: number) => Math.max(HAUTEUR_MIN, v * echelle);

  // Colonne de gauche : revenus, centrée verticalement
  const hRevenus = hauteur(revenus);
  const noeudRevenus: NoeudSankey = {
    cle: "revenus",
    x: X_GAUCHE,
    y: MARGE_VERTICALE + (HAUTEUR_UTILE - hRevenus) / 2,
    largeur: LARGEUR_NOEUD,
    hauteur: hRevenus,
  };

  // Colonne du milieu : commission, charges, reste — centrée
  const hCommission = hauteur(commission);
  const hCharges = hauteur(totalCharges);
  const hReste = hauteur(reste);
  const totalMilieu = hCommission + hCharges + hReste + 2 * ESPACE_MILIEU;
  let yMilieu = MARGE_VERTICALE + (HAUTEUR_UTILE - totalMilieu) / 2;

  const noeudCommission: NoeudSankey = {
    cle: "commission",
    x: X_MILIEU,
    y: yMilieu,
    largeur: LARGEUR_NOEUD,
    hauteur: hCommission,
  };
  yMilieu += hCommission + ESPACE_MILIEU;
  const noeudCharges: NoeudSankey = {
    cle: "charges",
    x: X_MILIEU,
    y: yMilieu,
    largeur: LARGEUR_NOEUD,
    hauteur: hCharges,
  };
  yMilieu += hCharges + ESPACE_MILIEU;
  const noeudReste: NoeudSankey = {
    cle: "reste",
    x: X_MILIEU,
    y: yMilieu,
    largeur: LARGEUR_NOEUD,
    hauteur: hReste,
  };

  // Colonne de droite : les six postes, au sommet du nœud « charges »
  const noeudsPostes: NoeudSankey[] = [];
  let yPoste = noeudCharges.y;
  postes.forEach((montant, index) => {
    const h = hauteur(montant);
    noeudsPostes.push({
      cle: `poste-${index}`,
      x: X_DROITE,
      y: yPoste,
      largeur: LARGEUR_NOEUD,
      hauteur: h,
    });
    yPoste += h + ESPACE_DROITE;
  });

  // Flux revenus → milieu, empilés depuis le sommet du nœud source
  const fluxPrincipaux: FluxSankey[] = [];
  let curseur = noeudRevenus.y;
  for (const noeud of [noeudCommission, noeudCharges, noeudReste]) {
    fluxPrincipaux.push({
      cle: noeud.cle,
      d: cheminFlux(
        X_GAUCHE + LARGEUR_NOEUD,
        curseur,
        X_MILIEU,
        noeud.y,
        noeud.hauteur,
      ),
    });
    curseur += noeud.hauteur;
  }

  // Flux charges → postes
  const fluxPostes: FluxSankey[] = [];
  curseur = noeudCharges.y;
  for (const noeud of noeudsPostes) {
    fluxPostes.push({
      cle: noeud.cle,
      d: cheminFlux(
        X_MILIEU + LARGEUR_NOEUD,
        curseur,
        X_DROITE,
        noeud.y,
        noeud.hauteur,
      ),
    });
    curseur += noeud.hauteur;
  }

  // Étage fiscal : le résultat d'exploitation se répartit en trois
  const noeudsFiscaux: NoeudSankey[] = [];
  const fluxFiscaux: FluxSankey[] = [];
  if (fiscal) {
    const montants: { cle: string; montant: number }[] = [
      { cle: "cotisations", montant: positif(fiscal.cotisations) },
      { cle: "impot", montant: positif(fiscal.impot) },
      { cle: "disponible", montant: positif(fiscal.disponible) },
    ];
    let yFiscal = noeudReste.y;
    let curseurFiscal = noeudReste.y;
    for (const { cle, montant } of montants) {
      const h = hauteur(montant);
      const noeud: NoeudSankey = {
        cle,
        x: X_FISCAL,
        y: yFiscal,
        largeur: LARGEUR_NOEUD,
        hauteur: h,
      };
      noeudsFiscaux.push(noeud);
      fluxFiscaux.push({
        cle,
        d: cheminFlux(
          X_MILIEU + LARGEUR_NOEUD,
          curseurFiscal,
          X_FISCAL,
          noeud.y,
          noeud.hauteur,
        ),
      });
      yFiscal += h + ESPACE_DROITE;
      curseurFiscal += h;
    }
  }

  return {
    largeurVue,
    noeudsFiscaux,
    fluxFiscaux,
    noeudRevenus,
    noeudCommission,
    noeudCharges,
    noeudReste,
    noeudsPostes,
    fluxPrincipaux,
    fluxPostes,
  };
}
