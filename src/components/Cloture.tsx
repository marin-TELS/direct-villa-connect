import { useState, type FormEvent } from "react";

import { useApparition } from "../hooks/use-apparition";

/** Validation minimale : une adresse http(s) analysable. */
function lienValide(valeur: string): boolean {
  try {
    const url = new URL(valeur.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Validation minimale : un email de forme plausible. */
function emailValide(valeur: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valeur.trim());
}

export function Cloture() {
  const ref = useApparition<HTMLElement>();
  const [lien, setLien] = useState("");
  const [email, setEmail] = useState("");
  const [erreurs, setErreurs] = useState<{ lien?: string; email?: string }>({});
  const [envoye, setEnvoye] = useState(false);

  const soumettre = (evenement: FormEvent<HTMLFormElement>) => {
    evenement.preventDefault();
    const nouvelles: { lien?: string; email?: string } = {};
    if (!lienValide(lien)) {
      nouvelles.lien = "Indiquez un lien commençant par https://";
    }
    if (!emailValide(email)) {
      nouvelles.email = "Indiquez une adresse email valide.";
    }
    setErreurs(nouvelles);
    if (Object.keys(nouvelles).length > 0) return;

    // TODO : brancher l'envoi côté serveur. Pour l'instant, aucune requête
    // réseau n'est effectuée et rien n'est enregistré.
    setEnvoye(true);
  };

  return (
    <section id="contact" ref={ref} className="section-ancree py-16 md:py-28">
      <div className="conteneur">
        <div className="grille-12">
          <h2 className="t-section pos-titre-section" data-apparition>
            Combien vous coûte votre canal actuel ?
          </h2>

          <p className="t-corps-fort pos-chapo mt-6" data-apparition>
            Envoyez-nous le lien de votre annonce. Nous la lisons, nous refaisons
            le calcul de la section 02 avec vos chiffres, et vous recevez le
            résultat sous quarante-huit heures. Sans rendez-vous, sans
            engagement, et sans relance de notre part si vous ne donnez pas
            suite.
          </p>

          <div className="pos-bloc-a mt-12" data-apparition>
            {envoye ? (
              <p className="t-corps-fort message-confirmation" role="status">
                C’est noté. Nous regardons votre annonce et vous envoyons le
                calcul sous quarante-huit heures.
              </p>
            ) : (
              <form className="formulaire" onSubmit={soumettre} noValidate>
                <div className="champ-formulaire">
                  <label htmlFor="champ-lien" className="t-libelle">
                    Le lien de votre annonce
                  </label>
                  <input
                    id="champ-lien"
                    name="lien"
                    type="url"
                    className="champ-texte mt-3"
                    value={lien}
                    onChange={(e) => setLien(e.target.value)}
                    aria-invalid={erreurs.lien ? true : undefined}
                  />
                  {erreurs.lien ? (
                    <p className="t-mention message-erreur mt-2">
                      {erreurs.lien}
                    </p>
                  ) : null}
                </div>

                <div className="champ-formulaire mt-8">
                  <label htmlFor="champ-email" className="t-libelle">
                    Votre email
                  </label>
                  <input
                    id="champ-email"
                    name="email"
                    type="email"
                    className="champ-texte mt-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={erreurs.email ? true : undefined}
                  />
                  {erreurs.email ? (
                    <p className="t-mention message-erreur mt-2">
                      {erreurs.email}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="bouton-principal inline-flex items-center mt-8"
                >
                  Envoyer
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
