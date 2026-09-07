import { Link } from "@tanstack/react-router";

import { useApparition } from "../hooks/use-apparition";

/** Renvoi court vers la page /audit, entre les tarifs et la FAQ. */
export function RenvoiAudit() {
  const ref = useApparition<HTMLElement>();

  return (
    <section ref={ref} data-env="jour" className="py-16 md:py-24">
      <div className="conteneur">
        <div className="grille-12">
          <div className="pos-bloc-a">
            <h2 className="t-bloc" data-apparition>
              Une autre villa est recommandée à votre place.
            </h2>
            <p className="t-corps mt-6" data-apparition>
              Vous ne savez pas laquelle. L’audit de visibilité IA vous le dit,
              nom par nom.
            </p>
            <div className="mt-8" data-apparition>
              <Link to="/audit" className="bouton-contour inline-flex items-center">
                Découvrir l’audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
