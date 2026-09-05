import { useState, type FormEvent } from "react";

interface Courriel {
  cle: string;
  bouton: string;
  objet: string;
  corps: string;
  action: string;
}

const COURRIELS: Courriel[] = [
  {
    cle: "confirmation",
    bouton: "L’email que reçoit votre client",
    objet: "Votre séjour au Mas des Oliviers est confirmé",
    corps:
      "Bonjour, nous avons le plaisir de vous confirmer votre séjour du 12 au 19 juillet, pour huit personnes. Votre acompte de 2 940 € a bien été reçu. Le solde de 6 860 € est à régler avant le 12 juin. Nous vous écrirons quelques jours avant votre arrivée pour convenir de l’heure et vous transmettre les informations pratiques. À très bientôt.",
    action: "Voir mon séjour",
  },
  {
    cle: "relance",
    bouton: "La relance d’acompte",
    objet: "Votre solde arrive à échéance",
    corps:
      "Bonjour, le solde de votre séjour du 12 au 19 juillet, soit 6 860 €, arrive à échéance le 12 juin. Vous pouvez le régler directement depuis votre espace. Si vous avez la moindre question, répondez simplement à ce message.",
    action: "Régler mon solde",
  },
  {
    cle: "proprietaire",
    bouton: "Ce que vous recevez, vous",
    objet: "Nouvelle demande pour le Mas des Oliviers",
    corps:
      "Une nouvelle demande vient d’arriver : Mariage Rouvière, du 30 mai au 1er juin, douze personnes, 7 400 €. Le devis est prêt à être envoyé depuis votre espace.",
    action: "Ouvrir la demande",
  },
];

function ChampReception() {
  const [ouvert, setOuvert] = useState(false);
  const [email, setEmail] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [confirme, setConfirme] = useState(false);

  // TODO backend : l'envoi réel de cet email et l'enregistrement de
  // l'adresse seront branchés après autorisation. Aucune requête réseau ici.
  const envoyer = (evenement: FormEvent) => {
    evenement.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setErreur("Merci d’indiquer une adresse email valide.");
      return;
    }
    setErreur(null);
    setConfirme(true);
  };

  if (confirme) {
    return <p className="demo-confirmation">C’est noté. Cet email vous est envoyé.</p>;
  }

  if (!ouvert) {
    return (
      <button
        type="button"
        className="demo-bouton-contour"
        onClick={() => setOuvert(true)}
      >
        Recevoir cet email
      </button>
    );
  }

  return (
    <form className="demo-reception" onSubmit={envoyer} noValidate>
      <div className="demo-reception-ligne">
        <label className="demo-libelle" htmlFor="demo-email-reception">
          Votre email
        </label>
        <input
          id="demo-email-reception"
          type="email"
          className="demo-champ"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="demo-bouton-principal">
          Envoyer
        </button>
      </div>
      {erreur ? <p className="demo-erreur">{erreur}</p> : null}
      <p className="demo-mention">
        Votre adresse sert uniquement à vous envoyer cet exemple.
      </p>
    </form>
  );
}

export function ApercusEmail() {
  const [actif, setActif] = useState<string | null>(null);
  const courriel = COURRIELS.find((c) => c.cle === actif) ?? null;

  return (
    <div className="demo-emails">
      <div className="demo-rangee-boutons">
        {COURRIELS.map((c) => (
          <button
            key={c.cle}
            type="button"
            className={`demo-bouton-contour${actif === c.cle ? " est-actif" : ""}`}
            aria-pressed={actif === c.cle}
            onClick={() => setActif(actif === c.cle ? null : c.cle)}
          >
            {c.bouton}
          </button>
        ))}
      </div>

      {courriel ? (
        <div className="demo-apercu">
          <div className="demo-apercu-cadre">
            <p className="demo-apercu-objet">{courriel.objet}</p>
            <p className="demo-apercu-corps">{courriel.corps}</p>
            <span className="demo-apercu-bouton">{courriel.action}</span>
          </div>
          <div className="demo-apercu-pied">
            <ChampReception key={courriel.cle} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
