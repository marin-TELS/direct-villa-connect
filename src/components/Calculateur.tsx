import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
} from "react";

import { DiagrammeSankey } from "./DiagrammeSankey";

type CleCanal =
  | "airbnb_hote"
  | "airbnb_partage"
  | "booking"
  | "abritel"
  | "conciergerie";

interface Charge {
  cle: string;
  libelle: string;
  montant: number;
}

interface Canal {
  cle: CleCanal;
  libelle: string;
  taux: number | null; // null = taux libre (conciergerie)
  mention: string;
}

const PRIX_NUIT_DEFAUT = 1400;
const NUITS_DEFAUT = 85;
const TAUX_CONCIERGERIE_DEFAUT = 20;
const AMORTISSEMENTS_DEFAUT = 35000;
const TMI_DEFAUT = 0.3;
const COTISATIONS_MINIMALES = 1300;
const TAUX_COTISATIONS = 0.4;

const TRANCHES = [0.11, 0.3, 0.41, 0.45];

const CHARGES_DEFAUT: Charge[] = [
  { cle: "menage", libelle: "Ménage et blanchisserie", montant: 6300 },
  { cle: "exterieur", libelle: "Piscine et jardin", montant: 4800 },
  { cle: "energie", libelle: "Énergie, eau, internet", montant: 4800 },
  { cle: "entretien", libelle: "Entretien et réparations", montant: 4500 },
  { cle: "fonciere", libelle: "Taxe foncière", montant: 3200 },
  { cle: "assurance", libelle: "Assurance", montant: 1400 },
];

const CANAUX: Canal[] = [
  {
    cle: "airbnb_hote",
    libelle: "Airbnb, frais hôte",
    taux: 15.5,
    mention: "15,5 % HT côté hôte. 18,6 % TTC si vous ne récupérez pas la TVA.",
  },
  {
    cle: "airbnb_partage",
    libelle: "Airbnb, frais partagés",
    taux: 3,
    mention:
      "3 % HT côté hôte, mais votre voyageur paie en plus 14,1 à 16,5 %. Modèle supprimé dans l’Espace économique européen le 13 octobre 2026.",
  },
  {
    cle: "booking",
    libelle: "Booking.com",
    taux: 16.1,
    mention:
      "Environ 14,7 % de commission plus 1,4 % de frais de traitement. Varie selon le contrat.",
  },
  {
    cle: "abritel",
    libelle: "Abritel / Vrbo",
    taux: 8,
    mention:
      "Environ 5 % de commission plus 3 % de frais de paiement. Votre voyageur paie en plus.",
  },
  {
    cle: "conciergerie",
    libelle: "Conciergerie",
    taux: null,
    mention:
      "Les pratiques vont du simple mandat de commercialisation à la gestion complète. Nous ne fixons pas de taux : indiquez le vôtre.",
  },
];

const formatMontant = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const formatPourcent = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});

const formatNombre = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

/** Une décimale seulement si elle est significative : « 24,4 » mais « 24 ». */
function formaterPourcentage(valeur: number): string {
  return formatPourcent.format(Math.round(valeur * 10) / 10);
}

/** Lecture d'un champ numérique : vide compte comme 0, jamais de négatif. */
function lectureNombre(evenement: ChangeEvent<HTMLInputElement>): number {
  const valeur = evenement.target.valueAsNumber;
  return Number.isNaN(valeur) ? 0 : Math.max(0, valeur);
}

/** Nombre qui change par un simple fondu d'opacité de 150ms. */
function NombreAnime({
  valeur,
  alerte = false,
}: {
  valeur: string;
  alerte?: boolean;
}) {
  const [affichee, setAffichee] = useState(valeur);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (valeur === affichee) return;
    setVisible(false);
    const minuteur = setTimeout(() => {
      setAffichee(valeur);
      setVisible(true);
    }, 150);
    return () => clearTimeout(minuteur);
  }, [valeur, affichee]);

  return (
    <span
      className={`chiffre-dynamique${alerte ? " chiffre-alerte" : ""}`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      {affichee}
    </span>
  );
}

function ChampNombre({
  id,
  libelle,
  valeur,
  suffixe,
  onChange,
}: {
  id: string;
  libelle: string;
  valeur: number;
  suffixe?: string;
  onChange: (valeur: number) => void;
}) {
  return (
    <div className="ligne-champ">
      <label htmlFor={id} className="t-mention">
        {libelle}
      </label>
      <span className="champ-conteneur">
        <input
          id={id}
          type="number"
          min={0}
          className="champ-nombre"
          value={valeur}
          onChange={(e) => onChange(lectureNombre(e))}
        />
        {suffixe ? <span className="champ-suffixe">{suffixe}</span> : null}
      </span>
    </div>
  );
}

