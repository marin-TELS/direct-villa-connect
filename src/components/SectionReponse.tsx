import { useApparition } from "../hooks/use-apparition";
import { LigneSection } from "./LigneSection";
import { Link } from "@tanstack/react-router";

const DEDANS = [
  {
    numero: "01",
    texte:
      "Les demandes. Devis figé, options choisies, statut de chaque prestation, discussion avec le client au même endroit.",
  },
  {
    numero: "02",
    texte:
      "L’argent. Échéancier automatique à la confirmation, acompte et solde, alerte sur ce qui n’est pas encaissé, marge réelle par option.",
  },
  {
    numero: "03",
    texte:
      "Le calendrier. Un blocage, et la date disparaît du site dans la seconde.",
  },
  {
    numero: "04",
    texte:
      "La visibilité. D’où viennent vos visiteurs, combien deviennent des demandes, et si les IA vous citent.",
  },
];

export function SectionReponse() {
  const ref = useApparition<HTMLElement>();

  return (
    <section id="reponse" ref={ref} data-env="jour" className="section-ancree py-16 md:py-28">
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection numero="03" libelle="Notre réponse" />

          <h2 className="t-section pos-titre-section mt-8" data-apparition>
            Un site qui capte vos clients, un système qui les gère
          </h2>

          <div className="pos-bloc-a pile-texte mt-10 md:mt-16" data-apparition>
            <h3 className="t-bloc">Un site qui travaille</h3>
            <p className="t-corps">
              La plupart des sites de villa sont des brochures : de belles
              photos, un formulaire de contact, et une réponse qui arrive trois
              jours plus tard. Entre-temps, le client a réservé ailleurs.
            </p>
            <p className="t-corps">
              Le vôtre est construit pour transformer une visite en demande. Le
              visiteur voit vos disponibilités réelles, choisit ses dates,
              ajoute les prestations qu’il souhaite, obtient son prix et vous
              envoie sa demande, sans jamais quitter la page.
            </p>
            <p className="t-corps">
              Le dessin du site part de vos photos et de l’architecture de la
              maison. Aucune mise en page recyclée d’une maison à l’autre : ce
              qui fait le caractère de la vôtre doit se voir dès le premier
              écran.
            </p>
            <ApercuReservation />
          </div>

          <div className="pos-bloc-b pile-texte mt-10 md:mt-16" data-apparition>
            <h3 className="t-bloc">Être cité quand on demande où loger</h3>
            <p className="t-corps">
              Une part croissante de vos futurs clients ne tape plus « villa
              avec piscine » dans Google. Ils posent la question à ChatGPT, à
              Gemini ou à Perplexity, et ils reçoivent trois adresses au lieu de
              trente liens.
            </p>
            <p className="t-corps">
              Ces trois places se préparent : des données structurées, un
              contenu que la machine peut lire et citer sans se tromper, des
              informations cohérentes partout où votre bien apparaît, de votre
              fiche Google à vos annonces. C’est un travail de précision, pas de
              volume.
            </p>

            <p className="t-corps">
              Chaque site que nous livrons est construit pour être lu, compris
              et cité par les IA. Et nous mesurons, audit après audit, ce
              qu’elles répondent réellement quand on leur demande où loger dans
              votre région.
            </p>
          </div>

          <div className="pos-bloc-a pile-texte mt-10 md:mt-16" data-apparition>
            <h3 className="t-bloc">Le système d’exploitation</h3>
            <p className="t-corps">
              Un canal direct sans outil de gestion n’est pas un gain, c’est du
              travail en plus. Ce que nous livrons avec le site, c’est la
              machine qui le fait tourner : les demandes, l’argent, le
              calendrier et la visibilité, au même endroit.
            </p>
            <p className="t-corps">
              Voici cet espace tel qu’un propriétaire le voit. Ce ne sont pas
              des captures d’écran : tout fonctionne, vous pouvez cliquer
              partout.
            </p>
            <CadreNavigateur adresse="votre-maison.fr/espace">
              <MiniatureTableauBord />
            </CadreNavigateur>
            <div>
              <Link
                to="/demo"
                className="bouton-principal inline-flex items-center"
              >
                Ouvrir la démonstration
              </Link>
              <p className="t-mention mt-4">Données de démonstration.</p>
            </div>
          </div>

          <div className="pos-notes mt-10 md:mt-16" data-apparition>
            <p className="t-libelle">Ce qu’il y a dedans</p>
            <ul className="liste-numerotee mt-6">
              {DEDANS.map((element) => (
                <li key={element.numero} className="ligne-numerotee">
                  <span className="numero-ligne">{element.numero}</span>
                  <span className="t-mention">{element.texte}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
