import { access, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.env.CV_PREVIEW_URL ?? 'http://127.0.0.1:4321';
const outputDirectory = resolve('public/cv');
const documents = [
  {
    route: '/cv/',
    filename: 'paul-antoine-gauvreau-cv-developpeur.pdf',
    screenScreenshot: '/tmp/paul-antoine-gauvreau-cv-developpeur-screen.png',
    screenshot: '/tmp/paul-antoine-gauvreau-cv-developpeur.png',
  },
  {
    route: '/cv/gestion-vente/',
    filename: 'paul-antoine-gauvreau-cv-gestion-vente.pdf',
    screenScreenshot: '/tmp/paul-antoine-gauvreau-cv-gestion-vente-screen.png',
    screenshot: '/tmp/paul-antoine-gauvreau-cv-gestion-vente.png',
  },
  {
    route: '/cv/ecommerce/',
    filename: 'paul-antoine-gauvreau-cv-ecommerce.pdf',
    screenScreenshot: '/tmp/paul-antoine-gauvreau-cv-ecommerce-screen.png',
    screenshot: '/tmp/paul-antoine-gauvreau-cv-ecommerce.png',
  },
];

await mkdir(outputDirectory, { recursive: true });

const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let executablePath;

try {
  await access(systemChrome);
  executablePath = systemChrome;
} catch {
  executablePath = undefined;
}

const browser = await chromium.launch({ headless: true, executablePath });

try {
  for (const document of documents) {
    const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
    await page.goto(new URL(document.route, baseUrl).href, { waitUntil: 'networkidle' });
    await page.screenshot({ path: document.screenScreenshot, fullPage: true });
    await page.emulateMedia({ media: 'print' });

    const report = await page.evaluate(() => {
      const cv = document.querySelector('[data-cv]');
      const controls = document.querySelector('[data-cv-actions]');
      const headings = Array.from(document.querySelectorAll('[data-cv] h2'), (heading) =>
        heading.textContent?.trim(),
      );

      return {
        documentHeightPx: cv?.getBoundingClientRect().height ?? 0,
        printableHeightPx: (11 - 0.4 * 2) * 96,
        controlsDisplay: controls ? getComputedStyle(controls).display : 'missing',
        headings,
      };
    });

    await page.pdf({
      path: resolve(outputDirectory, document.filename),
      format: 'Letter',
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: false,
      tagged: true,
      outline: true,
    });
    await page.screenshot({ path: document.screenshot, fullPage: true });
    await page.close();

    console.log(JSON.stringify({ file: document.filename, ...report }));
  }
} finally {
  await browser.close();
}
