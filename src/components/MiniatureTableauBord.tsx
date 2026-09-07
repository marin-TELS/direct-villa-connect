const ONGLETS = ["Demandes", "Calendrier", "Avis", "Finance", "Visibilité"];

const CARTES = [
  { libelle: "Encaissé", montant: "24 380 €" },
  { libelle: "Reste à encaisser", montant: "11 200 €" },
  { libelle: "Séjours confirmés", montant: "6" },
];

/** Miniature du tableau de bord, construite en CSS. Aucune image. */
export function MiniatureTableauBord() {
  return (
    <div className="mini-bord">
      <div className="mini-bord-onglets">
        {ONGLETS.map((onglet, index) => (
          <span
            key={onglet}
            className={`mini-bord-onglet${index === 0 ? " est-actif" : ""}`}
          >
            {onglet}
          </span>
        ))}
      </div>

      <div className="mini-bord-cartes">
        {CARTES.map((carte) => (
          <div key={carte.libelle} className="mini-bord-carte">
            <p className="mini-bord-libelle">{carte.libelle}</p>
            <p className="mini-bord-montant">{carte.montant}</p>
          </div>
        ))}
      </div>

      <div className="mini-bord-tableau">
        {[0, 1, 2].map((ligne) => (
          <div key={ligne} className="mini-bord-ligne">
            {ligne === 2 && <span className="mini-bord-pastille" />}
            <span className="mini-bord-barre" style={{ width: "38%" }} />
            <span className="mini-bord-barre" style={{ width: "22%" }} />
            <span className="mini-bord-barre" style={{ width: "16%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