/*
 * Tout le calcul se fait dans le navigateur : aucune requête réseau,
 * aucune donnée envoyée ni enregistrée.
 */
export function Calculateur() {
  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const [prixNuit, setPrixNuit] = useState(PRIX_NUIT_DEFAUT);
  const [nuitsLouees, setNuitsLouees] = useState(NUITS_DEFAUT);
  const [canal, setCanal] = useState<CleCanal>("airbnb_hote");
  const [tauxConciergerie, setTauxConciergerie] = useState(
    TAUX_CONCIERGERIE_DEFAUT,
  );
  const [charges, setCharges] = useState<Charge[]>(CHARGES_DEFAUT);
  // L'étage fiscal est fermé au chargement, indépendamment du panneau
  const [etageFiscal, setEtageFiscal] = useState(false);
  const [amortissements, setAmortissements] = useState(AMORTISSEMENTS_DEFAUT);
  const [tmi, setTmi] = useState(TMI_DEFAUT);

  // Animation d'entrée du diagramme : une seule fois, au premier passage
  const refZone = useRef<HTMLDivElement>(null);
  const [estVisible, setEstVisible] = useState(false);
  useEffect(() => {
    const zone = refZone.current;
    if (!zone) return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          setEstVisible(true);
          observateur.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observateur.observe(zone);
    return () => observateur.disconnect();
  }, []);

  const canalActif = CANAUX.find((c) => c.cle === canal) ?? CANAUX[0]!;
  const tauxCommission =
    canal === "conciergerie" ? tauxConciergerie : (canalActif.taux ?? 0);

  const revenus = prixNuit * nuitsLouees;
  const commission = (revenus * tauxCommission) / 100;
  const totalCharges = charges.reduce((s, c) => s + c.montant, 0);
  const resultat = revenus - commission - totalCharges;
  // Jamais de division par zéro : pas de pourcentage si résultat nul ou négatif
  const partDuResultat = resultat > 0 ? (commission / resultat) * 100 : null;

  // Étage fiscal, calculé entièrement dans le navigateur
  const resultatPositif = Math.max(0, resultat);
  const baseImposable = Math.max(0, resultatPositif - amortissements);
  const cotisations =
    baseImposable > 0
      ? Math.max(COTISATIONS_MINIMALES, TAUX_COTISATIONS * baseImposable)
      : COTISATIONS_MINIMALES;
  const impotRevenu = Math.max(0, baseImposable - cotisations) * tmi;
  const revenuDisponible = Math.max(
    0,
    resultatPositif - cotisations - impotRevenu,
  );
  const donneesFiscales = {
    cotisations,
    impot: impotRevenu,
    disponible: revenuDisponible,
  };

  // Même cascade, commission remise à zéro : le revenu libéré par le direct
  const resultatSansCommission = Math.max(0, revenus - totalCharges);
  const baseSansCommission = Math.max(0, resultatSansCommission - amortissements);
  const cotisationsSansCommission =
    baseSansCommission > 0
      ? Math.max(COTISATIONS_MINIMALES, TAUX_COTISATIONS * baseSansCommission)
      : COTISATIONS_MINIMALES;
  const impotSansCommission =
    Math.max(0, baseSansCommission - cotisationsSansCommission) * tmi;
  const disponibleSansCommission = Math.max(
    0,
    resultatSansCommission - cotisationsSansCommission - impotSansCommission,
  );
  const ecartDisponible = Math.max(
    0,
    disponibleSansCommission - revenuDisponible,
  );
  const partDuDisponible =
    revenuDisponible > 0 ? (commission / revenuDisponible) * 100 : null;


  const retablirExemple = () => {
    setPrixNuit(PRIX_NUIT_DEFAUT);
    setNuitsLouees(NUITS_DEFAUT);
    setCanal("airbnb_hote");
    setTauxConciergerie(TAUX_CONCIERGERIE_DEFAUT);
    setCharges(CHARGES_DEFAUT.map((c) => ({ ...c })));
    setAmortissements(AMORTISSEMENTS_DEFAUT);
    setTmi(TMI_DEFAUT);
    setPanneauOuvert(false);
  };

  const majCharge = (index: number, montant: number) =>
    setCharges((actuelles) =>
      actuelles.map((c, i) => (i === index ? { ...c, montant } : c)),
    );

  const progressionCurseur = ((tauxConciergerie - 15) / 15) * 100;

  // Version mobile : liste de barres proportionnelles aux revenus
  const postesMobile = [
    {
      cle: "commission",
      nom: "Commission",
      montant: commission,
      couleur: "var(--alerte)",
    },
    ...charges.map((c) => ({
      cle: c.cle,
      nom: c.libelle,
      montant: c.montant,
      couleur: "var(--craie-3)",
    })),
    {
      cle: "reste",
      nom: "Résultat d’exploitation",
      montant: Math.max(0, resultat),
      couleur: "var(--signal)",
    },
  ];

  return (
    <div ref={refZone} className="grille-12 mt-10 md:mt-12" data-apparition>
      <p className="pos-chapo t-libelle ligne-contexte">
        Villa à {formatNombre.format(prixNuit)} € la nuit,{" "}
        {formatNombre.format(nuitsLouees)} nuits louées, commissionnée à{" "}
        {formaterPourcentage(tauxCommission)} %.
      </p>

      <div className="pos-pleine zone-diagramme mt-10 hidden md:flex">
        <div className="zone-diagramme-figure">
          <DiagrammeSankey
            revenus={revenus}
            commission={commission}
            totalCharges={totalCharges}
            reste={resultatPositif}
            postes={charges}
            fiscal={etageFiscal ? donneesFiscales : undefined}
            estVisible={estVisible}
            formatMontant={(v) => formatMontant.format(Math.round(v))}
            formatPart={formaterPourcentage}
          />
        </div>

        <div className="detail-charges">
          <p className="t-libelle">Charges d’exploitation</p>
          <ul className="mt-4">
            {charges.map((charge) => (
              <li key={charge.cle} className="ligne-detail-charge">
                <span className="t-mention">{charge.libelle}</span>
                <span className="montant-detail">
                  {formatMontant.format(Math.round(charge.montant))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`pos-pleine sankey-mobile mt-10 md:hidden${estVisible ? " est-visible" : ""}`}
      >
        {postesMobile.map((p) => {
          const largeur =
            revenus > 0 ? Math.min(100, (p.montant / revenus) * 100) : 0;
          return (
            <div key={p.cle} className="barre-poste">
              <div className="barre-poste-ligne">
                <span className="barre-poste-nom">{p.nom}</span>
                <span className="barre-poste-montant">
                  {formatMontant.format(Math.round(p.montant))}
                </span>
              </div>
              <div className="barre-poste-piste">
                <div
                  className="barre-poste-remplissage"
                  style={
                    {
                      "--cible": `${largeur}%`,
                      backgroundColor: p.couleur,
                    } as CSSProperties
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pos-bloc-b phrase-resultat">
        {partDuResultat === null ? (
          <p>Le résultat est nul ou négatif avec ces valeurs.</p>
        ) : (
          <>
            <p>
              Cette commission représente{" "}
              <NombreAnime
                valeur={`${formaterPourcentage(tauxCommission)} %`}
              />{" "}
              de vos revenus.
            </p>
            <p>
              Elle représente{" "}
              <NombreAnime
                alerte
                valeur={`${formaterPourcentage(partDuResultat)} %`}
              />{" "}
              de votre résultat d’exploitation.
            </p>
          </>
        )}
      </div>

      <p className="pos-bloc-b t-corps-fort mt-8">
        Reprendre ne serait-ce qu’une partie de ce canal augmente votre résultat
        sans louer une nuit de plus, et sans rien changer à votre maison.
      </p>

      <div className="pos-bloc-b rangee-boutons mt-10">
        {!panneauOuvert ? (
          <button
            type="button"
            className="bouton-contour inline-flex items-center"
            onClick={() => setPanneauOuvert(true)}
          >
            Utiliser mes propres chiffres
          </button>
        ) : null}
        {!etageFiscal ? (
          <button
            type="button"
            className="bouton-contour inline-flex items-center"
            onClick={() => setEtageFiscal(true)}
          >
            Et après l’impôt ?
          </button>
        ) : (
          <button
            type="button"
            className="lien-retablir"
            onClick={() => setEtageFiscal(false)}
          >
            Replier
          </button>
        )}
      </div>

      {etageFiscal ? (
        <div className="pos-pleine etage-fiscal mt-10">
          <p className="t-libelle">Votre fiscalité</p>

          <div className="reglages-fiscaux mt-5">
            <div>
              <ChampNombre
                id="champ-amortissements"
                libelle="Amortissements et intérêts déductibles"
                valeur={amortissements}
                suffixe="€"
                onChange={setAmortissements}
              />
              <p className="t-mention mt-3">
                Hypothèse : 35 000 € d’amortissements et d’intérêts déductibles.
                Votre expert-comptable a le vrai chiffre.
              </p>
            </div>

            <div>
              <p className="t-mention">Votre tranche d’imposition</p>
              <div
                className="selecteur-canal mt-4"
                role="radiogroup"
                aria-label="Votre tranche d’imposition"
              >
                {TRANCHES.map((tranche) => (
                  <button
                    key={tranche}
                    type="button"
                    role="radio"
                    aria-checked={tmi === tranche}
                    className={`onglet-canal${tmi === tranche ? " est-actif" : ""}`}
                    onClick={() => setTmi(tranche)}
                  >
                    {formaterPourcentage(tranche * 100)} %
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="t-corps-fort mt-8">
            La commission, elle, ne connaît ni tranche, ni abattement, ni
            amortissement : elle se prélève sur la recette, avant tout le reste.
          </p>

          <p className="t-mention mt-6">
            Calcul simplifié pour un loueur au régime réel : à ce niveau de
            recettes, le régime micro n’est plus accessible et les cotisations
            sociales d’indépendant sont dues (estimées ici à 40 % du bénéfice,
            avec un minimum d’environ 1 300 € par an ; l’impôt est calculé après
            leur déduction). Hors CFE et hors TVA para-hôtelière.
            L’amortissement peut ramener la base imposable à zéro les premières
            années.
          </p>
        </div>
      ) : null}

      {panneauOuvert ? (
        <div className="pos-pleine panneau-saisie mt-10">
          <div className="panneau-grille">
            <div className="panneau-partie">
              <p className="t-libelle">Votre canal</p>
              <div
                className="selecteur-canal mt-5"
                role="radiogroup"
                aria-label="Votre canal"
              >
                {CANAUX.map((c) => (
                  <button
                    key={c.cle}
                    type="button"
                    role="radio"
                    aria-checked={canal === c.cle}
                    className={`onglet-canal${canal === c.cle ? " est-actif" : ""}`}
                    onClick={() => setCanal(c.cle)}
                  >
                    {c.libelle}
                  </button>
                ))}
              </div>

              {canal === "conciergerie" ? (
                <div className="mt-6">
                  <label htmlFor="curseur-conciergerie" className="t-libelle">
                    Votre taux de conciergerie
                  </label>
                  <div className="curseur-ligne mt-4">
                    <input
                      id="curseur-conciergerie"
                      type="range"
                      min={15}
                      max={30}
                      step={1}
                      value={tauxConciergerie}
                      onChange={(e) =>
                        setTauxConciergerie(Number(e.target.value))
                      }
                      className="curseur-taux"
                      style={
                        {
                          "--progression": `${progressionCurseur}%`,
                        } as CSSProperties
                      }
                    />
                    <span className="curseur-valeur">{tauxConciergerie} %</span>
                  </div>
                </div>
              ) : null}

              <p className="t-mention mt-5">{canalActif.mention}</p>
            </div>

            <div className="panneau-partie">
              <p className="t-libelle">Vos revenus</p>
              <div className="mt-5">
                <ChampNombre
                  id="champ-prix-nuit"
                  libelle="Prix moyen par nuit"
                  valeur={prixNuit}
                  suffixe="€"
                  onChange={setPrixNuit}
                />
                <ChampNombre
                  id="champ-nuits"
                  libelle="Nuits louées par an"
                  valeur={nuitsLouees}
                  onChange={setNuitsLouees}
                />
              </div>
            </div>

            <div className="panneau-partie">
              <p className="t-libelle">Vos charges</p>
              <div className="mt-5">
                {charges.map((charge, index) => (
                  <ChampNombre
                    key={charge.cle}
                    id={`champ-${charge.cle}`}
                    libelle={charge.libelle}
                    valeur={charge.montant}
                    suffixe="€"
                    onChange={(v) => majCharge(index, v)}
                  />
                ))}
              </div>
              <div className="ligne-total">
                <span className="t-mention">Total des charges</span>
                <span className="montant-total">
                  {formatMontant.format(totalCharges)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="lien-retablir mt-6"
            onClick={retablirExemple}
          >
            Revenir à l’exemple
          </button>
        </div>
      ) : null}
    </div>
  );
}
