import { BLOCAGE, SEJOURS } from "./donnees";

const MOIS = [
  { indice: 5, nom: "Juin", jours: 30, premierJour: 1 },
  { indice: 6, nom: "Juillet", jours: 31, premierJour: 3 },
  { indice: 7, nom: "Août", jours: 31, premierJour: 6 },
];

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];

export function OngletCalendrier({
  onSejour,
}: {
  onSejour: (cle: string) => void;
}) {
  return (
    <div className="demo-calendrier">
      <div className="demo-mois-rangee">
        {MOIS.map((mois) => (
          <div key={mois.nom} className="demo-mois">
            <p className="demo-carte-titre">{mois.nom}</p>
            <div className="demo-grille-jours">
              {JOURS.map((jour, i) => (
                <span key={`${jour}-${i}`} className="demo-jour-entete">
                  {jour}
                </span>
              ))}
              {Array.from({ length: (mois.premierJour + 6) % 7 }, (_, i) => (
                <span key={`vide-${i}`} className="demo-jour-vide" />
              ))}
              {Array.from({ length: mois.jours }, (_, i) => {
                const jour = i + 1;
                const sejour = SEJOURS.find(
                  (s) =>
                    s.mois === mois.indice && jour >= s.debut && jour <= s.fin,
                );
                const bloque =
                  BLOCAGE.mois === mois.indice &&
                  jour >= BLOCAGE.debut &&
                  jour <= BLOCAGE.fin;

                if (sejour) {
                  return (
                    <button
                      key={jour}
                      type="button"
                      className="demo-jour est-sejour"
                      onClick={() => onSejour(sejour.cle)}
                    >
                      {jour}
                    </button>
                  );
                }
                return (
                  <span
                    key={jour}
                    className={`demo-jour${bloque ? " est-bloque" : ""}`}
                  >
                    {jour}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="demo-legende">
        <span className="demo-legende-item">
          <span className="demo-pastille est-sejour" /> Séjour confirmé
        </span>
        <span className="demo-legende-item">
          <span className="demo-pastille est-bloque" /> Entretien de la piscine,
          8 au 10 juin
        </span>
      </div>

      <p className="demo-phrase">
        Un blocage ici, et la date disparaît du site dans la seconde.
      </p>
    </div>
  );
}
