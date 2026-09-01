import { useState, type FormEvent } from "react";

import { useApparition } from "../hooks/use-apparition";
import { supabase } from "../integrations/supabase/client";

/** Validation minimale : un email de forme plausible. */
function emailValide(valeur: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur.trim());
}

/** Validation minimale : un numéro plausible (au moins huit chiffres). */
function telephoneValide(valeur: string): boolean {
  return (valeur.match(/\d/g) ?? []).length >= 8;
}

const CRENEAUX = [
  "En matinée",
  "Entre midi et deux",
  "L’après-midi",
  "En soirée",
];

function CaseConsentement({
  id,
  coche,
  onChange,
}: {
  id: string;
  coche: boolean;
  onChange: (valeur: boolean) => void;
}) {
  return (
    <div className="case-ligne mt-8">
      <input
        id={id}
        type="checkbox"
        checked={coche}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} className="t-mention">
        J’accepte que Demeure utilise ces informations pour me recontacter au
        sujet de ma demande. Rien d’autre : pas de lettre d’information, pas de
        partage.{" "}
        <a href="/confidentialite" className="lien-confidentialite">
          Confidentialité
        </a>
      </label>
    </div>
  );
}

function FormulaireRappel() {
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [creneaux, setCreneaux] = useState<string[]>([]);
  const [precision, setPrecision] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  const basculer = (creneau: string) =>
    setCreneaux((actuels) =>
      actuels.includes(creneau)
        ? actuels.filter((c) => c !== creneau)
        : [...actuels, creneau],
    );

  const soumettre = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (!prenom.trim()) {
      setErreur("Indiquez votre prénom.");
      return;
    }
    if (!telephoneValide(telephone)) {
      setErreur("Indiquez un numéro de téléphone valide.");
      return;
    }
    if (!emailValide(email)) {
      setErreur("Indiquez une adresse email valide.");
      return;
    }
    if (creneaux.length === 0) {
      setErreur("Choisissez au moins un créneau.");
      return;
    }
    if (!consentement) {
      setErreur("Cochez la case pour que nous puissions vous recontacter.");
      return;
    }
    setErreur(null);
    setEnvoi(true);
    const { error } = await supabase.from("demandes_contact").insert({
      type: "rappel",
      prenom: prenom.trim(),
      telephone: telephone.trim(),
      email: email.trim(),
      disponibilites: creneaux.join(" · "),
      message: precision.trim() || null,
      consentement: true,
    });
    setEnvoi(false);
    if (error) {
      setErreur("L’envoi n’a pas abouti. Réessayez dans un instant.");
      return;
    }
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <p className="t-corps-fort message-confirmation" role="status">
        C’est noté. Nous vous confirmons le créneau par email, puis nous vous
        appelons.
      </p>
    );
  }

  return (
    <form className="formulaire mt-8" onSubmit={soumettre} noValidate>
      <div className="champ-formulaire">
        <label htmlFor="rappel-prenom" className="t-libelle">
          Votre prénom
        </label>
        <input
          id="rappel-prenom"
          type="text"
          className="champ-texte mt-3"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
      </div>

      <div className="champ-formulaire mt-8">
        <label htmlFor="rappel-telephone" className="t-libelle">
          Votre téléphone
        </label>
        <input
          id="rappel-telephone"
          type="tel"
          className="champ-texte mt-3"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />
      </div>

      <div className="champ-formulaire mt-8">
        <label htmlFor="rappel-email" className="t-libelle">
          Votre email
        </label>
        <input
          id="rappel-email"
          type="email"
          className="champ-texte mt-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <fieldset className="champ-formulaire mt-8">
        <legend className="t-libelle">Quand pouvons-nous vous appeler ?</legend>
        <div className="groupe-creneaux mt-4">
          {CRENEAUX.map((creneau) => (
            <div key={creneau} className="case-ligne">
              <input
                id={`creneau-${creneau}`}
                type="checkbox"
                checked={creneaux.includes(creneau)}
                onChange={() => basculer(creneau)}
              />
              <label htmlFor={`creneau-${creneau}`} className="t-mention">
                {creneau}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="champ-formulaire mt-8">
        <label htmlFor="rappel-precision" className="t-libelle">
          Une précision ?
        </label>
        <textarea
          id="rappel-precision"
          className="champ-zone mt-3"
          value={precision}
          onChange={(e) => setPrecision(e.target.value)}
        />
      </div>

      <CaseConsentement
        id="rappel-consentement"
        coche={consentement}
        onChange={setConsentement}
      />

      {erreur ? <p className="t-mention message-erreur mt-4">{erreur}</p> : null}

      <button
        type="submit"
        className="bouton-principal inline-flex items-center mt-8"
        disabled={envoi}
      >
        Réserver mon rappel
      </button>
    </form>
  );
}

function FormulaireQuestion() {
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [consentement, setConsentement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  const soumettre = async (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    if (!emailValide(email)) {
      setErreur("Indiquez une adresse email valide.");
      return;
    }
    if (!question.trim()) {
      setErreur("Écrivez votre question.");
      return;
    }
    if (!consentement) {
      setErreur("Cochez la case pour que nous puissions vous recontacter.");
      return;
    }
    setErreur(null);
    setEnvoi(true);
    const { error } = await supabase.from("demandes_contact").insert({
      type: "question",
      email: email.trim(),
      message: question.trim(),
      consentement: true,
    });
    setEnvoi(false);
    if (error) {
      setErreur("L’envoi n’a pas abouti. Réessayez dans un instant.");
      return;
    }
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <p className="t-corps-fort message-confirmation" role="status">
        C’est noté. Vous recevez une réponse sous quarante-huit heures.
      </p>
    );
  }

  return (
    <form className="formulaire mt-8" onSubmit={soumettre} noValidate>
      <div className="champ-formulaire">
        <label htmlFor="question-email" className="t-libelle">
          Votre email
        </label>
        <input
          id="question-email"
          type="email"
          className="champ-texte mt-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="champ-formulaire mt-8">
        <label htmlFor="question-texte" className="t-libelle">
          Votre question
        </label>
        <textarea
          id="question-texte"
          className="champ-zone mt-3"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <CaseConsentement
        id="question-consentement"
        coche={consentement}
        onChange={setConsentement}
      />

      {erreur ? <p className="t-mention message-erreur mt-4">{erreur}</p> : null}

      <button
        type="submit"
        className="bouton-principal inline-flex items-center mt-8"
        disabled={envoi}
      >
        Envoyer ma question
      </button>
    </form>
  );
}

export function Cloture() {
  const ref = useApparition<HTMLElement>();

  return (
    <section
      id="contact"
      ref={ref}
      data-env="jour"
      className="section-ancree py-16 md:py-28"
    >
      <div className="conteneur">
        <div className="grille-12">
          <h2 className="t-section pos-titre-section" data-apparition>
            Parlons de votre maison
          </h2>

          <p className="t-corps-fort pos-chapo mt-6" data-apparition>
            Vous venez de voir ce que votre canal actuel vous coûte. Dites-nous
            quand vous joindre : vous parlerez directement à la personne qui
            construira votre site.
          </p>
        </div>

        <div className="rangee-clotures mt-10 md:mt-16">
          <div className="bloc-cloture" data-apparition>
            <h3 className="titre-cloture">
              Me faire rappeler à mes disponibilités
            </h3>
            <FormulaireRappel />
          </div>

          <div className="bloc-cloture" data-apparition>
            <h3 className="titre-cloture">J’ai encore quelques questions</h3>
            <FormulaireQuestion />
          </div>
        </div>
      </div>
    </section>
  );
}
