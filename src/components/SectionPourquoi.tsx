import { useApparition } from "../hooks/use-apparition";
import { LigneSection } from "./LigneSection";

export function SectionPourquoi() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="pourquoi" ref={ref} className="section-ancree py-24 md:py-40">
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection numero="01" libelle="Pourquoi" />

          <h2 className="t-section pos-titre-section mt-8" data-apparition>
            Vous ne fixez pas les règles
          </h2>

          <div
            className="pos-bloc-a pile-texte mt-12 md:mt-16"
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
              déjà changé. Un canal que vous ne contrôlez pas est un canal qui
              peut se refermer.
            </p>
          </div>

          <div className="pos-bloc-b pile-texte mt-30" data-apparition>
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
              En cas de manquement : visibilité réduite, annonce retirée, compte
              fermé.
            </p>
            <p className="t-corps">
              Dix ans d’accueil, et aucun fichier client. Non par négligence —
              parce que le constituer vous est interdit.
            </p>
          </div>

          <aside
            className="pos-encart encart bloc-survol mt-8"
            data-apparition
          >
            <p className="t-libelle">La nuance</p>
            <p className="t-mention mt-4">
              Sur une villa familiale, un locataire revient rarement. Mais il en
              connaît d’autres qui louent au même niveau. Ce que vous perdez
              n’est pas un client qui revient, c’est le réseau qu’il représente.
              Sur un séminaire d’entreprise, en revanche, c’est bien le client
              qui revient — chaque année.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
