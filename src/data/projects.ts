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
  imageAlt: string;
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
      'J’ai conçu l’interface et développé seul cette PWA avec SvelteKit. La connexion Web Bluetooth au home trainer alimente la création et le suivi des séances.',
    category: 'application',
    image: rolloutCyclingImage,
    imageAlt: 'Interface de séance cycliste Roll Out avec un graphique d’intervalles et des données de puissance',
    team: teams.solo,
  },
  {
    name: 'Atelier du corps',
    url: 'https://atelierducorps.ca/fr',
    role: 'Développement front-end et intégration',
    stack: ['Craft CMS', 'Svelte', 'GraphQL'],
    summary:
      'J’ai intégré les maquettes et développé le front-end en Svelte. Les interfaces sont déclinées en composants réutilisables alimentés par Craft CMS via GraphQL.',
    category: 'headless',
    image: atelierImage,
    imageAlt: 'Accueil d’Atelier du corps montrant un soin du visage et le titre Chirurgie esthétique et médecine du bien-être',
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
    imageAlt: 'Accueil du Cégep de Lanaudière avec la signature Ici, c’est toi sur un dégradé coloré',
    team: teams.lesPretentieux,
  },
  {
    name: 'Humanify 360',
    url: 'https://humanify360.com/',
    role: 'Développement WordPress et intégration',
    stack: ['WordPress', 'PHP', 'Swup'],
    summary:
      'J’ai intégré le front-end et configuré WordPress ainsi que les extensions nécessaires. Les changements de page sont animés avec Swup.',
    category: 'wordpress',
    image: humanifyImage,
    imageAlt: 'Accueil de Humanify avec le titre Le futur du recrutement est humain et une équipe en réunion',
    team: teams.lesPretentieux,
  },
  {
    name: 'Chia Love',
    url: 'https://chialove.com/',
    role: 'Développement Shopify et intégration',
    stack: ['Shopify', 'Liquid', 'JavaScript'],
    summary:
      'J’ai développé les interactions front-end et participé à la mise en place de la boutique Shopify. Avec Liquid, j’ai relié ces interactions aux contenus et aux fonctions natives de Shopify.',
    category: 'commerce',
    image: chiaImage,
    imageAlt: 'Accueil de Chia Love montrant une personne au lit et le slogan The tastiest head start to your day',
    team: teams.deuxHuitHuit,
  },
  {
    name: 'Pylex',
    url: 'https://pylex.com/',
    role: 'Développement front-end et intégration',
    stack: ['WooCommerce', 'WordPress', 'JavaScript'],
    summary:
      'J’ai intégré le front-end et configuré WordPress, WooCommerce ainsi que les extensions nécessaires. L’intégration sur mesure cohabite avec le catalogue et les fonctions de commerce en ligne.',
    category: 'commerce',
    image: pylexImage,
    imageAlt: 'Catalogue Pylex présentant des produits d’aménagement extérieur et leurs prix',
    team: teams.lesPretentieux,
  },
];

export function getProjects(): readonly Project[] {
  return projects;
}
