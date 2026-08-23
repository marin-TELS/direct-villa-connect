import { useApparition } from "../hooks/use-apparition";

export function BandeauOuverture() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="haut" ref={ref} className="bandeau section-ancree">
      <div className="conteneur grille-12 bandeau-grille">
        <div className="pos-bandeau">
          <p className="t-libelle" data-apparition>
            Studio web — Réservation directe
          </p>
          <h1 className="t-ouverture mt-6" data-apparition>
            Votre villa vous appartient.
            <br />
            <span className="text-craie-2">Votre clientèle, non.</span>
          </h1>
          <p className="t-corps-fort bandeau-intro" data-apparition>
            Vous leur ouvrez votre porte, vous leur remettez les clés. Puis les
            conditions que vous avez acceptées vous interdisent de les
            démarcher.
          </p>
          <p className="t-corps mt-6" data-apparition>
            Nous construisons le canal qui vous rend les deux.
          </p>
          <div className="mt-12" data-apparition>
            <a href="#diagramme" className="bouton-principal">
              Voir ce que cela représente
            </a>
          </div>
        </div>
      </div>

      <div className="indice-defilement" data-apparition>
        <span className="filet-vertical" aria-hidden="true" />
        <span className="texte-indice">Faites défiler</span>
      </div>
    </section>
  );
}
