import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('portfolio', () => {
  test('présente les cinq projets et passe axe', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Paul-Antoine Gauvreau' })).toBeVisible();
    await expect(page.locator('[data-project-card]')).toHaveCount(5);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('filtre les projets avec le Web Component', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Headless' }).click();
    await expect(page.locator('[data-project-card]:visible')).toHaveCount(2);
    await expect(page.getByText('2 projets affichés.')).toBeAttached();
  });

  test('offre un lien d’évitement utilisable au clavier', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#contenu')).toBeFocused();
  });

  test('navigue vers le CV et replace le focus', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'CV', exact: true }).click();
    await page.waitForURL('**/cv/');
    await expect(page.getByRole('heading', { level: 1, name: 'Paul-Antoine Gauvreau' })).toBeFocused();
    await expect(page).toHaveTitle(/CV — Paul-Antoine Gauvreau/);
  });

  test('reste navigable sans JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    await page.getByRole('link', { name: 'CV', exact: true }).click();
    await expect(page).toHaveURL(/\/cv\/$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Paul-Antoine Gauvreau' })).toBeVisible();
    await context.close();
  });

  test('respecte la préférence de mouvement réduit', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const reduced = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    expect(reduced).toBe(true);
    await expect(page.locator('[data-hero-line]').first()).toBeVisible();
  });

  test('applique l’échelle typographique fluide et la mono à overline', async ({ page }) => {
    await page.goto('/');

    const readOverline = async (width: number) => {
      await page.setViewportSize({ width, height: 900 });

      return page.evaluate(() => {
        const sample = document.createElement('p');
        sample.className = 'text-overline';
        sample.textContent = 'Overline';
        document.body.append(sample);

        const styles = getComputedStyle(sample);
        const result = {
          fontFamily: styles.fontFamily,
          fontSize: Number.parseFloat(styles.fontSize),
          lineHeight: Number.parseFloat(styles.lineHeight),
          textTransform: styles.textTransform,
        };

        sample.remove();
        return result;
      });
    };

    const mobile = await readOverline(320);
    expect(mobile.fontSize).toBeCloseTo(12, 1);
    expect(mobile.lineHeight).toBeCloseTo(16, 1);

    const desktop = await readOverline(1440);
    expect(desktop.fontSize).toBeCloseTo(16, 1);
    expect(desktop.lineHeight).toBeCloseTo(20, 1);
    expect(desktop.fontFamily).toContain('Courier New');
    expect(desktop.textTransform).toBe('uppercase');
  });

  test('fournit les métadonnées SEO et les données structurées', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pagauvreau.com/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-cover\.png$/);

    const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
    expect(schema['@type']).toBe('Person');
    expect(schema.name).toBe('Paul-Antoine Gauvreau');
  });

  test('présente le système typographique complet', async ({ page }) => {
    await page.goto('/typography/');

    await expect(page.getByRole('heading', { level: 1, name: 'Typographie' })).toBeVisible();
    await expect(page.locator('main li')).toHaveCount(14);
    await expect(page.getByText('.text-overline · Overline', { exact: true })).toBeVisible();
    await expect(page.getByText('.text-display · Display', { exact: true })).toBeVisible();
    await expect(page.getByText('.text-mono-display · Mono display', { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pagauvreau.com/typography/');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);

    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow).toBe(false);
    }
  });

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    test(`ne déborde pas à ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(hasOverflow).toBe(false);
    });
  }

  test('adapte le CV à l’impression', async ({ page }) => {
    await page.goto('/cv/');
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('[data-site-header]')).toBeHidden();
    await expect(page.getByRole('heading', { level: 2, name: /Expériences de travail/ })).toBeVisible();
  });
});
