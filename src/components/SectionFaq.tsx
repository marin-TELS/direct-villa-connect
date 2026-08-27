import { useState } from "react";

import { useApparition } from "../hooks/use-apparition";
import { LigneSection } from "./LigneSection";

interface Question {
  question: string;
  reponse: string;
}

const QUESTIONS: Question[] = [
  {
    question: "Dois-je quitter Airbnb ?",
    reponse:
      "Non, et nous ne vous le conseillons pas. Les plateformes vous apportent des voyageurs que vous n’auriez pas trouvés seul. Ce que nous construisons, c’est le canal que vous n’avez pas : celui où le client revient sans intermédiaire, où vous fixez vos conditions, et où la nuit vous est versée entière. Les deux coexistent, et le direct grandit à mesure que votre adresse se fait connaître.",
  },
  {
    question: "Pourquoi mon client paierait-il moins cher en direct ?",
    reponse:
      "Parce que chaque nuit réservée sur une plateforme supporte une commission, de l’ordre de 15 à 20 % selon le canal. En direct, cette commission n’existe pas. Vous choisissez ce que vous en faites : la garder entière, ou en rendre une partie à votre client. Dans ce second cas, il paie moins cher qu’en passant par la plateforme, et vous gagnez pourtant davantage. C’est le seul rabais qui enrichit celui qui l’accorde.",
  },
  {
    question: "Mes locataires reviennent-ils vraiment d’une année sur l’autre ?",
    reponse:
      "Sur une villa familiale, rarement, et il faut être honnête là-dessus. Mais chaque famille passée chez vous en connaît d’autres qui louent au même niveau. Ce que la plateforme vous empêche de constituer n’est pas un fichier de clients fidèles, c’est un réseau de recommandations. Sur les séminaires et les événements d’entreprise, en revanche, le client revient, souvent chaque année et aux mêmes dates.",
  },
  {
    question: "Qui encaisse l’argent ?",
    reponse:
      "Vous, directement sur votre compte. Nous ne touchons jamais aux fonds de vos clients. L’espace de gestion établit l’échéancier à la confirmation, distingue l’acompte du solde, relance ce qui n’est pas payé et vous signale ce qui manque. Mais le virement va de votre client à vous, sans passer par nous.",
  },
  {
    question: "Que se passe-t-il si je décide d’arrêter ?",
    reponse:
      "Le site est le vôtre, le nom de domaine est à votre nom, et vos données vous appartiennent : vous pouvez exporter à tout moment la totalité de vos clients, de vos réservations et de vos devis. L’abonnement est sans engagement de durée. Nous n’avons aucun moyen de vous retenir, et c’est volontaire.",
  },
  {
    question: "En combien de temps aurai-je des réservations en direct ?",
    reponse:
      "Nous ne le promettons pas, et méfiez-vous de qui le promet. Un canal direct se construit : il dépend de votre bien, de vos photos, de votre notoriété et de ce que vous en faites. Ce que nous garantissons, c’est l’outil, sa mise en ligne dans les délais annoncés, et une mesure honnête de ce qui se passe ensuite.",
  },
  {
    question: "Dois-je baisser mes prix pour vendre en direct ?",
    reponse:
      "Non. C’est même l’inverse de l’intérêt de la démarche. À prix égal, la nuit vous rapporte davantage puisqu’elle n’est plus commissionnée. Si vous choisissez de rendre une partie de cet écart à votre client, c’est votre arbitrage, pas le nôtre.",
  },
  {
    question: "Quelles photos dois-je fournir ?",
    reponse:
      "Celles que vous avez, pour commencer. Nous vous envoyons ensuite une liste précise : ce qu’il faut photographier, dans quel ordre, et à quelle heure de la journée. Les images font davantage pour le prix d’une nuit que n’importe quel argument écrit, et il vaut souvent la peine d’y revenir une saison plus tard, à la bonne lumière.",
  },
];

const BALISAGE_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.reponse },
  })),
};

export function SectionFaq() {
  const ref = useApparition<HTMLElement>();
  // Une seule question ouverte à la fois.
  const [ouverte, setOuverte] = useState<number | null>(null);

  return (
    <section id="faq" ref={ref} className="section-ancree py-16 md:py-28">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BALISAGE_FAQ) }}
      />
      <div className="conteneur">
        <div className="grille-12">
          <LigneSection numero="06" libelle="Questions fréquentes" />

          <h2 className="t-section pos-titre-section mt-8" data-apparition>
            Ce qu’on nous demande avant de signer
          </h2>

          <div className="pos-bloc-b accordeon mt-10 md:mt-16" data-apparition>
            {QUESTIONS.map((q, index) => {
              const estOuverte = ouverte === index;
              return (
                <div key={q.question} className="accordeon-entree">
                  <button
                    type="button"
                    className="accordeon-ligne"
                    aria-expanded={estOuverte}
                    aria-controls={`reponse-faq-${index}`}
                    onClick={() => setOuverte(estOuverte ? null : index)}
                  >
                    <span className="accordeon-question">{q.question}</span>
                    <span className="accordeon-signe" aria-hidden="true">
                      {estOuverte ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    id={`reponse-faq-${index}`}
                    className={`accordeon-corps${estOuverte ? " est-ouverte" : ""}`}
                    hidden={!estOuverte}
                  >
                    <p className="t-corps">{q.reponse}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
