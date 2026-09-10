import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Fond en trois dimensions, une image par page, entièrement procédural.
 * Le récit se lit tout seul : la serrure sur l'accueil, la clé sur la page
 * de la réponse, le relief et son itinéraire sur l'audit. Le dessin avance
 * au défilement, il n'est jamais figé.
 * Une seule couleur par page, jamais de mélange :
 * accueil craie sur encre, réponse encre sur papier, audit turquoise sur encre.
 * Non monté sous 768 px ni en prefers-reduced-motion.
 */

type Scene = "serrure" | "cle" | "relief";

const CRAIE = 0xf4f2ed;
const ENCRE = 0x141416;
const TURQUOISE = 0x3de0c0;

const COULEURS: Record<Scene, number> = {
  serrure: CRAIE,
  cle: ENCRE,
  relief: TURQUOISE,
};

// Le dessin doit se lire sans effort : on est loin du filigrane.
const OPACITES: Record<Scene, number> = {
  serrure: 0.3,
  cle: 0.19,
  relief: 0.22,
};

function sceneDeLaRoute(chemin: string): Scene {
  if (chemin.startsWith("/audit")) return "relief";
  if (chemin.startsWith("/reponse")) return "cle";
  return "serrure";
}

export function SceneFond() {
  const conteneur = useRef<HTMLDivElement>(null);
  const chemin = useRouterState({ select: (e) => e.location.pathname });
  const sceneVoulue = useRef<Scene>(sceneDeLaRoute(chemin));
  sceneVoulue.current = sceneDeLaRoute(chemin);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let vivant = true;
    let nettoyer: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (!vivant || !conteneur.current) return;

      const hote = conteneur.current;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(hote.clientWidth, hote.clientHeight);
      hote.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(
        42,
        hote.clientWidth / hote.clientHeight,
        0.1,
        200,
      );
      camera.position.set(0, 0, 26);

      const racine = new THREE.Scene();
      const groupes: Record<Scene, import("three").Group> = {
        serrure: construireSerrure(THREE),
        cle: construireCle(THREE),
        relief: construireRelief(THREE),
      };
      for (const g of Object.values(groupes)) {
        g.visible = false;
        racine.add(g);
      }

      let courante: Scene = sceneVoulue.current;
      groupes[courante].visible = true;
      let fondu = 1;

      // Avancement du défilement, amorti pour éviter les à-coups
      let defilementBrut = 0;
      let defilement = 0;
      const mesurer = () => {
        const course =
          document.documentElement.scrollHeight - window.innerHeight;
        defilementBrut = course > 0 ? Math.min(1, window.scrollY / course) : 0;
      };
      mesurer();
      window.addEventListener("scroll", mesurer, { passive: true });

      // Suivi amorti de la souris : deux degrés au maximum
      const souris = { x: 0, y: 0 };
      const cible = { x: 0, y: 0 };
      const surSouris = (e: MouseEvent) => {
        cible.x = (e.clientX / window.innerWidth - 0.5) * 2;
        cible.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", surSouris, { passive: true });

      const surRedimensionnement = () => {
        if (!hote) return;
        renderer.setSize(hote.clientWidth, hote.clientHeight);
        camera.aspect = hote.clientWidth / hote.clientHeight;
        camera.updateProjectionMatrix();
        mesurer();
      };
      window.addEventListener("resize", surRedimensionnement, { passive: true });

      const INTERVALLE = 1000 / 30; // trente images par seconde au maximum
      let dernier = 0;
      let idAnim = 0;

      const boucle = (t: number) => {
        idAnim = requestAnimationFrame(boucle);
        if (document.hidden) return;
        if (t - dernier < INTERVALLE) return;
        dernier = t;
        const temps = t / 1000;

        defilement += (defilementBrut - defilement) * 0.08;

        // Changement de scène en fondu
        if (sceneVoulue.current !== courante) {
          fondu -= 0.055;
          if (fondu <= 0) {
            groupes[courante].visible = false;
            courante = sceneVoulue.current;
            groupes[courante].visible = true;
            mesurer();
            fondu = 0;
          }
        } else if (fondu < 1) {
          fondu = Math.min(1, fondu + 0.055);
        }

        souris.x += (cible.x - souris.x) * 0.04;
        souris.y += (cible.y - souris.y) * 0.04;
        const incl = (2 * Math.PI) / 180;
        racine.rotation.y = souris.x * incl;
        racine.rotation.x = souris.y * incl;

        animerGroupe(courante, groupes[courante], temps, defilement);
        appliquerOpacite(groupes[courante], OPACITES[courante] * fondu);

        renderer.render(racine, camera);
      };
      idAnim = requestAnimationFrame(boucle);

      nettoyer = () => {
        cancelAnimationFrame(idAnim);
        window.removeEventListener("mousemove", surSouris);
        window.removeEventListener("scroll", mesurer);
        window.removeEventListener("resize", surRedimensionnement);
        renderer.dispose();
        if (renderer.domElement.parentNode === hote)
          hote.removeChild(renderer.domElement);
      };
    })();

    return () => {
      vivant = false;
      nettoyer?.();
    };
  }, []);

  return <div ref={conteneur} className="scene-fond" aria-hidden="true" />;
}

