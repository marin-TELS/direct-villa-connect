import { useEffect, useState } from "react";

import { CadreTelephone } from "./CadreNavigateur";

const JOURS = Array.from({ length: 30 }, (_, index) => index + 1);
const SELECTION = [12, 19];

const OPTIONS = [
  "Ménage de fin de séjour",
  "Chef à domicile",
  "Livraison de linge",
];

/** Trois états superposés, boucle lente de 3,5 s, arrêt au survol. */
export function ApercuReservation() {
  const [etat, setEtat] = useState(0);
  const [enPause, setEnPause] = useState(false);

  useEffect(() => {
    const reduire = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduire) {
      setEtat(2);
      return;
    }
    if (enPause) return;
    const minuterie = window.setInterval(
      () => setEtat((precedent) => (precedent + 1) % 3),
      3500,
    );
    return () => window.clearInterval(minuterie);
  }, [enPause]);

  return (
    <div
      className="apercu-reservation"
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
    >
      <CadreTelephone>
        <div className="mini-etats">
          <div className={`mini-etat${etat === 0 ? " est-actif" : ""}`}>
            <p className="mini-etat-titre">Juillet</p>
            <div className="mini-calendrier">
              {JOURS.map((jour) => (
                <span
                  key={jour}
                  className={`mini-jour${
                    SELECTION.includes(jour) ? " est-choisi" : ""
                  }`}
                >
                  {jour}
                </span>
              ))}
            </div>
          </div>

          <div className={`mini-etat${etat === 1 ? " est-actif" : ""}`}>
            <p className="mini-etat-titre">Options</p>
            <ul className="mini-options">
              {OPTIONS.map((option) => (
                <li key={option} className="mini-option">
                  <span className="mini-case" />
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`mini-etat${etat === 2 ? " est-actif" : ""}`}>
            <p className="mini-etat-titre">Récapitulatif</p>
            <p className="mini-recap-ligne">7 nuits</p>
            <p className="mini-recap-ligne">3 options</p>
            <p className="mini-recap-montant">10 740 €</p>
            <span className="mini-bouton">Envoyer ma demande</span>
          </div>
        </div>
      </CadreTelephone>

      <p className="t-mention mt-4">Deux minutes, sans quitter la page.</p>
    </div>
  );
}
