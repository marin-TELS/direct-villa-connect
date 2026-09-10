import { Link } from "@tanstack/react-router";

import { useApparition } from "../hooks/use-apparition";
import { useSuspension } from "../hooks/use-suspension";
import { LigneSection } from "./LigneSection";

const CHIFFRES = [
  {
    montant: "18 445 €",
    libelle: "La commission d’une seule année, sur l’exemple ci-dessus",
    taille: "est-grand",
    duree: "9.4s",
    retard: "0s",
    amplitude: "9px",
  },
  {
    montant: "24,4 %",
    libelle: "Ce qu’elle représente de votre résultat d’exploitation",
    taille: "est-petit",
    duree: "7.3s",
    retard: "-2.1s",
    amplitude: "6px",
  },
  {
    montant: "35,5 %",
    libelle: "Ce qu’elle représente de votre revenu disponible",
    taille: "est-grand",
    duree: "10.6s",
    retard: "-4.7s",
    amplitude: "10px",
  },
  {
    montant: "7 747 €",
    libelle: "Ce que le direct libère chaque année, à nuits égales",
    taille: "est-petit",
    duree: "8.2s",
    retard: "-6.3s",
    amplitude: "7px",
  },
];

export function SectionChiffres() {
  const ref = useApparition<HTMLElement>();
  const rangee = useSuspension<HTMLDivElement>();

  return (
    <section
      id="chiffres"
      ref={ref}
      data-env="nuit"
      className="section-ancree py-16 md:py-24"
    >
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection libelle="Les chiffres" />
          <h2 className="t-section pos-titre-section mt-6" data-apparition>
            Les chiffres
          </h2>
        </div>

        <div className="rangee-carres mt-10 md:mt-16" ref={rangee}>
          {CHIFFRES.map((chiffre, i) => (
            <div
              key={chiffre.montant}
              className={`bloc-carre ${chiffre.taille}`}
              data-apparition
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div
                className="carre-suspendu"
                data-suspendu
                style={
                  {
                    "--duree-flottaison": chiffre.duree,
                    "--retard-flottaison": chiffre.retard,
                    "--amplitude-flottaison": chiffre.amplitude,
                  } as React.CSSProperties
                }
              >
                <span className="carre-montant">{chiffre.montant}</span>
              </div>
              <p className="t-mention carre-libelle">{chiffre.libelle}</p>
            </div>
          ))}
        </div>

        <p className="t-mention mt-10" data-apparition>
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