/* -------------------------------------------------------------- */

function materiau(THREE: typeof import("three"), couleur: number) {
  return new THREE.LineBasicMaterial({
    color: couleur,
    transparent: true,
    opacity: 0.2,
  });
}

function appliquerOpacite(groupe: import("three").Group, valeur: number) {
  groupe.traverse((o) => {
    const m = (o as { material?: { opacity: number } }).material;
    if (m && typeof m.opacity === "number") m.opacity = valeur;
  });
}

/**
 * La serrure : un objet net, franc, reconnaissable au premier regard.
 * Disque et corps extrudés, arêtes seules, sans rien autour.
 */
function construireSerrure(THREE: typeof import("three")) {
  const g = new THREE.Group();

  const disque = new THREE.Shape();
  disque.absarc(0, 3.2, 2.9, 0, Math.PI * 2, false);

  const corps = new THREE.Shape();
  corps.moveTo(-1.5, 3.4);
  corps.lineTo(-2.7, -5.8);
  corps.lineTo(2.7, -5.8);
  corps.lineTo(1.5, 3.4);
  corps.closePath();

  for (const f of [disque, corps]) {
    const geo = new THREE.ExtrudeGeometry(f, {
      depth: 2.2,
      bevelEnabled: false,
      curveSegments: 56,
    });
    const aretes = new THREE.EdgesGeometry(geo, 12);
    g.add(new THREE.LineSegments(aretes, materiau(THREE, COULEURS.serrure)));
    geo.dispose();
  }

  g.position.set(10, 0, -3);
  g.scale.setScalar(1.35);
  return g;
}

/**
 * La clé : anneau ajouré, tige, deux dents. Un objet net, qui pivote
 * d'un quart de tour au fil de la lecture, comme dans une serrure.
 */
