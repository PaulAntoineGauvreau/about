export interface CvExperience {
  title: string;
  organization?: string;
  url?: string;
  urlLabel?: string;
  period: string;
  bullets: readonly string[];
}

export interface CvEducation {
  credential: string;
  institution: string;
  period: string;
}

export interface CvVersion {
  slug: 'developpement' | 'gestion-vente';
  label: string;
  role: string;
  path: string;
  pdfHref: string;
  profile: string;
  experiences: readonly CvExperience[];
  projects?: readonly CvExperience[];
  complementaryExperiences?: readonly CvExperience[];
  skills: readonly string[];
  education: readonly CvEducation[];
  languages: readonly string[];
}

const education = [
  {
    credential: 'AEC en conception et programmation de sites web',
    institution: 'Collège de Maisonneuve',
    period: '2020–2022',
  },
  {
    credential: 'Baccalauréat en design de l’environnement',
    institution: 'Université du Québec à Montréal',
    period: '2008–2011',
  },
] as const;

export const cvVersions: readonly CvVersion[] = [
  {
    slug: 'developpement',
    label: 'Développement',
    role: 'Développeur front-end',
    path: '/cv/',
    pdfHref: '/cv/paul-antoine-gauvreau-cv-developpeur.pdf',
    profile:
      'Développeur front-end avec plus de quatre ans d’expérience en agence et une formation universitaire en design. Je réalise des sites et des interfaces avec Svelte, Craft CMS, WordPress et Shopify, de l’intégration de maquettes Figma aux animations et à la mise en ligne. Mon parcours en design et en communication numérique nourrit une approche attentive à la qualité visuelle, à l’expérience utilisateur et aux objectifs du projet.',
    experiences: [
      {
        title: 'Développeur front-end en agence',
        organization:
          'Atelier Deux Huit Huit (depuis 2025) · Les Prétentieux (2023–2025) · CHACHA communications (2022–2023)',
        period: 'Depuis 2022',
        bullets: [
          'Intégration de maquettes et de composants en HTML, TypeScript et Svelte avec Craft CMS headless et GraphQL. Développement sur mesure avec WordPress, WooCommerce, Shopify et Liquid.',
          'Animations avec GSAP et ScrollTrigger, transitions de page et collaboration avec designers et producteurs jusqu’à la mise en ligne.',
        ],
      },
    ],
    projects: [
      {
        title: 'Projet personnel · Roll Out',
        organization: 'PWA conçue et développée en autonomie',
        url: 'https://www.rolloutcycling.cc/',
        urlLabel: 'rolloutcycling.cc',
        period: 'Projet en cours',
        bullets: [
          'Conception UI et développement avec SvelteKit et Web Bluetooth pour connecter un vélo d’entraînement et suivre les séances.',
        ],
      },
    ],
    complementaryExperiences: [
      {
        title: 'Directeur de magasin',
        organization: 'Cycles Campus Verdun',
        period: '2017–2020',
        bullets: [
          'Gestion d’une équipe de 10 à 20 employés et des achats de produits : sélection, commandes et suivi des stocks.',
          'Pilotage de l’image de marque et des communications : design graphique, infolettres, campagnes numériques et imprimées, contenu et SEO.',
          'Conception et développement du site web, de l’arborescence à la mise en ligne, en soutien aux ventes et à l’expérience client.',
        ],
      },
      {
        title: 'Designer indépendant',
        organization: 'Mandats en design d’espace',
        period: 'Depuis 2011',
        bullets: [
          'Conception d’espaces commerciaux, de kiosques d’exposition et de projets résidentiels, de l’analyse des besoins à la livraison.',
          'Gestion de la relation client, des concepts, des fournisseurs et des échéanciers tout au long du mandat.',
        ],
      },
    ],
    skills: [
      'HTML, CSS, JavaScript, TypeScript, Svelte, SvelteKit, Astro',
      'Craft CMS, GraphQL, WordPress, WooCommerce, Shopify, Liquid',
      'GSAP, ScrollTrigger, Swup, SCSS, Tailwind CSS',
      'Figma, Adobe Creative Suite, Git, GitHub, Vite',
    ],
    education,
    languages: ['Français — langue maternelle', 'Anglais — fonctionnel'],
  },
  {
    slug: 'gestion-vente',
    label: 'Gestion / vente',
    role: 'Gestion de projets · Vente',
    path: '/cv/gestion-vente/',
    pdfHref: '/cv/paul-antoine-gauvreau-cv-gestion-vente.pdf',
    profile:
      'Gestionnaire polyvalent issu du commerce de détail, du design et du développement web. Expérience en direction d’une équipe de 10 à 20 employés, en vente-conseil et en livraison de projets avec des clients, designers, producteurs et développeurs. À l’aise pour relier les besoins d’affaires, l’expérience client et l’exécution.',
    experiences: [
      {
        title: 'Directeur de magasin',
        organization: 'Cycles Campus Verdun',
        period: '2017–2020',
        bullets: [
          'Direction des opérations quotidiennes, supervision d’une équipe de 10 à 20 employés et gestion des achats de produits, des commandes et des stocks.',
          'Développement de l’expérience de marque par la conception du site web, de l’identité visuelle et des espaces commerciaux.',
        ],
      },
      {
        title: 'Développeur front-end en agence',
        organization:
          'Atelier Deux Huit Huit · Les Prétentieux · CHACHA communications',
        period: 'Depuis 2022',
        bullets: [
          'Coordination quotidienne avec designers et producteurs pour clarifier les besoins, valider les livrables et mener les projets jusqu’à leur mise en ligne.',
          'Réalisation de sites sur mesure pour des organisations de services, de commerce et d’éducation.',
        ],
      },
      {
        title: 'Représentant et assistant-directeur',
        organization: 'Bell Mobilité',
        period: '2006–2012',
        bullets: [
          'Vente-conseil, service à la clientèle et soutien aux opérations du commerce.',
        ],
      },
      {
        title: 'Designer indépendant',
        period: 'Depuis 2011',
        bullets: [
          'Gestion de mandats de kiosques de salon, de mobilier et d’espaces commerciaux, du concept à la livraison.',
        ],
      },
    ],
    skills: [
      'Gestion d’équipe et opérations de commerce de détail',
      'Vente-conseil, service à la clientèle et communication',
      'Coordination de projets, suivi de production et validation de livrables',
      'Figma, Adobe Creative Suite, outils web et commerce électronique',
    ],
    education,
    languages: ['Français — langue maternelle', 'Anglais — fonctionnel'],
  },
] as const;

export const developmentCv = cvVersions[0];
export const managementSalesCv = cvVersions[1];
