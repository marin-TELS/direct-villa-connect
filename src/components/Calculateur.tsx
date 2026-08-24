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
    libelle: "Airbnb — frais hôte",
    taux: 15.5,
    mention:
      "15,5 % HT côté hôte. 18,6 % TTC si vous ne récupérez pas la TVA.",
  },
  {
    cle: "airbnb_partage",
    libelle: "Airbnb — frais partagés",
    taux: 3,
    mention:
      "3 % HT côté hôte, mais votre voyageur paie en plus 14,1 à 16,5 %. Modèle en extinction.",
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

export function Calculateur() {
  const [prixNuit, setPrixNuit] = useState(PRIX_NUIT_DEFAUT);
  const [nuitsLouees, setNuitsLouees] = useState(NUITS_DEFAUT);
  const [canal, setCanal] = useState<CleCanal>("airbnb_hote");
  const [tauxConciergerie, setTauxConciergerie] = useState(
    TAUX_CONCIERGERIE_DEFAUT,
  );
  const [charges, setCharges] = useState<Charge[]>(CHARGES_DEFAUT);

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

  const canalActif = CANAUX.find((c) => c.cle === canal) ?? CANAUX[0];
  const tauxCommission =
    canal === "conciergerie" ? tauxConciergerie : (canalActif.taux ?? 0);

  const revenus = prixNuit * nuitsLouees;
  const commission = (revenus * tauxCommission) / 100;
  const totalCharges = charges.reduce((s, c) => s + c.montant, 0);
  const resultat = revenus - commission - totalCharges;
  // Jamais de division par zéro : pas de pourcentage si résultat nul ou négatif
  const partDuResultat =
    resultat > 0 ? (commission / resultat) * 100 : null;

  const retablirExemple = () => {
    setPrixNuit(PRIX_NUIT_DEFAUT);
    setNuitsLouees(NUITS_DEFAUT);
    setCanal("airbnb_hote");
    setTauxConciergerie(TAUX_CONCIERGERIE_DEFAUT);
    setCharges(CHARGES_DEFAUT.map((c) => ({ ...c })));
  };

  const majCharge = (index: number, montant: number) =>
    setCharges((actuelles) =>
      actuelles.map((c, i) => (i === index ? { ...c, montant } : c)),
    );

  const progressionCurseur = ((tauxConciergerie - 15) / 15) * 100;

  // Version mobile : liste de barres proportionnelles aux revenus
  const postesMobile = [
    { cle: "commission", nom: "Commission", montant: commission, couleur: "var(--alerte)" },
    ...charges.map((c) => ({
      cle: c.cle,
      nom: c.libelle,
      montant: c.montant,
      couleur: "var(--craie-3)",
    })),
    { cle: "reste", nom: "Ce qu’il vous reste", montant: Math.max(0, resultat), couleur: "var(--signal)" },
  ];

  return (
    <div ref={refZone} className="grille-12 mt-12 md:mt-16" data-apparition>
      <div className="pos-diagramme">
        <div
          className="selecteur-canal"
          role="tablist"
          aria-label="Canal de réservation"
        >
          {CANAUX.map((c) => (
            <button
              key={c.cle}
              type="button"
              role="tab"
              aria-selected={canal === c.cle}
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
                onChange={(e) => setTauxConciergerie(Number(e.target.value))}
                className="curseur-taux"
                style={
                  { "--progression": `${progressionCurseur}%` } as CSSProperties
                }
              />
              <span className="curseur-valeur">{tauxConciergerie} %</span>
            </div>
            <p className="t-mention mt-4">{canalActif.mention}</p>
          </div>
        ) : (
          <p className="t-mention mt-4">{canalActif.mention}</p>
        )}

        {canal === "airbnb_hote" && (
          <div className="encart-octobre mt-6">
            <p className="t-libelle">13 octobre 2026</p>
            <p className="t-mention mt-3">
              Les annonces Airbnb de l’Espace économique européen basculent vers
              un modèle où la commission est intégralement supportée par l’hôte.
              Si vous êtes encore en frais partagés, votre taux passera de 3 %
              à 15,5 %.
            </p>
          </div>
        )}

        <div className="mt-10 hidden md:block">
          <DiagrammeSankey
            revenus={revenus}
            commission={commission}
            totalCharges={totalCharges}
            reste={Math.max(0, resultat)}
            postes={charges}
            estVisible={estVisible}
            formatMontant={(v) => formatMontant.format(Math.round(v))}
          />
        </div>

        <div
          className={`sankey-mobile mt-10 md:hidden${estVisible ? " est-visible" : ""}`}
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

        <div className="phrase-resultat">
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
                de votre résultat.
              </p>
            </>
          )}
        </div>

        <p className="t-corps mt-6">
          Reprendre ne serait-ce qu’une partie de ce canal augmente votre
          résultat sans louer une nuit de plus.
        </p>
      </div>

      <aside className="pos-encart mt-12 md:mt-0">
        <div className="bloc-entrees">
          <p className="t-libelle">Vos chiffres</p>
          <div className="mt-4">
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
        <button
          type="button"
          className="lien-retablir mt-4"
          onClick={retablirExemple}
        >
          Rétablir l’exemple
        </button>
      </aside>
    </div>
  );
}
