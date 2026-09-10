import { useApparition } from "../hooks/use-apparition";
import { BandeauSignal } from "./BandeauSignal";
import { LigneSection } from "./LigneSection";

export function SectionPourquoi() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="pourquoi" ref={ref} data-env="nuit" className="section-ancree py-16 md:py-28">
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection numero="01" libelle="Pourquoi" />

          <h2 className="t-section pos-titre-section mt-8" data-apparition>
            Vous ne fixez pas les règles
          </h2>

          <div
            className="pos-bloc-a pile-texte mt-10 md:mt-16"
            data-apparition
          >
            <p className="t-corps">
              Vous fixez le prix de vos nuits, la décoration de vos chambres, le
              choix de vos prestataires. Vous ne fixez ni le taux de commission,
              ni les conditions d’annulation, ni le délai de versement, ni la
              façon dont votre bien est présenté.
            </p>
            <p className="t-corps">
              Ces règles peuvent changer sans que vous soyez consulté. Elles ont
              déjà changé, et elles changent encore cette année. Ce n’est pas un
              procès des plateformes : elles vous apportent des voyageurs, et
              elles font payer ce service. C’est un constat : un canal dont vous
              n’écrivez pas les règles peut se refermer, ou se renchérir, sans
              vous demander votre avis.
            </p>
          </div>

          <div className="pos-face-droite" data-apparition>
            <BandeauSignal />
          </div>


          <div className="pos-bloc-b pile-texte mt-10 md:mt-16" data-apparition>
            <h3 className="t-bloc">
              Vous les accueillez, puis la porte se referme
            </h3>
            <p className="t-corps">
              Une famille passe dix jours chez vous. Vous l’accueillez, vous lui
              montrez la maison, vous lui indiquez le bon restaurant du port.
              Vous connaissez son prénom et son visage.
            </p>
            <p className="t-corps citation">
              Elle repart, et les règles reprennent la main. Les conditions
              d’utilisation d’Airbnb interdisent à un hôte d’encourager un
              voyageur à « fournir ses coordonnées ou à entreprendre d’autres
              actions en dehors de la plateforme », et d’utiliser ses
              informations personnelles pour lui adresser un message commercial
              sans son consentement explicite. La politique hors plateforme,
              entrée en vigueur en mai 2025, interdit en outre de demander ou
              d’utiliser des coordonnées à des fins étrangères au séjour.
            </p>
            <p className="t-corps">
              En cas de manquement répété ou grave, la politique d’Airbnb le
              prévoit noir sur blanc : suspension ou désactivation définitive de
              l’annonce, voire du compte. Le canal qui fait vivre votre maison
              peut se refermer du jour au lendemain.
            </p>

            <p className="t-corps">
              Des années d’accueil, et aucun fichier client. Non par négligence :
              le constituer vous est interdit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
