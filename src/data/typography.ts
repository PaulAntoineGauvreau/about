export interface TypographySpecimen {
  token: string;
  className: string;
  label: string;
  sample: string;
}

export const typographyScale: TypographySpecimen[] = [
  { token: 'text-display', className: 'font-sans text-fluid-display', label: 'Display', sample: 'PAG' },
  { token: 'text-heading-large', className: 'font-sans text-fluid-heading-large', label: 'Heading large', sample: 'Grand titre' },
  { token: 'text-heading-medium', className: 'font-sans text-fluid-heading-medium', label: 'Heading medium', sample: 'Titre de section' },
  { token: 'text-heading-small', className: 'font-sans text-fluid-heading-small', label: 'Heading small', sample: 'Titre éditorial' },
  { token: 'text-title-large', className: 'font-sans text-fluid-title-large', label: 'Title large', sample: 'Titre de projet' },
  { token: 'text-lead', className: 'font-sans text-fluid-lead', label: 'Lead', sample: 'Une introduction claire et directe.' },
  { token: 'text-title-medium', className: 'font-sans text-fluid-title-medium', label: 'Title medium', sample: 'Titre de composant' },
  { token: 'text-title-small', className: 'font-sans text-fluid-title-small', label: 'Title small', sample: 'Titre secondaire' },
  { token: 'text-body-large', className: 'font-sans text-fluid-body-large', label: 'Body large', sample: 'Un paragraphe mis en avant.' },
  { token: 'text-body', className: 'font-sans text-fluid-body', label: 'Body', sample: 'Le style de lecture principal.' },
  { token: 'text-body-alt', className: 'font-mono text-fluid-body', label: 'Body alt', sample: 'Le corps alternatif en Courier.' },
  { token: 'text-body-small', className: 'font-sans text-fluid-body-small', label: 'Body small', sample: 'Un texte compact et lisible.' },
  { token: 'text-overline', className: 'font-mono text-fluid-overline font-bold uppercase', label: 'Overline', sample: 'Développeur front-end' },
  { token: 'text-caption', className: 'font-mono text-fluid-caption', label: 'Caption', sample: 'Information secondaire' },
];
