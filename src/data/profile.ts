export const profile = {
  name: 'Paul-Antoine Gauvreau',
  role: 'Développeur front-end',
  location: 'Montréal',
  email: 'paulantoine.gauvreau@gmail.com',
  phoneDisplay: '514 209 9499',
  phoneHref: '+15142099499',
  website: 'https://pagauvreau.com',
  introduction:
    'Je suis développeur web front-end basé à Montréal. Passionné par le web, le design, la musique et le cyclisme. Je suis formé au Collège de Maisonneuve en développement web et à l’UQAM en design. Si je ne suis pas derrière mon ordinateur, je suis sur un vélo!',
} as const;

export const workPrinciples = [
  {
    number: '01',
    title: 'Cadrer',
    text: 'Je découpe le mandat, clarifie les dépendances et estime le travail avant de commencer à produire.',
  },
  {
    number: '02',
    title: 'Collaborer',
    text: 'Je garde un dialogue direct avec designers, producteurs et chargés de projet, du premier écran à la mise en ligne.',
  },
  {
    number: '03',
    title: 'Construire',
    text: 'J’intègre avec une attention particulière au rythme, aux détails, aux états d’interface et à la maintenabilité.',
  },
  {
    number: '04',
    title: 'Vérifier',
    text: 'Je teste au clavier, sur plusieurs formats d’écran et avec les outils du navigateur avant la revue de code.',
  },
] as const;

export const stackGroups = [
  {
    title: 'Front-end',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Svelte', 'Astro'],
  },
  {
    title: 'Styles',
    items: ['SCSS', 'BEM', 'ITCSS', 'Tailwind CSS', 'PostCSS', 'GSAP'],
  },
  {
    title: 'Contenu & commerce',
    items: ['Craft CMS', 'GraphQL', 'WordPress', 'Shopify', 'Liquid', 'WooCommerce'],
  },
  {
    title: 'Conception & livraison',
    items: ['Figma', 'Adobe Creative Suite', 'Git', 'GitHub', 'Vite'],
  },
] as const;

export const career = [
  {
    period: 'Depuis 2022',
    title: 'Développeur front-end en agence',
    detail: 'Atelier Deux Huit Huit · Les Prétentieux · CHACHA communications',
  },
  {
    period: '2015–2020',
    title: 'Directeur de magasin',
    detail: 'Cycles Campus Verdun · opérations, équipe, identité visuelle, site web et espaces commerciaux',
  },
  {
    period: 'Depuis 2011',
    title: 'Designer indépendant',
    detail: 'Espaces commerciaux, mobilier et projets événementiels',
  },
] as const;

export const experiences = [
  {
    title: 'Développeur front-end',
    period: 'Depuis 2022',
    organizations: [
      'Atelier Deux Huit Huit — depuis 2025',
      'Les Prétentieux, agence créative — 2023 à 2025',
      'CHACHA communications — 2022 à 2023',
    ],
    description:
      'Développement et intégration de sites web, gestion de contenu dans les CMS et maintenance. Collaboration avec les designers et les chargés de projet pour la réalisation, la validation et la mise en ligne.',
  },
  {
    title: 'Directeur de magasin',
    period: '2015–2020',
    organizations: ['Cycles Campus Verdun'],
    description:
      'Gestion d’un commerce et d’une équipe de 10 à 20 employés. Direction des opérations et conception de l’identité visuelle, du site web et des espaces commerciaux.',
  },
  {
    title: 'Designer indépendant',
    period: 'Depuis 2011',
    organizations: [],
    description: 'Conception d’espaces commerciaux, de mobilier et de projets événementiels.',
  },
] as const;

export const complementaryExperiences = [
  { title: 'Designer industriel', organization: 'Point 1 Display', period: '2012–2013' },
  {
    title: 'Représentant et assistant-directeur',
    organization: 'Bell Mobilité',
    period: '2006–2012',
  },
] as const;

export const education = [
  {
    title: 'AEC — Conception et programmation de sites web',
    organization: 'Collège de Maisonneuve',
    period: '2020–2022',
  },
  {
    title: 'Baccalauréat — Design de l’environnement',
    organization: 'Université du Québec à Montréal',
    period: '2008–2011',
  },
] as const;
