# Demeure Studio

Site vitrine d'un studio web français nommé « Demeure — studio ». Une seule page, navigation ancrée. Tout le texte en français. Noms de variables et de composants en français.

Ce message est la PASSE 1 sur 5 : fondations visuelles, navigation, bandeau d'ouverture, deux blocs de texte. Ne construis rien d'autre. Pour les sections suivantes, crée uniquement des balises `<section>` vides avec leur id d'ancre — aucun contenu inventé, aucun texte de remplissage, aucune image de démonstration.

---

## RÈGLES ABSOLUES — le client refuse un site qui « a l'air fait par une IA »

Ces règles priment sur tes réflexes habituels. Relis-les avant chaque composant.

1. **Aucune icône.** Pas de lucide-react, pas de heroicons, pas de pictogramme, nulle part, sauf le chevron du menu mobile. Une icône au-dessus d'un titre est le signal le plus reconnaissable d'un site généré.
2. **Aucune grille de trois cartes identiques.** Jamais trois colonnes égales avec titre + paragraphe. Si trois idées doivent cohabiter, elles ont des largeurs différentes et des hauteurs différentes.
3. **Aucune photographie, aucune illustration, aucun dégradé décoratif, aucune forme floue en arrière-plan, aucun glassmorphisme.** Ce site est entièrement typographique et graphique. C'est un parti pris assumé : le studio montre l'instrument, pas la propriété.
4. **Aucun emoji.**
5. **Rayon de bordure 0 partout.** Seule exception : 2px sur les boutons. Pas de `rounded-lg`, `rounded-xl`, `rounded-2xl`.
6. **Aucune ombre portée** de type `shadow-lg`. Les plans se distinguent par la couleur de fond et les filets, pas par des ombres.
7. **Rien n'est centré par défaut.** Le texte est aligné à gauche. Seul le bandeau d'ouverture peut déroger. Les titres de section sont à gauche, jamais un titre centré avec un sous-titre centré en dessous.
8. **Asymétrie délibérée.** Les blocs ne commencent pas tous à la même colonne. Voir la grille ci-dessous.
9. **Densité.** Les paragraphes fournis sont longs, c'est voulu. Ne les raccourcis pas, ne les découpe pas en puces, n'ajoute pas de titre au-dessus de chaque phrase.
10. **N'invente aucun texte.** Utilise exactement les textes fournis, à la virgule près. S'il te manque un texte, laisse la zone vide plutôt que d'écrire quelque chose.

---

## JETONS DE COULEUR

Déclare-les en variables CSS sur `:root` dans le CSS global, et expose-les à Tailwind. Le site est en thème sombre unique, pas de bascule clair/sombre.

```
--encre:        #0B0B0C   /* fond de page */
--encre-2:      #141416   /* blocs, encarts */
--encre-3:      #1C1C1F   /* survol de bloc */
--craie:        #F4F2ED   /* texte principal — blanc cassé, JAMAIS #FFFFFF */
--craie-2:      #9A9891   /* texte secondaire */
--craie-3:      #5E5D59   /* libellés, mentions */
--filet:        rgba(244, 242, 237, 0.09)
--filet-fort:   rgba(244, 242, 237, 0.20)
--signal:       #3E7C79   /* accent unique, bleu-vert froid — aplats, traits, boutons */
--signal-clair: #6FB3AF   /* même accent éclairci, pour le texte et les survols sur fond sombre */
--alerte:       #C1452F   /* réservé exclusivement à la commission dans le futur diagramme. Ne l'utilise nulle part dans cette passe. */
```

L'accent `--signal` est le seul accent du site. Ne crée aucune autre couleur. Il s'emploie avec parcimonie : un site qui en met partout perd son effet.

## TYPOGRAPHIE

Trois familles, toutes sur Google Fonts, chargées avec `display=swap` et préconnexion.

- **Titres — `Fraunces`**, variable, poids 400 à 600, axe optique `opsz` élevé sur les grandes tailles. `letter-spacing: -0.02em`, `line-height: 1.05` sur les très grandes tailles.
- **Corps — `IBM Plex Sans`**, poids 400 et 500.
- **Chiffres, libellés de données, mentions techniques — `IBM Plex Mono`**, poids 400 et 500, `letter-spacing: 0.02em`.

Règle non négociable : **tout montant, tout pourcentage, toute donnée chiffrée s'affiche en IBM Plex Mono, jamais en Fraunces.** Active `font-variant-numeric: tabular-nums` sur ces éléments.

