import { ECHEANCES, formatEuro } from "./donnees";
import {
  FormesGraphe,
  FormesLignes,
  FormesTableau,
  ModuleVerrouille,
} from "./ModuleVerrouille";

const CHIFFRES = [
  { cle: "encaisse", libelle: "Encaissé cette saison", valeur: "24 380 €" },
  { cle: "reste", libelle: "Reste à encaisser", valeur: "11 200 €" },
  { cle: "sejours", libelle: "Séjours confirmés", valeur: "6" },
];

export function OngletFinance() {
  return (
    <div className="demo-finance">
      <div className="demo-chiffres">
        {CHIFFRES.map((chiffre) => (
          <div key={chiffre.cle} className="demo-carte">
            <p className="demo-libelle">{chiffre.libelle}</p>
            <p className="demo-chiffre-grand">{chiffre.valeur}</p>
          </div>
        ))}
      </div>

      <div className="demo-carte">
        <p className="demo-carte-titre">Les échéances à venir</p>
        <ul className="demo-liste">
          {ECHEANCES.map((echeance) => (
            <li key={echeance.cle} className="demo-ligne-option">
              <span>{echeance.client}</span>
              <span className="demo-montant">
                {formatEuro.format(echeance.montant)}
              </span>
              <span className="demo-cellule">{echeance.date}</span>
              <span
                className={
                  echeance.retard ? "demo-statut demo-rouge" : "demo-statut"
                }
              >
                {echeance.statut}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="demo-deux-colonnes">
        <ModuleVerrouille titre="Marge par option">
          <FormesTableau lignes={4} />
        </ModuleVerrouille>
        <ModuleVerrouille titre="Taux d’attache des options">
          <FormesLignes lignes={4} />
        </ModuleVerrouille>
      </div>

      <ModuleVerrouille titre="Douze mois glissants">
        <FormesGraphe />
      </ModuleVerrouille>
    </div>
  );
}
