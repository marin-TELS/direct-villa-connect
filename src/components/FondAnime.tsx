import { useEffect, useRef, useState } from "react";

/**
 * Fond vivant, entièrement calculé : champ de particules lentes reliées par
 * des traits fins, en laiton très faiblement opaque. Canvas 2D uniquement,
 * aucune image, aucune bibliothèque. Non monté si le mouvement est réduit.
 */
export function FondAnime() {
  const [autorise, setAutorise] = useState(false);

  useEffect(() => {
    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    setAutorise(!requete.matches);
  }, []);

  if (!autorise) return null;
  return <Canevas />;
}

function Canevas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let largeur = 0;
    let hauteur = 0;

    type Point = { x: number; y: number; vx: number; vy: number };
    let points: Point[] = [];

    const dimensionner = () => {
      const densite = Math.min(window.devicePixelRatio || 1, 2);
      largeur = window.innerWidth;
      hauteur = window.innerHeight;
      canvas.width = Math.floor(largeur * densite);
      canvas.height = Math.floor(hauteur * densite);
      canvas.style.width = `${largeur}px`;
      canvas.style.height = `${hauteur}px`;
      ctx.setTransform(densite, 0, 0, densite, 0, 0);

      const nombre = Math.round(
        Math.max(40, Math.min(60, 40 + (largeur - 640) / 40)),
      );
      points = Array.from({ length: nombre }, () => ({
        x: Math.random() * largeur,
        y: Math.random() * hauteur,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
    };

    dimensionner();
    window.addEventListener("resize", dimensionner);

    const opacite = () => {
      const env = document.documentElement.getAttribute("data-env-page");
      return env === "jour" ? 0.07 : 0.1;
    };

    let image = 0;
    let dernier = 0;
    let visible = true;

    const surVisibilite = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", surVisibilite);

    const distanceMax = 150;

    const dessiner = (temps: number) => {
      image = requestAnimationFrame(dessiner);
      if (!visible) return;
      if (temps - dernier < 1000 / 30) return;
      dernier = temps;

      ctx.clearRect(0, 0, largeur, hauteur);
      const base = opacite();

      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x += largeur;
        if (p.x > largeur) p.x -= largeur;
        if (p.y < 0) p.y += hauteur;
        if (p.y > hauteur) p.y -= hauteur;
      }

      for (let i = 0; i < points.length; i++) {
        const a = points[i]!;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > distanceMax) continue;
          ctx.strokeStyle = `rgba(201, 160, 99, ${base * (1 - d / distanceMax)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(201, 160, 99, ${base})`;
      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    image = requestAnimationFrame(dessiner);

    return () => {
      cancelAnimationFrame(image);
      window.removeEventListener("resize", dimensionner);
      document.removeEventListener("visibilitychange", surVisibilite);
    };
  }, []);

  return <canvas ref={ref} className="fond-anime" aria-hidden="true" />;
}
