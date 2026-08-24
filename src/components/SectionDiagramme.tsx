import { useApparition } from "../hooks/use-apparition";
import { LigneSection } from "./LigneSection";
import { Calculateur } from "./Calculateur";

export function SectionDiagramme() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="diagramme" ref={ref} className="section-ancree py-24 md:py-40">
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection numero="02" libelle="Le calcul" />

          <h2 className="t-section pos-titre-section mt-8" data-apparition>
            Ce que la commission vous coûte vraiment
          </h2>

          <p className="t-corps-fort pos-chapo mt-6" data-apparition>
            On parle toujours de la commission en pourcentage du chiffre
            d’affaires. C’est la façon la plus flatteuse de la présenter.
            Regardez-la en pourcentage de ce qu’il vous reste.
          </p>
        </div>

        <Calculateur />

        <div className="grille-12 mt-16 md:mt-20">
          <div className="pos-chapo pile-mentions" data-apparition>
            <p className="t-mention">
              Sur Airbnb en frais partagés comme sur Abritel, le voyageur paie
              des frais que vous ne voyez pas. Il paie 100, vous en recevez
              environ 80. En direct, il paie 100 et vous recevez 100 — ou vous
              lui en rendez une partie, et vous devenez moins cher que la
              plateforme.
            </p>
            <p className="t-mention">
              Exemple illustratif. Les charges varient selon le bien, la région
              et le mode d’exploitation. Modifiez les valeurs pour voir votre
              situation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
