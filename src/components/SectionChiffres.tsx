import { Link } from "@tanstack/react-router";

import { useApparition } from "../hooks/use-apparition";

const CHIFFRES = [
  {
    montant: "18 445 €",
    libelle: "La commission d’une seule année, sur l’exemple ci-dessus",
  },
  {
    montant: "24,4 %",
    libelle: "Ce qu’elle représente de votre résultat d’exploitation",
  },
  {
    montant: "35,5 %",
    libelle: "Ce qu’elle représente de votre revenu disponible",
  },
  {
    montant: "7 747 €",
    libelle: "Ce que le direct libère chaque année, à nuits égales",
  },
];

export function SectionChiffres() {
  const ref = useApparition<HTMLElement>();

  return (
    <section
      id="chiffres"
      ref={ref}
      data-env="nuit"
      className="section-ancree py-16 md:py-24"
    >
      <div className="conteneur">
        <div className="rangee-chiffres" data-apparition>
          {CHIFFRES.map((chiffre) => (
            <div key={chiffre.montant} className="bloc-chiffre">
              <p className="chiffre-montant">{chiffre.montant}</p>
              <p className="t-mention chiffre-libelle">{chiffre.libelle}</p>
            </div>
          ))}
        </div>

        <p className="t-mention mt-8" data-apparition>
          Tous ces chiffres viennent du calcul ci-dessus. Refaites-le avec les
          vôtres.
        </p>

        <div className="mt-10" data-apparition>
          <Link
            to="/reponse"
            hash="contact"
            className="bouton-contour inline-flex items-center"
          >
            Parlons de votre maison
          </Link>
        </div>
      </div>
    </section>
  );
}
