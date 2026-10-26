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
];

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

for (const [slug, url] of projects) {
  const page = await context.newPage();
  console.log(`Capture de ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(4_000);
    const rejectButtons = page.getByRole('button', {
      name: /^(tout rejeter|rejeter|refuser|decline)$/i,
    });
    for (let index = 0; index < (await rejectButtons.count()); index += 1) {
      const button = rejectButtons.nth(index);
      if (await button.isVisible().catch(() => false)) {
        await button.click({ timeout: 3_000 }).catch(() => undefined);
        break;
      }
    }
    await page.waitForTimeout(slug === 'pylex' ? 6_000 : 1_000);
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
