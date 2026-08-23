import { useEffect, useRef } from "react";

/**
 * Apparition au défilement : opacité 0 → 1, translation 16px → 0,
 * déclenchée par IntersectionObserver à 20 % de visibilité, une seule fois.
 * Cascade de 60ms entre éléments frères, plafonnée à 240ms.
 */
export function useApparition<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const racine = ref.current;
    if (!racine) return;

    const elements = Array.from(
      racine.querySelectorAll<HTMLElement>("[data-apparition]"),
    );
    if (elements.length === 0) return;

    // Cascade par groupe d'éléments frères : 60ms d'écart, plafond 240ms
    const compteursParParent = new Map<Element, number>();
    for (const element of elements) {
      const parent = element.parentElement ?? racine;
      const index = compteursParParent.get(parent) ?? 0;
      compteursParParent.set(parent, index + 1);
      element.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    }

    const reduireLeMouvement = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduireLeMouvement) {
      for (const element of elements) element.classList.add("est-visible");
      return;
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (!entree.isIntersecting) continue;
          entree.target.classList.add("est-visible");
          observateur.unobserve(entree.target); // jamais rejouée
        }
      },
      { threshold: 0.2 },
    );

    for (const element of elements) observateur.observe(element);
    return () => observateur.disconnect();
  }, []);

  return ref;
}
