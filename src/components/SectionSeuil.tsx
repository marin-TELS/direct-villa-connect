import { Link } from "@tanstack/react-router";

import { useApparition } from "../hooks/use-apparition";

/** Seuil plein écran : la bascule de la nuit vers le jour. */
export function SectionSeuil() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="seuil" ref={ref} data-env="jour" className="section-ancree seuil">
      <div className="conteneur">
        <div className="grille-12">
          <div className="pos-bloc-a">
            <p className="seuil-bloc" data-apparition>
              Vous venez de voir ce que ce canal vous coûte.{" "}
              <span className="seuil-suite">
                Voici ce que nous construisons à la place.
              </span>
            </p>

            <div className="mt-12" data-apparition>
              <Link
                to="/reponse"
                className="bouton-principal inline-flex items-center"
              >
                Découvrir notre réponse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
