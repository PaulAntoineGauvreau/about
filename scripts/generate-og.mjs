import sharp from 'sharp';

await sharp(new URL('../public/og-cover.svg', import.meta.url).pathname)
  .resize(1200, 630)
  .png({ compressionLevel: 9, palette: true })
  .toFile(new URL('../public/og-cover.png', import.meta.url).pathname);

console.log('Image Open Graph générée : public/og-cover.png (1200 × 630)');
