import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('portfolio', () => {
  test('présente les huit projets et passe axe', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Paul-Antoine Gauvreau' })).toBeVisible();
    await expect(page.locator('[data-project-card]')).toHaveCount(8);
    await expect(page.locator('[data-music-group]').first().locator('[data-music-card]')).toHaveCount(9);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('filtre les projets avec le Web Component', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Headless' }).click();
    await expect(page.locator('[data-project-card]:visible')).toHaveCount(2);
    await expect(page.getByText('2 projets affichés.')).toBeAttached();
  });

  test('affiche la météo de Montréal et adapte le conseil vélo', async ({ page }) => {
    const weatherUrl = 'https://api.open-meteo.com/**';
    await page.route(weatherUrl, async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          current: {
            temperature_2m: 18.4,
            precipitation: 0,
            weather_code: 1,
            wind_speed_10m: 12,
            is_day: 1,
          },
        }),
      });
    });

    await page.goto('/');
    await expect(page.locator('[data-header-meta]')).toContainText("Aujourd'hui·Montréal, QC·18 °C · 🌤️ Partiellement nuageux. 🚴 Vélo extérieur");

    await page.unroute(weatherUrl);
    await page.route(weatherUrl, async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          current: {
            temperature_2m: -7,
            precipitation: 1.2,
            weather_code: 71,
            wind_speed_10m: 18,
            is_day: 1,
          },
        }),
      });
    });

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-header-meta]')).toContainText("Aujourd'hui·Montréal, QC·-7 °C · 🌨️ Neige. 🚴🏠 Vélo intérieur");
  });

  test('offre un lien d’évitement utilisable au clavier', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#contenu')).toBeFocused();
  });

  test('affiche le bouton Contact en accent puis en blanc au hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const contact = page.getByRole('link', { name: 'Contact', exact: true }).first();
    await expect(contact).toHaveCSS('background-color', 'rgb(255, 90, 61)');
    await contact.hover();
    await expect(contact).toHaveCSS('background-color', 'rgb(255, 255, 255)');
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
    await expect(page.locator('[data-method-stack]')).not.toHaveAttribute('data-enhanced', '');
    await expect(page.locator('[data-music-track]')).toHaveCSS('animation-name', 'none');
  });

  test('active Lenis et conserve les ancres internes', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/\blenis\b/);

    await page.getByRole('link', { name: 'Voir les projets' }).click();
    await expect(page).toHaveURL(/#projets$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test('anime les cartes méthode au scroll et masque les cartes arrière', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-method-card]')).toHaveCount(4);
    await expect(page.locator('[data-method-stack]')).toHaveAttribute('data-enhanced', '');
    await expect(page.locator('[data-method-stage]')).toHaveCSS('overflow', 'hidden');

    const stack = page.locator('[data-method-stack]');
    const stageHeight = await page.locator('[data-method-stage]').evaluate((element) => element.clientHeight);
    const settledBounds = await page.locator('[data-method-stage], [data-method-card]').evaluateAll(([stage, firstCard]) => {
      const stageRect = stage.getBoundingClientRect();
      const cardRect = firstCard.getBoundingClientRect();
      return {
        stageTop: stageRect.top,
        stageBottom: stageRect.bottom,
        cardTop: cardRect.top,
        cardBottom: cardRect.bottom,
      };
    });
    expect(settledBounds.cardTop).toBeGreaterThan(settledBounds.stageTop);
    expect(settledBounds.cardBottom).toBeLessThan(settledBounds.stageBottom);

    const secondCardInitialY = await page.locator('[data-method-card]').nth(1).evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42);
    expect(secondCardInitialY).toBeGreaterThan(stageHeight);
    expect(secondCardInitialY).toBeLessThanOrEqual(stageHeight + 25);

    await stack.scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(450);
    const firstOpacity = await page.locator('[data-method-card]').first().evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
    const secondCardScrolledY = await page.locator('[data-method-card]').nth(1).evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m42);
    expect(firstOpacity).toBeLessThan(1);
    expect(secondCardScrolledY).toBeLessThan(secondCardInitialY);
  });

  test('met le marquee musical en pause au survol', async ({ page }) => {
    await page.goto('/');
    const marquee = page.locator('[data-music-marquee]');
    const track = marquee.locator('[data-music-track]');
    await marquee.hover();
    await expect(track).toHaveCSS('animation-play-state', 'paused');
  });

  test('révèle Contact derrière la section Musique', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-page-panels]')).toHaveCSS('position', 'relative');
    await expect(page.locator('[data-page-panels]')).toHaveCSS('z-index', '10');
    await expect(page.locator('[data-contact-reveal]')).toHaveCSS('position', 'sticky');
    await expect(page.locator('[data-contact-reveal]')).toHaveCSS('bottom', '0px');
  });

  test('joue et met HOLIDAY en pause avec le bouton de la carte', async ({ page }) => {
    await page.route('https://open.spotify.com/embed/iframe-api/v1', async (route) => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `window.__spotifyCalls = [];
          window.onSpotifyIframeApiReady({
            createController: function (_element, options, callback) {
              var listeners = {};
              var controller = {
                addListener: function (event, listener) { listeners[event] = listener; if (event === 'ready') setTimeout(listener, 0); },
                destroy: function () {},
                loadEntity: function (uri) { window.__spotifyCalls.push(['load', uri]); },
                play: function () { window.__spotifyCalls.push(['play', options.uri]); },
                pause: function () { window.__spotifyCalls.push(['pause', options.uri]); }
              };
              callback(controller);
            }
          });`,
      });
    });

    await page.goto('/');
    const card = page.locator('[data-music-group]').first().locator('[data-spotify-card]').first();
    await expect(card).toContainText('Turnstile');
    await expect(card).toContainText('HOLIDAY');
    await expect(page.locator('[data-spotify-preview]')).toHaveAttribute('data-spotify-ready', '');

    const playButton = card.locator('[data-spotify-toggle]');
    await expect(playButton).toHaveAccessibleName('Lire HOLIDAY de Turnstile');
    await playButton.dispatchEvent('click');
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __spotifyCalls?: unknown[] }).__spotifyCalls?.some((call) => Array.isArray(call) && call[0] === 'play'))).toBe(true);
    await expect(playButton).toHaveAttribute('aria-pressed', 'true');

    await playButton.dispatchEvent('click');
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __spotifyCalls?: unknown[] }).__spotifyCalls?.some((call) => Array.isArray(call) && call[0] === 'pause'))).toBe(true);
    await expect(playButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('applique l’échelle typographique fluide et la mono à overline', async ({ page }) => {
    await page.goto('/');

    const readOverline = async (width: number) => {
      await page.setViewportSize({ width, height: 900 });

      return page.evaluate(() => {
        const sample = document.createElement('p');
        sample.className = 'font-mono text-fluid-overline font-bold uppercase';
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

  test('aligne Bonjour et Passionné sur la même colonne', async ({ page }) => {
    await page.goto('/');
    const starts = await page.locator('[data-hero-copy-start]').evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().left));
    expect(starts).toHaveLength(2);
    expect(starts[0]).toBeCloseTo(starts[1], 1);
  });

  test('ne rogne pas les premières lettres du nom', async ({ page }) => {
    await page.goto('/');
    const lineMasks = page.locator('[data-hero-line]').locator('..');
    await expect(lineMasks.first()).toHaveCSS('overflow', 'visible');
    await expect(lineMasks.last()).toHaveCSS('overflow', 'visible');
  });

  test('passe de la petite tablette au layout large à 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 1023, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-project-grid]')).toHaveCSS('grid-template-columns', '991px');

    await page.setViewportSize({ width: 1024, height: 900 });
    const desktopColumns = await page.locator('[data-project-grid]').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(desktopColumns).toBe(2);
  });

  test('aligne les cartes projet sur les dimensions Figma', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto('/');

    const firstCard = page.locator('[data-project-card]').first();
    await expect(firstCard.locator('picture img')).toHaveCSS('height', '180px');
    await expect(firstCard.getByRole('heading', { level: 3 })).toHaveCSS('font-size', '28px');

    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(firstCard).toHaveCSS('width', '688px');
    await expect(firstCard.locator('picture img')).toHaveCSS('height', '410px');
    const desktopTitleSize = await firstCard.getByRole('heading', { level: 3 }).evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    expect(desktopTitleSize).toBeCloseTo(60, 1);
    await expect(page.locator('[data-project-grid]')).toHaveCSS('column-gap', '32px');
  });

  test('passe les projets du noir et blanc à la couleur en expoOut sur 300ms', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const image = page.locator('[data-project-card]').first().locator('picture img');
    await expect(image).toHaveCSS('transition-duration', '0.3s');
    await expect(image).toHaveCSS('transition-timing-function', 'cubic-bezier(0.16, 1, 0.3, 1)');
    await expect(image).toHaveCSS('filter', 'grayscale(1)');

    await page.locator('[data-project-card]').first().hover();
    await page.waitForTimeout(350);
    await expect(image).toHaveCSS('scale', 'none');
    await expect(image).toHaveCSS('filter', 'grayscale(0)');
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
    await expect(page.getByText('.text-body-alt · Body alt', { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pagauvreau.com/typography/');

    const bodyAltFamily = await page.getByText('Le corps alternatif en Courier.', { exact: true }).evaluate((element) => getComputedStyle(element).fontFamily);
    expect(bodyAltFamily).toContain('Courier New');

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
    { width: 768, height: 1024 },
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
