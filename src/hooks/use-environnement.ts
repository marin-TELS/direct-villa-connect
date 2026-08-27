import { useEffect } from "react";

/**
 * Environnements de couleur : la section dominante à l'écran (seuil 50 %)
 * fixe l'attribut data-env-page sur <html>. Le fond du body et la
 * navigation fixe suivent cette valeur, en transition CSS.
 */
export function useEnvironnement() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-env]"),
    );
    if (sections.length === 0) return;

    const racine = document.documentElement;
    const visibles = new Map<HTMLElement, number>();

    const appliquer = () => {
      let dominante: HTMLElement | null = null;
      let meilleure = 0;
      for (const [element, ratio] of visibles) {
        if (ratio > meilleure) {
          meilleure = ratio;
          dominante = element;
        }
      }
      const env = dominante?.dataset["env"];
      if (env) racine.dataset["envPage"] = env;
    };

    racine.dataset["envPage"] = sections[0]?.dataset["env"] ?? "nuit";

    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          visibles.set(
            entree.target as HTMLElement,
            entree.isIntersecting ? entree.intersectionRect.height : 0,
          );
        }
        appliquer();
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-10% 0px -40% 0px",
      },
    );

    for (const section of sections) observateur.observe(section);
    return () => observateur.disconnect();
  }, []);
}
