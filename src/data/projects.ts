import type { ImageMetadata } from 'astro';
import atelierImage from '../assets/projects/atelier-du-corps.png';
import cegepImage from '../assets/projects/cegep-lanaudiere.png';
import chiaImage from '../assets/projects/chia-love.png';
import pylexImage from '../assets/projects/pylex.png';
import humanifyImage from '../assets/projects/humanify-360.png';
import rolloutCyclingImage from '../assets/projects/rollout-cycling.png';

export type ProjectCategory = 'application' | 'headless' | 'wordpress' | 'commerce';

export interface ProjectTeam {
  name: string;
  url?: string;
}

export interface Project {
  name: string;
  url: string;
  role: string;
  stack: readonly string[];
  summary: string;
  category: ProjectCategory;
  image: ImageMetadata;
  team: ProjectTeam;
}

const teams = {
  deuxHuitHuit: {
    name: 'Deux Huit Huit',
    url: 'https://deuxhuithuit.com/fr',
  },
  lesPretentieux: {
    name: 'Les Prétentieux',
    url: 'https://lespretentieux.com/',
  },
  solo: {
    name: 'Projet solo aka Paul-Antoine',
  },
} as const satisfies Record<string, ProjectTeam>;

export const projects: readonly Project[] = [
  {
    name: 'Roll Out',
    url: 'https://www.rolloutcycling.cc/',
    role: 'Design UI, développement PWA et intégration',
    stack: ['SvelteKit', 'PWA', 'Web Bluetooth'],
    summary:
      'J’ai conçu l’interface et développé seul cette PWA avec SvelteKit. Le défi principal a été de connecter le home trainer en Web Bluetooth et de gérer la création ainsi que le suivi des séances.',
    category: 'application',
    image: rolloutCyclingImage,
    team: teams.solo,
  },
  {
    name: 'Atelier du corps',
    url: 'https://atelierducorps.ca/fr',
    role: 'Développement front-end et intégration',
    stack: ['Craft CMS', 'Svelte', 'GraphQL'],
    summary:
      'J’ai intégré les maquettes et développé le front-end en Svelte. Le défi a été de décliner les interfaces en composants réutilisables, alimentés par Craft CMS via GraphQL.',
    category: 'headless',
    image: atelierImage,
    team: teams.deuxHuitHuit,
  },
  {
    name: 'Cégep de Lanaudière',
    url: 'https://cegep-lanaudiere.qc.ca/',
    role: 'Développement front-end et intégration',
    stack: ['WordPress', 'GSAP', 'ScrollTrigger'],
    summary:
      'J’ai intégré le front-end et configuré WordPress ainsi que les extensions nécessaires. J’ai notamment développé des animations au défilement avec GSAP et ScrollTrigger.',
    category: 'wordpress',
    image: cegepImage,
    team: teams.lesPretentieux,
  },
  {
    name: 'Humanify 360',
    url: 'https://humanify360.com/',
    role: 'Développement WordPress et intégration',
    stack: ['WordPress', 'PHP', 'Swup'],
    summary:
      'J’ai intégré le front-end et configuré WordPress ainsi que les extensions nécessaires. Le défi précis a été de créer les transitions de page avec Swup.',
    category: 'wordpress',
    image: humanifyImage,
    team: teams.lesPretentieux,
  },
  {
    name: 'Chia Love',
    url: 'https://chialove.com/',
    role: 'Développement Shopify et intégration',
    stack: ['Shopify', 'Liquid', 'JavaScript'],
    summary:
      'J’ai développé les interactions front-end et participé à la mise en place de la boutique Shopify. Le défi a été de relier ces interactions aux contenus et aux fonctions natives de Shopify avec Liquid.',
    category: 'commerce',
    image: chiaImage,
    team: teams.deuxHuitHuit,
  },
  {
    name: 'Pylex',
    url: 'https://pylex.com/',
    role: 'Développement front-end et intégration',
    stack: ['WooCommerce', 'WordPress', 'JavaScript'],
    summary:
      'J’ai intégré le front-end et configuré WordPress, WooCommerce ainsi que les extensions nécessaires. Le défi a été de faire cohabiter l’intégration sur mesure avec le catalogue et les fonctions de commerce en ligne.',
    category: 'commerce',
    image: pylexImage,
    team: teams.lesPretentieux,
  },
];

export function getProjects(): readonly Project[] {
  return projects;
}