function construireCle(THREE: typeof import("three")) {
  const g = new THREE.Group();
  const couleur = COULEURS.cle;

  const extruder = (forme: import("three").Shape) => {
    const geo = new THREE.ExtrudeGeometry(forme, {
      depth: 0.9,
      bevelEnabled: false,
      curveSegments: 56,
    });
    g.add(
      new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, 12),
        materiau(THREE, couleur),
      ),
    );
    geo.dispose();
  };

  // L'anneau, percé en son centre
  const anneau = new THREE.Shape();
  anneau.absarc(-9.4, 0, 3.6, 0, Math.PI * 2, false);
  const trou = new THREE.Path();
  trou.absarc(-9.4, 0, 1.8, 0, Math.PI * 2, true);
  anneau.holes.push(trou);
  extruder(anneau);

  // La tige
  const tige = new THREE.Shape();
  tige.moveTo(-6.4, 0.8);
  tige.lineTo(6.2, 0.8);
  tige.lineTo(6.2, -0.8);
  tige.lineTo(-6.4, -0.8);
  tige.closePath();
  extruder(tige);

  // Les deux dents
  for (const [x1, x2, bas] of [
    [2.4, 3.5, -3.1],
    [4.6, 5.7, -2.4],
  ] as const) {
    const dent = new THREE.Shape();
    dent.moveTo(x1, -0.7);
    dent.lineTo(x2, -0.7);
    dent.lineTo(x2, bas);
    dent.lineTo(x1, bas);
    dent.closePath();
    extruder(dent);
  }

  g.position.set(15, 3, -8);
  g.scale.setScalar(0.85);
  return g;
}

/** Le relief et l'itinéraire : maille large, tracé qui avance au défilement. */
function construireRelief(THREE: typeof import("three")) {
  const g = new THREE.Group();
  const N = 26; // maille large : un terrain, pas un tissu
  const TAILLE = 62;
  const geo = new THREE.PlaneGeometry(TAILLE, TAILLE, N, N);
  const maillage = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    materiau(THREE, COULEURS.relief),
  );
  g.add(maillage);

  const pts: import("three").Vector3[] = [];
  for (let i = 0; i <= 220; i++) {
    const u = i / 220;
    const x = (u - 0.5) * TAILLE * 0.92;
    const y = Math.sin(u * Math.PI * 1.6) * 13 - 4;
    pts.push(new THREE.Vector3(x, y, 7));
  }
  const courbe = new THREE.CatmullRomCurve3(pts);
  const geoTrace = new THREE.BufferGeometry().setFromPoints(
    courbe.getPoints(400),
  );
  geoTrace.setDrawRange(0, 0);
  g.add(new THREE.Line(geoTrace, materiau(THREE, COULEURS.relief)));

  g.rotation.x = -1.02;
  g.position.set(6, 4, -14);
  return g;
}

function animerGroupe(
  nom: Scene,
  groupe: import("three").Group,
  temps: number,
  defilement: number,
) {
  if (nom === "serrure") {
    // Un pivot mesuré : la serrure reste une serrure du haut en bas de la page.
    groupe.rotation.y = -0.22 + defilement * 0.44 + Math.sin(temps * 0.12) * 0.05;
    groupe.position.y = 3 - defilement * 16;
    groupe.position.z = -3 - defilement * 9;
    return;
  }

  if (nom === "cle") {
    // La clé fait son quart de tour dans la serrure, puis descend avec la page.
    groupe.rotation.x = -0.3 + defilement * Math.PI * 0.62;
    groupe.rotation.z = -0.3 + Math.sin(temps * 0.1) * 0.03;
    groupe.position.y = 5 - defilement * 20;
    groupe.position.x = 15 - defilement * 4;
    return;
  }

  // Relief : ondulation lente du terrain, itinéraire tracé au défilement
  const maillage = groupe.children[0] as import("three").LineSegments;
  const pos = maillage.geometry.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const h =
      Math.sin(x * 0.16 + temps * 0.09) * 2.4 +
      Math.cos(y * 0.13 - temps * 0.06) * 1.9 +
      Math.sin((x + y) * 0.07) * 1.3;
    pos.setZ(i, h);
  }
  pos.needsUpdate = true;

  const trace = groupe.children[1] as import("three").Line;
  const avance = Math.min(1, 0.1 + defilement * 1.2);
  trace.geometry.setDrawRange(0, Math.floor(avance * 400));
  // Le terrain s'éloigne pendant la lecture : le haut d'écran reste dessiné,
  // la zone de texte se dégage.
  groupe.position.y = 4 - defilement * 13;
  groupe.position.z = -14 - defilement * 9;
}
