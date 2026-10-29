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
      'Une présence numérique centrée sur les soins et les contenus, alimentée par Craft en mode headless.',
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
      'Un site corporatif qui organise une offre technique dense dans une expérience de consultation claire.',
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
      'Un écosystème WordPress destiné à rendre accessibles programmes, services et nouvelles à plusieurs publics.',
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
      'Une boutique en ligne pour une marque alimentaire, du contenu de marque jusqu’au parcours d’achat.',
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
      'Un catalogue de produits bilingue avec filtres, pensé pour guider rapidement vers le bon produit.',
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
      'Une plateforme culturelle qui met en valeur la programmation, les promotions et la billetterie de la Maison de la culture de Waterloo.',
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
      'Un portail vivant qui rassemble le festival, le musée et l’école internationale de musique de Montmagny.',
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
      'Une présence numérique dédiée au recrutement humain, à la performance des équipes et aux solutions RH.',
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
      'Une application progressive pour créer, suivre et enregistrer des séances de vélo intérieur structurées avec un home trainer.',
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
      'Un site éditorial et commercial consacré aux toiles sur mesure, aux produits pour la maison et au design intérieur.',
    category: 'wordpress',
    image: venitiennes83Image,
    team: teams.lesPretentieux,
  },
];

export function getProjects(): readonly Project[] {
  return projects;
}
