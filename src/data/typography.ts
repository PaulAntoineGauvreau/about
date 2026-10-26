export interface TypographySpecimen {
  className: string;
  label: string;
  sample: string;
  usage: string;
}

export interface TypographyGroup {
  title: string;
  description: string;
  specimens: TypographySpecimen[];
}

export const fontFamilies: TypographySpecimen[] = [
  {
    className: 'text-heading-small',
    label: 'Helvetica / Sans-serif',
    sample: 'Aa Bb Cc 0123',
    usage: 'Famille principale pour le contenu, les titres et les grands affichages.',
  },
  {
    className: 'text-mono-display',
    label: 'Courier / Monospace',
    sample: 'Aa Bb Cc 0123',
    usage: 'Famille alternative pour les libellés, métadonnées et accents éditoriaux.',
  },
];

export const typographyGroups: TypographyGroup[] = [
  {
    title: 'Texte courant',
    description: 'Styles destinés aux annotations, paragraphes et introductions.',
    specimens: [
      { className: 'text-overline', label: 'Overline', sample: 'Développeur front-end — Montréal', usage: 'Repère de section ou surtitre en capitales monospace.' },
      { className: 'text-caption', label: 'Caption', sample: 'Une note courte accompagne le contenu principal.', usage: 'Légende et information secondaire en monospace.' },
      { className: 'text-body-small', label: 'Body small', sample: 'Un texte compact reste lisible sur tous les écrans.', usage: 'Informations secondaires et contenu dense.' },
      { className: 'text-body', label: 'Body', sample: 'Le style de lecture principal privilégie une mesure confortable et un rythme régulier.', usage: 'Paragraphes et contenu courant.' },
      { className: 'text-body-large', label: 'Body large', sample: 'Une introduction plus présente, sans devenir un titre.', usage: 'Résumé, chapeau et contenu mis en avant.' },
      { className: 'text-lead', label: 'Lead', sample: 'Concevoir et développer des interfaces claires, rapides et durables.', usage: 'Proposition de valeur et déclaration éditoriale.' },
    ],
  },
  {
    title: 'Titres',
    description: 'Hiérarchie fluide pour structurer une page, d’un titre local à un affichage principal.',
    specimens: [
      { className: 'text-title-small', label: 'Title small', sample: 'Titre secondaire', usage: 'Petit titre de contenu ou de colonne.' },
      { className: 'text-title-medium', label: 'Title medium', sample: 'Titre de composant', usage: 'Carte, groupe ou entrée de parcours.' },
      { className: 'text-title-large', label: 'Title large', sample: 'Titre de projet', usage: 'Projet, article ou bloc éditorial important.' },
      { className: 'text-heading-small', label: 'Heading small', sample: 'Titre de section', usage: 'Section standard avec présence éditoriale.' },
      { className: 'text-heading-medium', label: 'Heading medium', sample: 'Grand titre de section', usage: 'Section principale ou message de transition.' },
      { className: 'text-heading-large', label: 'Heading large', sample: 'Parlons-nous.', usage: 'Titre final ou appel à l’action majeur.' },
      { className: 'text-display', label: 'Display', sample: 'PAG', usage: 'Affichage héro très court et fortement expressif.' },
    ],
  },
  {
    title: 'Interface',
    description: 'Rôles spécialisés qui évitent de répéter des combinaisons Tailwind dans les composants.',
    specimens: [
      { className: 'text-label', label: 'Label', sample: 'Catégorie · 01', usage: 'Métadonnée ou catégorie en capitales monospace.' },
      { className: 'text-button', label: 'Button', sample: 'Voir le projet', usage: 'Libellé de bouton ou contrôle interactif.' },
      { className: 'text-footer', label: 'Footer', sample: 'Montréal — Québec', usage: 'Information compacte de pied de page.' },
      { className: 'text-contact', label: 'Contact', sample: 'bonjour@pagauvreau.com', usage: 'Coordonnée ou action de contact.' },
      { className: 'text-link', label: 'Link', sample: 'Découvrir le parcours →', usage: 'Lien textuel important.' },
      { className: 'text-icon', label: 'Icon', sample: '↗ ↓ →', usage: 'Glyphe d’action dimensionné comme du texte.' },
      { className: 'text-brand', label: 'Brand', sample: 'PAG↗', usage: 'Signature ou marque textuelle compacte.' },
      { className: 'text-strong', label: 'Strong', sample: 'Texte fortement accentué', usage: 'Accent de graisse qui hérite de la taille environnante.' },
    ],
  },
];
