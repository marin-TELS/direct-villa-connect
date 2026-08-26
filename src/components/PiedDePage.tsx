import { EMAIL_CONTACT } from "../lib/constantes";

export function PiedDePage() {
  return (
    <footer className="pied-de-page">
      <div className="conteneur">
        <div className="grille-12">
          <div className="pos-bloc-a">
            <p className="logotype-nom">
              Demeure{" — "}studio
            </p>
            <p className="t-mention mt-4">
              Visibilité et gestion des adresses de grande valeur, à l’heure de
              l’IA.
            </p>
          </div>

          <div className="pos-encart pied-liens">
            <a href="#mentions-legales" className="lien-pied">
              Mentions légales
            </a>
            <span className="point-median" aria-hidden="true">
              ·
            </span>
            <a href="#confidentialite" className="lien-pied">
              Confidentialité
            </a>
            {EMAIL_CONTACT ? (
              <>
                <span className="point-median" aria-hidden="true">
                  ·
                </span>
                <a href={`mailto:${EMAIL_CONTACT}`} className="lien-pied">
                  {EMAIL_CONTACT}
                </a>
              </>
            ) : null}
            <p className="t-mention mt-6">© 2026 Demeure</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
