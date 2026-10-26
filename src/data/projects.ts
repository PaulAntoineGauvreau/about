import type { ImageMetadata } from 'astro';
import atelierImage from '../assets/projects/atelier-du-corps.png';
import cosoltecImage from '../assets/projects/cosoltec.png';
import cegepImage from '../assets/projects/cegep-lanaudiere.png';
import chiaImage from '../assets/projects/chia-love.png';
import pylexImage from '../assets/projects/pylex.png';

export type ProjectCategory = 'headless' | 'wordpress' | 'commerce';

export interface Project {
  name: string;
  url: string;
  role: string;
  stack: readonly string[];
  summary: string;
  category: ProjectCategory;
  image: ImageMetadata;
  accent: string;
}

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
    accent: '#d7ff5f',
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
    accent: '#78d8ff',
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
    accent: '#f7cf46',
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
    accent: '#ff9db2',
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
    accent: '#70c7a0',
  },
];
