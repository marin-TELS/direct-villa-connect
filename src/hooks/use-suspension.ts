import { useEffect, useRef } from "react";

/**
 * Suspension réactive : les blocs d'une rangée dérivent doucement vers la
 * souris, chacun avec sa propre inertie, et reviennent à leur place quand
 * le pointeur quitte la zone. Aucune animation en prefers-reduced-motion.
 */
export function useSuspension<T extends HTMLElement>() {
  const conteneur = useRef<T>(null);

  useEffect(() => {
    const hote = conteneur.current;
    if (!hote) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const blocs = Array.from(
      hote.querySelectorAll<HTMLElement>("[data-suspendu]"),
    );
    if (blocs.length === 0) return;

    // Chaque bloc a sa masse : les grands suivent moins que les petits.
    const etats = blocs.map((element, i) => ({
      element,
      poids: 0.5 + ((i * 37) % 100) / 160,
      x: 0,
      y: 0,
      r: 0,
      cx: 0,
      cy: 0,
      cr: 0,
    }));

    let dedans = false;
    let pointeur = { x: 0, y: 0 };
    let idAnim = 0;

    const surSouris = (e: MouseEvent) => {
      dedans = true;
      pointeur = { x: e.clientX, y: e.clientY };
    };
    const surSortie = () => {
      dedans = false;
    };

    hote.addEventListener("mousemove", surSouris, { passive: true });
    hote.addEventListener("mouseleave", surSortie, { passive: true });

    const boucle = () => {
      idAnim = requestAnimationFrame(boucle);
      for (const etat of etats) {
        if (dedans) {
          const b = etat.element.getBoundingClientRect();
          const dx = pointeur.x - (b.left + b.width / 2);
          const dy = pointeur.y - (b.top + b.height / 2);
          const distance = Math.hypot(dx, dy);
          // Au delà de 520 px, le bloc ne bouge plus.
          const force = Math.max(0, 1 - distance / 520);
          etat.cx = dx * 0.06 * force * etat.poids;
          etat.cy = dy * 0.06 * force * etat.poids;
          etat.cr = (dx / 520) * 2.4 * force;
        } else {
          etat.cx = 0;
          etat.cy = 0;
          etat.cr = 0;
        }
        etat.x += (etat.cx - etat.x) * 0.07;
        etat.y += (etat.cy - etat.y) * 0.07;
        etat.r += (etat.cr - etat.r) * 0.07;
        etat.element.style.setProperty("--decal-x", `${etat.x.toFixed(2)}px`);
        etat.element.style.setProperty("--decal-y", `${etat.y.toFixed(2)}px`);
        etat.element.style.setProperty("--pivot", `${etat.r.toFixed(2)}deg`);
      }
    };
    idAnim = requestAnimationFrame(boucle);

    return () => {
      cancelAnimationFrame(idAnim);
      hote.removeEventListener("mousemove", surSouris);
      hote.removeEventListener("mouseleave", surSortie);
    };
  }, []);

  return conteneur;
}
