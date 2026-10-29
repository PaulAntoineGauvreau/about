import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const projects = [
  ['atelier-du-corps', 'https://atelierducorps.ca/fr'],
  ['cosoltec', 'https://www.cosoltec.com/fr'],
  ['cegep-lanaudiere', 'https://cegep-lanaudiere.qc.ca/'],
  ['chia-love', 'https://chialove.com/'],
  ['pylex', 'https://pylex.com/'],
  ['mc-waterloo', 'https://mcwaterloo.com/'],
  ['accordeon-montmagny', 'https://accordeonmontmagny.com/'],
  ['humanify-360', 'https://humanify360.com/'],
  ['rollout-cycling', 'https://www.rolloutcycling.cc/'],
  ['venitiennes-83', 'https://v83.ca/'],
];

const requestedSlugs = new Set(process.argv.slice(2));
const selectedProjects = requestedSlugs.size > 0
  ? projects.filter(([slug]) => requestedSlugs.has(slug))
  : projects;

if (requestedSlugs.size > 0 && selectedProjects.length !== requestedSlugs.size) {
  const knownSlugs = new Set(projects.map(([slug]) => slug));
  const unknownSlugs = [...requestedSlugs].filter((slug) => !knownSlugs.has(slug));
  throw new Error(`Projet inconnu : ${unknownSlugs.join(', ')}`);
}

const outputDirectory = new URL('../src/assets/projects/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

const montereyChromium = join(
  homedir(),
  'Library/Caches/ms-playwright/chromium-1124/chrome-mac/Chromium.app/Contents/MacOS/Chromium',
);
const localExecutable = process.platform === 'darwin' && existsSync(montereyChromium) ? montereyChromium : undefined;
const browser = await chromium.launch(localExecutable ? { executablePath: localExecutable } : undefined);
const context = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
  locale: 'fr-CA',
  colorScheme: 'light',
});

for (const [slug, url] of selectedProjects) {
  const page = await context.newPage();
  console.log(`Capture de ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(500);
    const rejectButtons = page.getByRole('button', {
      name: /^(tout rejeter|rejeter|refuser|decline)$/i,
    });
    if (slug === 'venitiennes-83') {
      await rejectButtons.first().waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined);
    }
    for (let index = 0; index < (await rejectButtons.count()); index += 1) {
      const button = rejectButtons.nth(index);
      if (await button.isVisible().catch(() => false)) {
        await button.click({ timeout: 3_000 }).catch(() => undefined);
        break;
      }
    }
    await page.waitForTimeout(slug === 'pylex' ? 9_500 : slug === 'venitiennes-83' ? 12_000 : 4_500);
    await page.addStyleTag({
      content: '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
    });
    await page.screenshot({
      path: new URL(`${slug}.png`, outputDirectory).pathname,
      type: 'png',
      fullPage: false,
    });
  } catch (error) {
    console.error(`Échec de la capture ${slug}:`, error.message);
    process.exitCode = 1;
  } finally {
    await page.close();
  }
}

await browser.close();
