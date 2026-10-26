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
- `src/pages/index.astro` : portfolio.
- `src/pages/cv/index.astro` : CV web et styles d’impression.

Les descriptions restent factuelles. Aucun score, résultat ou défi technique n’est publié sans source vérifiable.

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
