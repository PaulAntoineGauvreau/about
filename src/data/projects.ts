import type { ImageMetadata } from 'astro';
import atelierImage from '../assets/projects/atelier-du-corps.png';
import cosoltecImage from '../assets/projects/cosoltec.png';
import cegepImage from '../assets/projects/cegep-lanaudiere.png';
import chiaImage from '../assets/projects/chia-love.png';
import pylexImage from '../assets/projects/pylex.png';
import mcWaterlooImage from '../assets/projects/mc-waterloo.png';
import accordeonMontmagnyImage from '../assets/projects/accordeon-montmagny.png';
import humanifyImage from '../assets/projects/humanify-360.png';
import rolloutCyclingImage from '../assets/projects/rollout-cycling.png';
import venitiennes83Image from '../assets/projects/venitiennes-83.png';

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
  chacha: {
    name: 'CHACHA communications',
    url: 'https://cha-cha.ca/',
  },
  solo: {
    name: 'Projet solo aka Paul-Antoine',
  },
} as const satisfies Record<string, ProjectTeam>;

export const projects: readonly Project[] = [
  {
    name: 'Atelier du corps',
    url: 'https://atelierducorps.ca/fr',
    role: 'Développement front-end et intégration',
    stack: ['Craft CMS', 'Svelte', 'GraphQL'],
    summary:
      'Pour ce projet, j’ai intégré les maquettes et développé les composants front-end en HTML et TypeScript, incluant les animations et les interactions.',
    category: 'headless',
    image: atelierImage,
    team: teams.deuxHuitHuit,
  },
  {
    name: 'Cosoltec',
    url: 'https://www.cosoltec.com/fr',
    role: 'Développement front-end et intégration',
    stack: ['Craft CMS', 'Svelte', 'GraphQL'],
    summary:
      'Pour ce projet, j’ai intégré les maquettes et développé les composants front-end en HTML et TypeScript, incluant les animations et les interactions.',
    category: 'headless',
    image: cosoltecImage,
    team: teams.deuxHuitHuit,
  },
  {
    name: 'Cégep de Lanaudière',
    url: 'https://cegep-lanaudiere.qc.ca/',
    role: 'Développement front-end et intégration',
    stack: ['WordPress', 'PHP', 'JavaScript'],
    summary:
      'Pour ce projet, j’ai intégré le front-end, développé les animations et les interactions, configuré WordPress, puis choisi, configuré et développé les extensions nécessaires.',
    category: 'wordpress',
    image: cegepImage,
    team: teams.lesPretentieux,
  },
  {
    name: 'Chia Love',
    url: 'https://chialove.com/',
    role: 'Développement Shopify et intégration',
    stack: ['Shopify', 'Liquid', 'JavaScript'],
    summary:
      'Pour ce projet, j’ai développé les interactions front-end et participé à la mise en place ainsi qu’à la configuration de la boutique Shopify.',
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
      'Pour ce projet, j’ai intégré le front-end, développé les animations et les interactions, configuré WordPress et WooCommerce, puis choisi, configuré et développé les extensions nécessaires.',
    category: 'commerce',
    image: pylexImage,
    team: teams.lesPretentieux,
  },
  {
    name: 'MC Waterloo',
    url: 'https://mcwaterloo.com/',
    role: 'Développement WordPress et intégration',
    stack: ['WordPress', 'PHP', 'JavaScript'],
    summary:
      'Pour ce projet, j’ai intégré le front-end, développé les animations et les interactions, configuré WordPress, puis choisi, configuré et développé les extensions nécessaires.',
    category: 'wordpress',
    image: mcWaterlooImage,
    team: teams.chacha,
  },
  {
    name: 'Accordéon Montmagny',
    url: 'https://accordeonmontmagny.com/',
    role: 'Développement WordPress et intégration',
    stack: ['WordPress', 'PHP', 'JavaScript'],
    summary:
      'Pour ce projet, j’ai intégré le front-end, développé les animations et les interactions, configuré WordPress, puis choisi, configuré et développé les extensions nécessaires.',
    category: 'wordpress',
    image: accordeonMontmagnyImage,
    team: teams.lesPretentieux,
  },
  {
    name: 'Humanify 360',
    url: 'https://humanify360.com/',
    role: 'Développement WordPress et intégration',
    stack: ['WordPress', 'PHP', 'JavaScript'],
    summary:
      'Pour ce projet, j’ai intégré le front-end, développé les animations et les interactions, configuré WordPress, puis choisi, configuré et développé les extensions nécessaires.',
    category: 'wordpress',
    image: humanifyImage,
    team: teams.lesPretentieux,
  },
  {
    name: 'Roll Out',
    url: 'https://www.rolloutcycling.cc/',
    role: 'Design UI, développement PWA et intégration',
    stack: ['SvelteKit', 'PWA', 'Web Bluetooth'],
    summary:
      'Pour ce projet, j’ai conçu l’interface et développé seul la PWA avec SvelteKit, incluant la création et le suivi des séances ainsi que la connexion Web Bluetooth au home trainer.',
    category: 'application',
    image: rolloutCyclingImage,
    team: teams.solo,
  },
  {
    name: 'Vénitiennes 83',
    url: 'https://v83.ca/',
    role: 'Développement WordPress et intégration',
    stack: ['WordPress', 'PHP', 'JavaScript'],
    summary:
      'Pour ce projet, j’ai intégré le front-end, développé les animations et les interactions, configuré WordPress, puis choisi, configuré et développé les extensions nécessaires.',
    category: 'wordpress',
    image: venitiennes83Image,
    team: teams.lesPretentieux,
  },
];

export function getProjects(): readonly Project[] {
  return projects;
}
