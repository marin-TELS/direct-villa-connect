import { useEffect, useState } from "react";

const liensNavigation = [
  { libelle: "Pourquoi", ancre: "#pourquoi" },
  { libelle: "Le calcul", ancre: "#diagramme" },
  { libelle: "Notre réponse", ancre: "#reponse" },
  { libelle: "Méthode", ancre: "#methode" },
  { libelle: "Tarifs", ancre: "#tarifs" },
  { libelle: "Audit", ancre: "#audit" },
  { libelle: "Questions", ancre: "#faq" },
];

const liensMobile = [
  ...liensNavigation,
  { libelle: "Nous écrire", ancre: "#contact" },
];

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
          <a href="#haut" className="logotype">
            <span className="logotype-nom">Demeure</span>
            <span className="logotype-separateur">{" — "}</span>
            <span className="logotype-qualif">studio</span>
          </a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex">
            {liensNavigation.map((lien) => (
              <a key={lien.ancre} href={lien.ancre} className="lien-nav t-libelle">
                {lien.libelle}
              </a>
            ))}
          </div>

          <div className="flex items-center">
            <a
              href="#contact"
              className="bouton-contour hidden items-center lg:inline-flex"
            >
              Nous écrire
            </a>
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
                <li key={lien.ancre}>
                  <a
                    href={lien.ancre}
                    className="lien-mobile"
                    onClick={() => setMenuOuvert(false)}
                  >
                    <span className="lien-mobile-numero">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="lien-mobile-texte">{lien.libelle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