Échelle, en `clamp()` :
- `.t-ouverture` — Fraunces, `clamp(2.75rem, 7vw, 6rem)`, poids 400
- `.t-section` — Fraunces, `clamp(2rem, 4vw, 3.25rem)`, poids 400
- `.t-bloc` — Fraunces, `clamp(1.5rem, 2.4vw, 2.125rem)`, poids 400
- `.t-corps` — IBM Plex Sans, `clamp(1.0625rem, 1.15vw, 1.1875rem)`, `line-height: 1.65`, couleur `--craie-2`
- `.t-corps-fort` — idem mais couleur `--craie`
- `.t-libelle` — IBM Plex Mono, `0.75rem`, majuscules, `letter-spacing: 0.14em`, couleur `--craie-3`
- `.t-mention` — IBM Plex Sans, `0.8125rem`, couleur `--craie-3`

Longueur de ligne : les paragraphes ne dépassent jamais 68 caractères (`max-width: 34em`).

## GRILLE

Conteneur `max-width: 1240px`, marge automatique, padding latéral 24px mobile / 48px desktop. Grille de 12 colonnes, gouttière 24px.

Placement des blocs — c'est ce qui crée l'asymétrie, applique-le littéralement :
- Titre de section : colonnes 1 à 8
- Premier bloc de texte : colonnes 1 à 6
- Deuxième bloc de texte : colonnes **4 à 10** (décalé vers la droite)
- Notes et mentions : colonnes 9 à 12, alignées en haut du bloc voisin

En dessous de 768px, tout passe en une colonne.

## FILETS ET NUMÉROTATION DE SECTION

Chaque section s'ouvre par une ligne composée ainsi, sur une seule rangée :
`01` en IBM Plex Mono couleur `--signal-clair`, puis un espace de 16px, puis le libellé de section en `.t-libelle`, puis un filet horizontal 1px couleur `--filet` qui **s'étend jusqu'au bord droit du conteneur**. Le titre de section vient en dessous, à 32px.

## GRAIN

Superpose sur tout le document un bruit très léger : un SVG `feTurbulence` (`baseFrequency="0.8"`, `numOctaves="3"`) encodé en data-URI, en `position: fixed`, `inset: 0`, `pointer-events: none`, `opacity: 0.035`, `mix-blend-mode: overlay`, `z-index: 1`. C'est ce qui donne au fond sa matière et le distingue d'un aplat numérique.

## MOUVEMENT

Une seule courbe dans tout le site : `cubic-bezier(0.16, 1, 0.3, 1)`.

- **Apparition au défilement** : opacité 0 → 1 et translation `16px` → 0, durée 650ms. Déclenchée par `IntersectionObserver` à 20 % de visibilité, **une seule fois**, jamais rejouée. Cascade de 60ms entre éléments frères, plafonnée à 240ms.
- **Filet sous les titres de section** : passe de `scaleX(0)` à `scaleX(1)`, origine gauche, 400ms.
- **Survol de bloc** : fond `--encre-2` → `--encre-3` et translation `-2px`, 200ms. Aucun élément ne grossit de plus de 2 %.
- **Interdits** : rebond, rotation, parallaxe, chiffres qui défilent, apparition rejouée au défilement inverse.
- `@media (prefers-reduced-motion: reduce)` : toutes les animations et transitions désactivées, tout est visible à l'état final.

---

## NAVIGATION

Fixe en haut, hauteur 72px desktop / 60px mobile. Fond transparent au chargement ; au-delà de 40px de défilement, fond `rgba(11,11,12,0.82)` + `backdrop-filter: blur(14px)` + filet 1px `--filet` en bas. Transition 300ms.

Gauche — le logotype, en une seule ligne :
`Demeure` en Fraunces 20px couleur `--craie`, puis un tiret cadratin ` — ` couleur `--craie-3`, puis `studio` en IBM Plex Mono 12px minuscules `letter-spacing: 0.16em` couleur `--craie-3`, aligné sur la ligne de base.

Centre, à partir de 1024px — quatre liens en `.t-libelle` couleur `--craie-2` :
`Pourquoi` → `#pourquoi` · `Notre réponse` → `#reponse` · `Méthode` → `#methode` · `Tarifs` → `#tarifs`
Au survol : couleur `--craie` et un filet 1px `--signal` qui se déploie sous le lien de gauche à droite en 250ms.

Droite — un bouton `Nous écrire` → `#contact` : fond transparent, bordure 1px `--filet-fort`, texte `.t-libelle` couleur `--craie`, padding 12px 22px, rayon 2px. Au survol : bordure `--signal`, texte `--signal-clair`.

