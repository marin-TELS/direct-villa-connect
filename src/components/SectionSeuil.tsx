import { Link } from "@tanstack/react-router";

import { useApparition } from "../hooks/use-apparition";

/**
 * Clôture de la page d'accueil. Elle reste dans la nuit : aucune bascule
 * de couleur ici, le changement d'univers appartient à la page /reponse.
 * La page se ferme sur une porte pleine largeur, pas sur un fondu.
 */
export function SectionSeuil() {
  const ref = useApparition<HTMLElement>();

  return (
    <section
      id="seuil"
      ref={ref}
      data-env="nuit"
      className="section-ancree seuil"
    >
      <div className="conteneur">
        <div className="grille-12">
          <div className="pos-bloc-a">
            <p className="seuil-bloc" data-apparition>
              Vous venez de voir ce que ce canal vous coûte.{" "}
              <span className="seuil-suite">
                Voici ce que nous construisons à la place.
              </span>
            </p>
          </div>
        </div>

        <Link to="/reponse" className="porte" data-apparition>
          <span className="porte-libelle">Découvrir notre réponse</span>
          <span className="porte-fleche" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
