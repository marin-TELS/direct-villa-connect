import { useApparition } from "../hooks/use-apparition";
import { LigneSection } from "./LigneSection";

const ETAPES = [
  {
    numero: "01",
    texte:
      "Un appel, quarante minutes. Vos tarifs, vos périodes, vos prestations, vos prestataires. C’est le seul moment où nous avons vraiment besoin de vous.",
  },
  {
    numero: "02",
    texte:
      "Vos photos, vos textes, votre histoire. Vous envoyez ce que vous avez, nous écrivons le reste et nous vous le soumettons. Ce qui fait la valeur d’une maison ne tient jamais dans une annonce : son passé, son emplacement, ce que les gens viennent y chercher. C’est ici qu’on le raconte.",
  },
  {
    numero: "03",
    texte:
      "Construction, et revue de mi-projet. Site, espace de gestion, calendrier, moteur de devis, emails. À mi-parcours, nous vous montrons le site en fonctionnement : vous corrigez ce qui doit l’être pendant qu’il est encore facile de le changer.",
  },
  {
    numero: "04",
    texte:
      "Mise en ligne et prise en main. Une heure ensemble dans votre espace. Vous repartez en sachant confirmer une demande, bloquer une semaine et relancer un acompte.",
  },
];

const CLOTURES = [
  "Pas de logiciel à installer.",
  "Pas de licence tierce à souscrire.",
  "Pas de manuel à lire.",
];

export function SectionMethode() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="methode" ref={ref} className="section-ancree py-24 md:py-40">
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection numero="04" libelle="La méthode" />

          <h2 className="t-section pos-titre-section mt-8" data-apparition>
            En quatre à cinq semaines
          </h2>

          <p className="t-corps-fort pos-chapo mt-6" data-apparition>
            Le temps que cela vous prend, à vous, tient en deux rendez-vous.
          </p>

          <ol className="pos-etapes mt-12 md:mt-16">
            {ETAPES.map((etape) => (
              <li key={etape.numero} className="etape" data-apparition>
                <span className="etape-numero">{etape.numero}</span>
                <p className="t-corps etape-texte">{etape.texte}</p>
              </li>
            ))}
          </ol>

          <p className="pos-etapes t-corps mt-12" data-apparition>
            Ensuite, nous restons à vos côtés. Hébergement, mises à jour,
            corrections, et vous au bout du fil.
          </p>

          <ul className="pos-etapes pile-clotures mt-12" data-apparition>
            {CLOTURES.map((ligne) => (
              <li key={ligne} className="ligne-cloture">
                {ligne}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
