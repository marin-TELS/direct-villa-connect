import { useApparition } from "../hooks/use-apparition";
import { LigneSection } from "./LigneSection";

export function SectionTarifs() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="tarifs" ref={ref} className="section-ancree py-24 md:py-40">
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection numero="05" libelle="Tarifs" />

          <h2 className="t-section pos-titre-section mt-8" data-apparition>
            Ce que cela coûte
          </h2>
        </div>

        <div className="rangee-tarifs mt-12 md:mt-16">
          <div className="bloc-tarif bloc-tarif-large" data-apparition>
            <p className="t-libelle">Installation</p>
            <p className="montant-tarif mt-4">3 500 €</p>
            <p className="t-corps mt-6">
              Site sur mesure, espace de gestion, calendrier, moteur de devis,
              emails automatiques, préparation à la recherche par IA. Paiement
              en deux fois.
            </p>
          </div>

          <div className="bloc-tarif" data-apparition>
            <p className="t-libelle">Présence</p>
            <p className="montant-tarif mt-4">
              180 € <span className="montant-suffixe">par mois</span>
            </p>
            <p className="t-mention mt-6">
              Hébergement, espace de gestion, sauvegardes, mises à jour,
              corrections et assistance. Sans engagement de durée.
            </p>
          </div>

          <div className="bloc-tarif" data-apparition>
            <p className="t-libelle">Présence et visibilité</p>
            <p className="montant-tarif mt-4">
              290 € <span className="montant-suffixe">par mois</span>
            </p>
            <p className="t-mention mt-6">
              Tout ce qui précède, et deux audits de visibilité IA par an,
              corrections comprises.
            </p>
          </div>
        </div>

        <div className="grille-12 mt-16 md:mt-20">
          <div className="pos-comparaison" data-apparition>
            <div className="comparaison">
              <div className="colonne-comparaison">
                <p className="t-libelle">Votre première année, tout compris</p>
                <p className="montant-comparaison mt-4">5 660 €</p>
                <p className="t-mention mt-3">
                  (installation 3 500 € et douze mois de Présence)
                </p>
              </div>
              <div className="colonne-comparaison">
                <p className="t-libelle">
                  La commission d’une seule année, sur l’exemple précédent
                </p>
                <p className="montant-comparaison montant-alerte mt-4">
                  18 445 €
                </p>
              </div>
            </div>
            <p className="t-corps mt-10">
              Ce que vous payez ici est acquis une fois. Ce que vous versez à
              une plateforme recommence chaque année, et augmente avec vos
              tarifs.
            </p>
            <p className="t-corps-fort mt-8">
              Aucune commission sur vos réservations. Jamais.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