Sous 1024px : bouton menu (deux traits de 18px, pas d'icône importée), ouvrant un panneau plein écran fond `--encre`, liens en Fraunces 28px alignés à gauche avec 24px de padding, numérotés `01` à `05` en IBM Plex Mono `--craie-3` devant chaque lien. Défilement du corps bloqué quand le panneau est ouvert.

Le défilement vers les ancres est fluide (`scroll-behavior: smooth`) avec `scroll-margin-top: 96px` sur chaque section.

## BANDEAU D'OUVERTURE

Hauteur `min-height: 92vh`, contenu aligné à gauche, centré verticalement, dans les colonnes 1 à 9.

Au-dessus du titre, un libellé `.t-libelle` : `STUDIO WEB — RÉSERVATION DIRECTE`

Titre `.t-ouverture`, sur deux lignes, la seconde en couleur `--craie-2` :
```
Votre villa vous appartient.
Votre clientèle, non.
```

En dessous, à 32px, un paragraphe `.t-corps-fort`, `max-width: 30em` :
> Vous leur ouvrez votre porte, vous leur remettez les clés. Puis les conditions que vous avez acceptées vous interdisent de les démarcher.

En dessous, à 24px, un paragraphe `.t-corps` :
> Nous construisons le canal qui vous rend les deux.

À 48px, un bouton unique `Voir ce que cela représente` → ancre `#diagramme` : fond `--signal`, texte `--encre`, `.t-libelle` mais en poids 500, padding 16px 32px, rayon 2px. Au survol : fond `--signal-clair`, translation `-2px`, 200ms.

Tout en bas du bandeau, aligné à gauche, une ligne discrète en IBM Plex Mono 12px couleur `--craie-3`, avec un filet vertical de 1px et 24px de haut au-dessus :
`Faites défiler`

Aucune flèche animée, aucun chevron rebondissant.

Le bandeau se termine par un filet horizontal pleine largeur de la fenêtre, 1px, couleur `--filet`.

## SECTION 01 — POURQUOI

`id="pourquoi"`, libellé de section `POURQUOI`, numéro `01`.
Titre de section `.t-section` : `Vous ne fixez pas les règles`

**Bloc A** — colonnes 1 à 6, deux paragraphes `.t-corps` :

> Vous fixez le prix de vos nuits, la décoration de vos chambres, le choix de vos prestataires. Vous ne fixez ni le taux de commission, ni les conditions d'annulation, ni le délai de versement, ni la façon dont votre bien est présenté.

> Ces règles peuvent changer sans que vous soyez consulté. Elles ont déjà changé. Un canal que vous ne contrôlez pas est un canal qui peut se refermer.

**Bloc B** — colonnes 4 à 10, séparé du bloc A par 120px de marge verticale. Il commence par un titre `.t-bloc` :
`Vous les accueillez, puis la porte se referme`

Puis quatre paragraphes `.t-corps` :

> Une famille passe dix jours chez vous. Vous l'accueillez, vous lui montrez la maison, vous lui indiquez le bon restaurant du port. Vous connaissez son prénom et son visage.

> Elle repart, et les règles reprennent la main. Les conditions d'utilisation d'Airbnb interdisent à un hôte d'encourager un voyageur à « fournir ses coordonnées ou à entreprendre d'autres actions en dehors de la plateforme », et d'utiliser ses informations personnelles pour lui adresser un message commercial sans son consentement explicite. La politique hors plateforme, entrée en vigueur en mai 2025, interdit en outre de demander ou d'utiliser des coordonnées à des fins étrangères au séjour.

> En cas de manquement : visibilité réduite, annonce retirée, compte fermé.

> Dix ans d'accueil, et aucun fichier client. Non par négligence — parce que le constituer vous est interdit.

Traite le deuxième paragraphe ci-dessus comme une citation de référence : filet vertical 2px couleur `--signal` à gauche, 24px de padding à gauche, texte en couleur `--craie`.

**Encart** — collé au bloc B, colonnes 9 à 12 sur desktop, en dessous sur mobile. Fond `--encre-2`, padding 28px, filet 1px `--filet`, aucun rayon. Libellé `.t-libelle` en tête : `LA NUANCE`. Puis un paragraphe `.t-mention` :

> Sur une villa familiale, un locataire revient rarement. Mais il en connaît d'autres qui louent au même niveau. Ce que vous perdez n'est pas un client qui revient, c'est le réseau qu'il représente. Sur un séminaire d'entreprise, en revanche, c'est bien le client qui revient — chaque année.

---

## SECTIONS À CRÉER VIDES

Crée ces balises `<section>` avec leur `id` et **rien d'autre à l'intérieur** — elles seront remplies dans les passes suivantes :
`#diagramme`, `#reponse`, `#methode`, `#tarifs`, `#contact`

## MÉTADONNÉES

`<html lang="fr">`. Titre de l'onglet : `Demeure — studio`. Description : `Le studio qui construit le canal de réservation directe des villas de location premium. Site sur mesure, espace de gestion, visibilité sur les assistants conversationnels.` Structure HTML sémantique : `header`, `nav`, `main`, `section`, `footer`, un seul `h1` dans le bandeau d'ouverture.

Pas de pied de page dans cette passe.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6686020f-3da7-4c03-a058-e6ea6b9eaa2b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
