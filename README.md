# Portfolio — Paul-Antoine Gauvreau

Portfolio statique en français construit avec Astro, sans CMS. Le projet présente cinq réalisations front-end, une méthode de travail, la stack et un CV imprimable.

Ce site est mon premier projet Astro. Il a été conçu pour apprendre l’outil en produisant une preuve concrète : transitions de page, composants Web natifs, animations mesurées, accessibilité et SEO.

## Développement

Prérequis : Node.js 22.22 ou plus récent.

```bash
npm install
npm run dev
```

Le serveur local utilise normalement `http://localhost:4321`.

## Commandes

```bash
npm run check       # Astro Check et TypeScript
npm run build       # Build statique dans dist/
npm run test:e2e    # Tests Playwright et Axe
npm run generate:og # Régénère l’image Open Graph 1200 × 630
```

Les captures de projets peuvent être actualisées avec `npm run capture:projects`. Cette commande remplace les cinq images dans `src/assets/projects/` à partir des sites publics.

## Contenu

- `src/data/profile.ts` : profil, parcours, expériences, méthode et stack.
- `src/data/projects.ts` : projets, liens, rôles, descriptions et technologies.
- `src/pages/index.astro` : assemblage des modules du portfolio.
- `src/components/sections/` : une section autonome par fichier (hero, projets, méthode, stack, parcours et contact).
- `src/pages/cv/index.astro` : CV web et styles d’impression.

Les descriptions restent factuelles. Aucun score, résultat ou défi technique n’est publié sans source vérifiable.

## Système Tailwind

`tailwind.config.mjs` est une base universelle, sans nom de composant ni token propre à ce portfolio. La fonction `createRemScale()` génère les espacements, dimensions, tailles de texte et rayons sur une grille de 4px. Comme la racine utilise `62.5%`, `1rem = 10px` : `p-4`, `text-4` et `rounded-4` valent tous 16px. Les fonctions complémentaires génèrent aussi des hauteurs de ligne et espacements de lettres numériques.

Les composants n’utilisent aucune valeur arbitraire Tailwind entre crochets et adaptent leur échelle avec les breakpoints. La palette expose seulement les rôles réutilisables `primary`, `foreground`, `background`, `surface` et `accent`; leurs valeurs sont définies avec les variables CSS de `src/styles/global.css`. Le fichier de configuration peut ainsi être copié tel quel dans un prochain projet. Seuls les filets de 1px et les unités physiques du CV imprimé font exception à la grille.

### Typographie

`src/styles/text.css` contient les tokens typographiques universels en `rem`, avec Helvetica comme police principale et Courier comme alternative monospace. Les tailles et hauteurs de ligne fluides suivent la grille de 4px entre 320px et 1440px.

Les composants utilisent uniquement des rôles sémantiques assemblés avec `@apply` : `text-overline`, `text-caption`, `text-body-small`, `text-body`, `text-body-large`, `text-lead`, `text-title-small`, `text-title-medium`, `text-title-large`, `text-heading-small`, `text-heading-medium`, `text-heading-large` et `text-display`. Les styles d’interface réutilisables sont `text-label`, `text-button`, `text-footer`, `text-contact`, `text-link`, `text-icon`, `text-brand` et `text-strong`.

Ainsi, un composant utilise simplement `class="text-heading-medium"` ou `class="text-body"`; la famille, la taille, l’interligne, la graisse et le crénage restent centralisés dans le système typographique.

## Performance et mesures

Les scores Lighthouse et les Core Web Vitals ne sont volontairement pas affichés avant un déploiement réel. Après la mise en production :

1. mesurer l’URL publique avec Lighthouse dans une fenêtre privée, sur mobile et ordinateur;
2. conserver la date, l’URL, le profil d’appareil et les quatre scores Lighthouse;
3. vérifier les données terrain dans PageSpeed Insights ou la Search Console après une période suffisante;
4. ajouter uniquement les résultats reproductibles au contenu du site.

Le build utilise `astro:assets` pour produire des images AVIF/WebP responsives. Les polices système évitent une requête et un blocage de rendu supplémentaires.

## Accessibilité

- lien d’évitement et ordre de navigation logique;
- focus replacé sur le titre après une transition Astro;
- expérience complète sans JavaScript;
- `prefers-reduced-motion` respecté par Astro, CSS et GSAP;
- composants Web avec états et annonces accessibles;
- contrôle automatisé Axe dans la suite Playwright.

## Livraison

La GitHub Action vérifie le typage, le build et les tests navigateur. Elle ne déploie pas le site et ne modifie pas `pagauvreau.com`.
