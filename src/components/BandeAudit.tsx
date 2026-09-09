import { Link } from "@tanstack/react-router";

import { useApparition } from "../hooks/use-apparition";

export function BandeAudit() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="audit" ref={ref} data-env="signal" className="bande-audit section-ancree">
      <div className="conteneur">
        <div className="grille-12">
          <p className="t-libelle pos-titre-section" data-apparition>
            L’audit de visibilité IA
          </p>

          <h1 className="t-section pos-titre-section mt-6" data-apparition>
            Une autre villa est recommandée à votre place. Vous ne savez pas
            laquelle.
          </h1>


          <div className="pos-bloc-a pile-texte mt-10" data-apparition>
            <p className="t-corps">
              Un client cherche où loger à douze, avec une piscine, fin août. Il
              pose sa question à une IA. Il reçoit trois adresses et il en
              retient une.
            </p>
            <p className="t-corps">
              Rien, dans vos outils actuels, ne vous dit si vous étiez l’une des
              trois. Vos statistiques de fréquentation ne le mesurent pas. Votre
              référencement Google ne vous le dit pas. C’est le seul canal
              d’acquisition sur lequel vous avancez sans aucun instrument.
              L’audit sert à vous en donner un.
            </p>
          </div>

          <div className="pos-audit-gauche pile-texte mt-12" data-apparition>
            <p className="t-corps">
              <strong className="accent-audit">Le verdict.</strong> Nous posons
              les questions que vos clients posent réellement, sur les IA
              qu’ils utilisent. Pour chacune : cité, ou absent.
            </p>
            <p className="t-corps">
              <strong className="accent-audit">Les noms.</strong> Quelles
              adresses apparaissent à votre place. À quelle position par rapport
              à vous. Sur quelles recherches vous passez devant, et sur
              lesquelles vous êtes ignoré. C’est la partie la plus inconfortable
              du document. C’est aussi celle qui sert le plus.
            </p>
          </div>

          <div className="pos-audit-droite pile-texte mt-12" data-apparition>
            <p className="t-corps">
              <strong className="accent-audit">Le plan.</strong> Ce qu’il manque
              à votre présence en ligne pour entrer dans la réponse, classé par
              priorité et par effort. Concret, pas une liste de bonnes
              intentions.
            </p>
            <p className="t-corps">
              <strong className="accent-audit">La correction.</strong> Un audit
              qui se termine par une liste de choses à faire ne sert à rien. Sur
              les sites que nous hébergeons, tout ce qui relève du site est
              corrigé par nos soins dans la foulée, sans supplément. Ce qui vous
              appartient en propre reste dans le plan, avec la marche à suivre :
              votre fiche Google, vos annonces ailleurs, les informations que
              vous seul détenez.
            </p>
          </div>

          <div className="pos-bloc-b mt-12" data-apparition>
            <p className="t-corps">
              Un document daté, que vous comparez d’un audit à l’autre. La
              première fois donne votre point de départ ; les suivantes montrent
              le chemin parcouru. Et si le premier verdict est « absent partout
              », il ne faut pas le prendre comme une mauvaise nouvelle : c’est
              le cas le plus fréquent, et c’est précisément ce qui se corrige.
            </p>
          </div>

          <div className="pos-bloc-b mt-12" data-apparition>
            <p className="montant-audit">450 €</p>
            <p className="t-mention mt-4">
              Deux audits par an sont inclus dans la formule à 290 € par mois.
              Pour un bien que nous n’hébergeons pas, l’audit est livré seul.
            </p>
            <p className="t-corps-fort mt-6">
              Une analyse complète, un document daté, et le site remis à niveau.
            </p>
          </div>

          <div className="pos-bloc-b mt-12" data-apparition>
            <Link
              to="/reponse"
              hash="contact"
              className="bouton-principal inline-flex items-center"
            >
              Parlons de votre maison
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
