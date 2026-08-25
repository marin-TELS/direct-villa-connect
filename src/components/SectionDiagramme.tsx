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
            Rapportez-la à ce qui vous reste vraiment en fin d’année : votre
            résultat d’exploitation.
          </p>
        </div>

        <Calculateur />

        <div className="grille-12 mt-16 md:mt-20">
          <p className="pos-chapo t-mention" data-apparition>
            Résultat d’exploitation s’entend avant charges financières et avant
            impôt. Exemple illustratif : les charges varient selon le bien, la
            région et le mode d’exploitation. Vos chiffres restent dans votre
            navigateur, rien n’est envoyé.
          </p>
        </div>
      </div>
    </section>
  );
}
