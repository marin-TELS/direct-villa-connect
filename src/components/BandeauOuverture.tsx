import { useApparition } from "../hooks/use-apparition";

export function BandeauOuverture() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="haut" ref={ref} className="bandeau section-ancree">
      <div className="conteneur grille-12 bandeau-grille">
        <div className="pos-bandeau">
          <p className="t-libelle" data-apparition>
            Studio web · Réservation directe
          </p>

          <div className="bandeau-signal" data-apparition>
            <span className="signal-date">13 octobre 2026</span>
            <span className="signal-texte">
              Airbnb généralise la commission à la charge de l’hôte dans
              l’Espace économique européen. Un propriétaire encore en frais
              partagés passe de 3 % à 15,5 %.
            </span>
          </div>

          <h1 className="t-ouverture mt-8" data-apparition>
            Votre villa vous appartient.
            <br />
            <span className="text-craie-2">Votre clientèle, non.</span>
          </h1>

          <p className="t-corps-fort bandeau-intro" data-apparition>
            Vous ouvrez votre porte, vous remettez vos clés, vous indiquez le
            bon restaurant. La plateforme, elle, prélève sa part sur chaque
            nuit, et le client reste dans son fichier plutôt que dans le vôtre.
          </p>
          <p className="t-corps mt-6" data-apparition>
            Nous construisons le canal qui vous rend les deux : la nuit entière,
            et le lien avec ceux qui l’ont passée chez vous.
          </p>

          <div className="mt-12" data-apparition>
            <a
              href="#diagramme"
              className="bouton-principal inline-flex items-center"
            >
              Calculer ce que cela vous coûte
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
