import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

type Lien = {
  libelle: string;
  vers: "/" | "/reponse" | "/audit";
  ancre?: string;
};

const liensNavigation: Lien[] = [
  { libelle: "Pourquoi", vers: "/", ancre: "pourquoi" },
  { libelle: "Le calcul", vers: "/", ancre: "diagramme" },
  { libelle: "Notre réponse", vers: "/reponse" },
  { libelle: "L’audit", vers: "/audit" },
];

const liensMobile: Lien[] = [
  ...liensNavigation,
  { libelle: "Nous écrire", vers: "/reponse", ancre: "contact" },
];

function cle(lien: Lien) {
  return `${lien.vers}#${lien.ancre ?? ""}`;
}

export function Navigation() {
  const [estScrollee, setEstScrollee] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const auDefilement = () => setEstScrollee(window.scrollY > 40);
    auDefilement();
    window.addEventListener("scroll", auDefilement, { passive: true });
    return () => window.removeEventListener("scroll", auDefilement);
  }, []);

  // Défilement du corps bloqué quand le panneau est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOuvert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOuvert]);

  return (
    <>
      <header className={`nav-principale${estScrollee ? " est-scrollee" : ""}`}>
        <nav
          className="conteneur relative flex h-[60px] items-center justify-between md:h-[72px]"
          aria-label="Navigation principale"
        >
          <Link to="/" hash="haut" className="logotype">
            <span className="logotype-nom">Demeure</span>
            <span className="logotype-separateur">{" — "}</span>
            <span className="logotype-qualif">studio</span>
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex">
            {liensNavigation.map((lien) => (
              <Link
                key={cle(lien)}
                to={lien.vers}
                {...(lien.ancre ? { hash: lien.ancre } : {})}
                className="lien-nav t-libelle"
              >
                {lien.libelle}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <Link
              to="/reponse"
              hash="contact"
              className="bouton-contour hidden items-center lg:inline-flex"
            >
              Nous écrire
            </Link>
            <button
              type="button"
              className="bouton-menu inline-flex flex-col justify-center lg:hidden"
              aria-expanded={menuOuvert}
              aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenuOuvert((ouvert) => !ouvert)}
            >
              <span className="trait-menu" aria-hidden="true" />
              <span className="trait-menu" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {menuOuvert && (
        <div className="panneau-mobile lg:hidden">
          <nav aria-label="Navigation mobile">
            <ul>
              {liensMobile.map((lien, index) => (
                <li key={cle(lien)}>
                  <Link
                    to={lien.vers}
                    {...(lien.ancre ? { hash: lien.ancre } : {})}
                    className="lien-mobile"
                    onClick={() => setMenuOuvert(false)}
                  >
                    <span className="lien-mobile-numero">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="lien-mobile-texte">{lien.libelle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
