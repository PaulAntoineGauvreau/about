export interface TypographySpecimen {
  className: string;
  label: string;
  sample: string;
}

export const typographyScale: TypographySpecimen[] = [
  { className: 'text-display', label: 'Display', sample: 'PAG' },
  { className: 'text-heading-large', label: 'Heading large', sample: 'Grand titre' },
  { className: 'text-heading-medium', label: 'Heading medium', sample: 'Titre de section' },
  { className: 'text-heading-small', label: 'Heading small', sample: 'Titre éditorial' },
  { className: 'text-title-large', label: 'Title large', sample: 'Titre de projet' },
  { className: 'text-lead', label: 'Lead', sample: 'Une introduction claire et directe.' },
  { className: 'text-title-medium', label: 'Title medium', sample: 'Titre de composant' },
  { className: 'text-title-small', label: 'Title small', sample: 'Titre secondaire' },
  { className: 'text-body-large', label: 'Body large', sample: 'Un paragraphe mis en avant.' },
  { className: 'text-body', label: 'Body', sample: 'Le style de lecture principal.' },
  { className: 'text-body-alt', label: 'Body alt', sample: 'Le corps alternatif en Courier.' },
  { className: 'text-body-small', label: 'Body small', sample: 'Un texte compact et lisible.' },
  { className: 'text-overline', label: 'Overline', sample: 'Développeur front-end' },
  { className: 'text-caption', label: 'Caption', sample: 'Information secondaire' },
];
