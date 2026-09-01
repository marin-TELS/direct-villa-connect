import { useApparition } from "../hooks/use-apparition";

/** Seuil plein écran : la bascule de la nuit vers le jour. */
export function SectionSeuil() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="seuil" ref={ref} data-env="jour" className="section-ancree seuil">
      <div className="conteneur">
        <div className="grille-12">
          <div className="pos-bloc-a">
            <p className="seuil-titre" data-apparition>
              Vous venez de voir ce que ce canal vous coûte.
            </p>
            <p className="seuil-titre" data-apparition>
              Voici ce que nous construisons à la place.
            </p>
            <div className="mt-12" data-apparition>
              <a
                href="#reponse"
                className="bouton-principal inline-flex items-center"
              >
                Découvrir notre réponse
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
