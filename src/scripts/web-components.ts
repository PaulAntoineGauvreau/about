export {};

type Gsap = typeof import('gsap')['gsap'];

const projectCardMotion = {
  offset: 48,
  duration: 0.65,
  stagger: 0.12,
  ease: 'power3.out',
  rowTolerance: 4,
} as const;

const heroTitleMotion = {
  delay: 0.35,
  opacityDuration: 0.9,
  scaleDuration: 1,
  stagger: 0.1,
  opacityEase: 'power1.out',
  scaleEase: 'back.out(1.8)',
} as const;

async function animateHeroIntro() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const headerItems = Array.from(document.querySelectorAll<HTMLElement>('[data-site-header] > [data-hero-appear]'));
  const words = title ? Array.from(title.querySelectorAll<HTMLElement>('[data-hero-title-word]')) : [];
  const copy = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-copy]'));
  const items = [...headerItems, ...words, ...copy];
  if (items.length === 0) return;

  try {
    const { gsap } = await import('gsap');
    gsap.set(items, { transformOrigin: '50% 50%' });
    const timeline = gsap.timeline({
      delay: heroTitleMotion.delay,
      onComplete: () => {
        items.forEach((item) => {
          item.dataset.heroAppearVisible = '';
        });
        gsap.set(items, { clearProps: 'opacity,visibility,transform,transformOrigin,willChange' });
      },
    });

    const animateGroup = (group: HTMLElement[], position: number) => {
      if (group.length === 0) return;
      timeline
        .fromTo(
          group,
          { opacity: 0 },
          {
            opacity: 1,
            duration: heroTitleMotion.opacityDuration,
            ease: heroTitleMotion.opacityEase,
            stagger: heroTitleMotion.stagger,
          },
          position,
        )
        .fromTo(
          group,
          { scale: 0.8 },
          {
            scale: 1,
            duration: heroTitleMotion.scaleDuration,
            ease: heroTitleMotion.scaleEase,
            stagger: heroTitleMotion.stagger,
            force3D: true,
          },
          position,
        );
    };

    animateGroup(headerItems, 0);
    animateGroup(words, 0.12);
    animateGroup(copy, 0.3);
  } catch {
    items.forEach((item) => {
      item.dataset.heroAppearVisible = '';
      item.style.opacity = '1';
      item.style.transform = 'none';
      item.style.willChange = 'auto';
    });
  }
}

void animateHeroIntro();

function getRenderedTextLines(element: HTMLElement) {
  const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return [];

  element.textContent = text;
  const textNode = element.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return [text];

  const range = document.createRange();
  const renderedLines: Array<{ text: string; top: number }> = [];

  for (let start = 0; start < text.length;) {
    const character = String.fromCodePoint(text.codePointAt(start) ?? 0);
    const end = start + character.length;
    range.setStart(textNode, start);
    range.setEnd(textNode, end);
    const rect = Array.from(range.getClientRects()).find((candidate) => candidate.width > 0 || candidate.height > 0);

    if (rect) {
      const currentLine = renderedLines.at(-1);
      if (!currentLine || Math.abs(currentLine.top - rect.top) > 1) {
        renderedLines.push({ text: character, top: rect.top });
      } else {
        currentLine.text += character;
      }
    }
    start = end;
  }

  return renderedLines.map((line) => line.text.trim()).filter(Boolean);
}

class ProjectRoleHighlight extends HTMLElement {
  private resizeObserver?: ResizeObserver;
  private animationFrame?: number;
  private sourceText = '';
  private renderedWidth = 0;

  async connectedCallback() {
    const role = this.querySelector<HTMLElement>('[data-project-role]');
    if (!role) return;

    this.sourceText = (role.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!this.sourceText) return;

    if ('fonts' in document) await document.fonts.ready;
    if (!this.isConnected) return;

    this.renderLines(role);
    if (typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      if (width <= 0 || Math.abs(width - this.renderedWidth) < 1) return;
      if (this.animationFrame !== undefined) window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = window.requestAnimationFrame(() => {
        this.animationFrame = undefined;
        this.renderLines(role);
      });
    });
    this.resizeObserver.observe(role);
  }

  private renderLines(role: HTMLElement) {
    role.textContent = this.sourceText;
    this.renderedWidth = role.getBoundingClientRect().width;
    if (this.renderedWidth <= 0) return;

    const lines = getRenderedTextLines(role);
    if (lines.length === 0) return;

    const accessibleText = document.createElement('span');
    accessibleText.className = 'sr-only';
    accessibleText.textContent = this.sourceText;
    role.replaceChildren(accessibleText);
    lines.forEach((line, index) => {
      const visualLine = document.createElement('span');
      visualLine.className = '_project-role-line';
      visualLine.textContent = line;
      visualLine.setAttribute('aria-hidden', 'true');
      visualLine.style.setProperty('--pag-project-role-enter-delay', `${index * 110}ms`);
      visualLine.style.setProperty('--pag-project-role-exit-delay', `${(lines.length - index - 1) * 90}ms`);
      role.append(visualLine);
      if (index < lines.length - 1) role.append(document.createElement('br'));
    });
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    if (this.animationFrame !== undefined) window.cancelAnimationFrame(this.animationFrame);
    this.resizeObserver = undefined;
    this.animationFrame = undefined;
  }
}

class ClipLineReveal extends HTMLElement {
  private observer?: IntersectionObserver;
  private gsap?: Gsap;
  private originalContent = new Map<HTMLElement, Node[]>();

  connectedCallback() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (typeof IntersectionObserver === 'undefined') {
      this.reveal();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        this.observer?.disconnect();
        this.observer = undefined;
        this.reveal();
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    );
    this.observer.observe(this);
  }

  private splitRenderedLines(element: HTMLElement) {
    const originalNodes = Array.from(element.childNodes, (node) => node.cloneNode(true));
    this.originalContent.set(element, originalNodes);
    const originalText = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
    const width = element.getBoundingClientRect().width;
    const renderedLines = getRenderedTextLines(element);

    element.replaceChildren();
    element.style.width = `${width}px`;
    element.setAttribute('aria-label', originalText);

    return renderedLines.map((line) => {
      const clip = document.createElement('span');
      const inner = document.createElement('span');
      clip.className = '_reveal-clip-line';
      clip.setAttribute('aria-hidden', 'true');
      inner.className = '_reveal-clip-line-inner';
      inner.textContent = line;
      clip.append(inner);
      element.append(clip);
      return inner;
    });
  }

  private restoreContent() {
    this.originalContent.forEach((nodes, element) => {
      element.replaceChildren(...nodes.map((node) => node.cloneNode(true)));
      element.style.removeProperty('width');
      element.removeAttribute('aria-label');
    });
    this.originalContent.clear();
  }

  private async reveal() {
    const elements = Array.from(this.querySelectorAll<HTMLElement>('[data-clip-reveal-line]'));
    if (elements.length === 0) return;

    try {
      const [{ gsap }] = await Promise.all([
        import('gsap'),
        'fonts' in document ? document.fonts.ready : Promise.resolve(),
      ]);
      if (!this.isConnected) return;
      this.gsap = gsap;
      const lines = elements.flatMap((element) => this.splitRenderedLines(element));
      const borders = Array.from(this.querySelectorAll<HTMLElement>('[data-clip-reveal-border]'));
      if (lines.length === 0) {
        this.dataset.clipRevealed = '';
        this.restoreContent();
        return;
      }

      const textStagger = Number.parseFloat(this.dataset.clipStagger ?? '0.18');
      const borderStagger = Number.parseFloat(this.dataset.clipBorderStagger ?? '0.16');
      this.dataset.clipReady = '';
      const timeline = gsap.timeline({
        onComplete: () => {
          this.dataset.clipRevealed = '';
          delete this.dataset.clipReady;
          gsap.set(borders, { clearProps: 'transform,willChange' });
          this.restoreContent();
        },
      });

      if (borders.length > 0) {
        timeline.fromTo(
          borders,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'expo.out',
            stagger: borderStagger,
            force3D: true,
          },
          0,
        );
      }

      timeline.fromTo(
        lines,
        { yPercent: 110, y: 2 },
        {
          yPercent: 0,
          y: 0,
          duration: 1.8,
          ease: 'expo.out',
          stagger: textStagger,
          force3D: true,
        },
        borders.length > 0 ? 0.12 : 0,
      );
    } catch {
      this.dataset.clipRevealed = '';
      delete this.dataset.clipReady;
      this.querySelectorAll<HTMLElement>('[data-clip-reveal-border]').forEach((border) => {
        border.style.transform = 'none';
        border.style.willChange = 'auto';
      });
      this.restoreContent();
    }
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    const lines = Array.from(this.querySelectorAll<HTMLElement>('._reveal-clip-line-inner'));
    const borders = Array.from(this.querySelectorAll<HTMLElement>('[data-clip-reveal-border]'));
    this.gsap?.killTweensOf([...lines, ...borders]);
    this.gsap?.set(borders, { clearProps: 'transform,willChange' });
    this.restoreContent();
    this.observer = undefined;
    this.gsap = undefined;
  }
}

class ProjectFilter extends HTMLElement {
  private controller?: AbortController;
  private motionLoaderObserver?: IntersectionObserver;
  private cardObserver?: IntersectionObserver;
  private animationFrame?: number;
  private gsap?: Gsap;
  private pendingCards = new Set<HTMLElement>();
  private motionReady?: Promise<void>;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const buttons = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const cards = Array.from(this.querySelectorAll<HTMLElement>('[data-project-card]'));
    const status = this.querySelector<HTMLElement>('[data-filter-status]');
    const controls = this.querySelector<HTMLElement>('[data-filter-controls]');
    controls?.classList.remove('hidden');
    controls?.classList.add('flex');

    buttons.forEach((button) => {
      button.addEventListener(
        'click',
        () => {
          const filter = button.dataset.filter ?? 'all';
          let visibleCount = 0;

          buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
          cards.forEach((card) => {
            const visible = filter === 'all' || card.dataset.category === filter;
            card.hidden = !visible;
            if (visible) visibleCount += 1;
          });

          if (status) {
            status.textContent = `${visibleCount} projet${visibleCount > 1 ? 's' : ''} affiché${visibleCount > 1 ? 's' : ''}.`;
          }

          void this.motionReady?.then(() => {
            this.animateFilteredCards(cards.filter((card) => !card.hidden));
          });
        },
        { signal: this.controller?.signal },
      );
    });

    this.motionReady = this.setupCardMotionWhenNear(cards);
  }

  private setupCardMotionWhenNear(cards: HTMLElement[]) {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return this.setupCardMotion(cards);
    }

    return new Promise<void>((resolve) => {
      this.motionLoaderObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.motionLoaderObserver?.disconnect();
          this.motionLoaderObserver = undefined;
          void this.setupCardMotion(cards).finally(resolve);
        },
        { rootMargin: '50% 0px' },
      );
      this.motionLoaderObserver.observe(this);
    });
  }

  private async setupCardMotion(cards: HTMLElement[]) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      const { gsap } = await import('gsap');
      if (!this.isConnected) return;
      this.gsap = gsap;
    } catch {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.animateRows(cards);
      return;
    }

    this.cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
          if (!entry.isIntersecting || card.hidden) return;
          this.cardObserver?.unobserve(card);
          this.pendingCards.add(card);
        });
        this.schedulePendingAnimation();
      },
      { threshold: 0.16 },
    );

    cards.forEach((card) => this.prepareCard(card));
  }

  private prepareCard(card: HTMLElement) {
    if (!this.gsap || card.hidden) return;
    this.gsap.set(card, { autoAlpha: 0, y: projectCardMotion.offset });
    this.cardObserver?.observe(card);
  }

  private schedulePendingAnimation() {
    if (this.animationFrame !== undefined || this.pendingCards.size === 0) return;

    this.animationFrame = window.requestAnimationFrame(() => {
      this.animationFrame = undefined;
      const cards = Array.from(this.pendingCards);
      this.pendingCards.clear();
      this.animateRows(cards);
    });
  }

  private animateFilteredCards(cards: HTMLElement[]) {
    const gsap = this.gsap;
    if (!gsap) return;

    this.pendingCards.clear();
    cards.forEach((card) => {
      this.cardObserver?.unobserve(card);
      gsap.killTweensOf(card);
    });

    if (this.animationFrame !== undefined) window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = window.requestAnimationFrame(() => {
      this.animationFrame = undefined;
      const viewportCards: HTMLElement[] = [];

      cards.forEach((card) => {
        const bounds = card.getBoundingClientRect();
        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          viewportCards.push(card);
        } else {
          this.prepareCard(card);
        }
      });

      this.animateRows(viewportCards);
    });
  }

  private animateRows(cards: HTMLElement[]) {
    const gsap = this.gsap;
    if (!gsap || cards.length === 0) return;

    const measurements = cards
      .map((card) => ({ card, top: card.getBoundingClientRect().top }))
      .sort((a, b) => a.top - b.top);
    const rows: Array<{ top: number; cards: HTMLElement[] }> = [];

    measurements.forEach(({ card, top }) => {
      const row = rows.find((candidate) => Math.abs(candidate.top - top) <= projectCardMotion.rowTolerance);
      if (row) row.cards.push(card);
      else rows.push({ top, cards: [card] });
    });

    rows.forEach((row) => {
      gsap.fromTo(
        row.cards,
        { autoAlpha: 0, y: projectCardMotion.offset },
        {
          autoAlpha: 1,
          y: 0,
          duration: projectCardMotion.duration,
          ease: projectCardMotion.ease,
          stagger: projectCardMotion.stagger,
          overwrite: 'auto',
          clearProps: 'opacity,visibility,transform',
        },
      );
    });
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.motionLoaderObserver?.disconnect();
    this.cardObserver?.disconnect();
    this.pendingCards.clear();
    if (this.animationFrame !== undefined) window.cancelAnimationFrame(this.animationFrame);
    if (this.gsap) {
      const cards = Array.from(this.querySelectorAll<HTMLElement>('[data-project-card]'));
      this.gsap.killTweensOf(cards);
      this.gsap.set(cards, { clearProps: 'opacity,visibility,transform' });
    }
    this.motionLoaderObserver = undefined;
    this.cardObserver = undefined;
    this.animationFrame = undefined;
    this.gsap = undefined;
    this.motionReady = undefined;
  }
}

class CopyEmail extends HTMLElement {
  private controller?: AbortController;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    const button = this.querySelector<HTMLButtonElement>('[data-copy-button]');
    const status = this.querySelector<HTMLElement>('[data-copy-status]');
    const email = this.dataset.email;
    button?.classList.remove('hidden');

    button?.addEventListener(
      'click',
      async () => {
        if (!email) return;

        try {
          await navigator.clipboard.writeText(email);
        } catch {
          if (status) status.textContent = 'La copie automatique est indisponible. Utilisez le lien courriel.';
          return;
        }

        if (status) status.textContent = 'Adresse courriel copiée.';
        const originalLabel = button.textContent;
        button.textContent = 'Copiée ✓';
        window.setTimeout(() => {
          button.textContent = originalLabel;
          if (status) status.textContent = '';
        }, 2200);
      },
      { signal: this.controller?.signal },
    );
  }

  disconnectedCallback() {
    this.controller?.abort();
  }
}

class MusicPreview extends HTMLElement {
  private controller?: AbortController;
  private player?: HTMLAudioElement;
  private activeCard?: HTMLElement;
  private preloadObserver?: IntersectionObserver;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();

    const player = this.querySelector<HTMLAudioElement>('[data-music-player]');
    const cards = Array.from(this.querySelectorAll<HTMLElement>('[data-music-card][data-preview-url]'));
    if (!player || cards.length === 0) return;
    this.player = player;

    cards.forEach((card) => {
      const button = card.querySelector<HTMLButtonElement>('[data-music-toggle]');
      button?.addEventListener('click', () => this.toggle(card), { signal: this.controller?.signal });
      card.addEventListener('pointerenter', () => this.prepare(card), { signal: this.controller?.signal });
      card.addEventListener('focusin', () => this.prepare(card), { signal: this.controller?.signal });
    });

    player.addEventListener('play', () => this.handlePlay(), { signal: this.controller.signal });
    player.addEventListener('pause', () => this.handlePause(), { signal: this.controller.signal });
    player.addEventListener('ended', () => this.handleEnded(), { signal: this.controller.signal });
    player.addEventListener('error', () => this.handleError(), { signal: this.controller.signal });

    if (typeof IntersectionObserver !== 'undefined') {
      this.preloadObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.preloadObserver?.disconnect();
          this.preloadObserver = undefined;
          this.prepare(cards[0]);
        },
        { rootMargin: '75% 0px' },
      );
      this.preloadObserver.observe(this);
    }
  }

  private prepare(card: HTMLElement) {
    const player = this.player;
    const previewUrl = card.dataset.previewUrl;
    if (!player || !previewUrl || (!player.paused && this.activeCard)) return;
    if (player.dataset.previewUrl === previewUrl) return;

    player.preload = 'metadata';
    player.src = previewUrl;
    player.dataset.previewUrl = previewUrl;
    player.load();
  }

  private toggle(card: HTMLElement) {
    const player = this.player;
    const previewUrl = card.dataset.previewUrl;
    if (!player || !previewUrl) return;

    if (this.activeCard === card && !player.paused) {
      player.pause();
      return;
    }

    const changingTrack = player.dataset.previewUrl !== previewUrl;
    if (this.activeCard && this.activeCard !== card) this.setCardPlaybackState(this.activeCard, false);
    this.activeCard = card;

    if (changingTrack) {
      player.preload = 'auto';
      player.src = previewUrl;
      player.dataset.previewUrl = previewUrl;
      player.load();
    }

    const status = this.querySelector<HTMLElement>('[data-music-status]');
    if (status) status.textContent = `Chargement de ${card.textContent?.trim() ?? 'la chanson'}.`;

    void player.play().catch(() => this.handleError());
  }

  private handlePlay() {
    if (!this.activeCard) return;
    this.setCardPlaybackState(this.activeCard, true);
    const status = this.querySelector<HTMLElement>('[data-music-status]');
    if (status) status.textContent = `Lecture de ${this.activeCard.textContent?.trim() ?? 'la chanson'}.`;
  }

  private handlePause() {
    if (!this.activeCard || this.player?.ended) return;
    this.setCardPlaybackState(this.activeCard, false);
    const status = this.querySelector<HTMLElement>('[data-music-status]');
    if (status) status.textContent = 'Lecture en pause.';
  }

  private handleEnded() {
    if (this.activeCard) this.setCardPlaybackState(this.activeCard, false);
    this.activeCard = undefined;
    const status = this.querySelector<HTMLElement>('[data-music-status]');
    if (status) status.textContent = 'Extrait terminé.';
  }

  private handleError() {
    if (this.activeCard) this.setCardPlaybackState(this.activeCard, false);
    this.activeCard = undefined;
    const status = this.querySelector<HTMLElement>('[data-music-status]');
    if (status) status.textContent = 'Cet extrait audio est temporairement indisponible.';
  }

  private setCardPlaybackState(card: HTMLElement, playing: boolean) {
    this.querySelectorAll<HTMLElement>('[data-music-card]').forEach((item) => {
      if (item !== card) delete item.dataset.playing;
    });
    const button = card.querySelector<HTMLButtonElement>('[data-music-toggle]');
    card.toggleAttribute('data-playing', playing);
    button?.setAttribute('aria-pressed', String(playing));
    const label = playing ? button?.dataset.pauseLabel : button?.dataset.playLabel;
    if (label) button?.setAttribute('aria-label', label);
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.preloadObserver?.disconnect();
    this.preloadObserver = undefined;
    this.player?.pause();
    this.player?.removeAttribute('src');
    this.player?.load();
    this.player = undefined;
    this.activeCard = undefined;
  }
}

type MontrealWeatherResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    is_day?: number;
  };
};

const getWeatherCondition = (code: number, isDay: boolean) => {
  if (code === 0) return { icon: isDay ? '☀️' : '🌙', label: 'Ciel dégagé' };
  if (code <= 2) return { icon: isDay ? '🌤️' : '☁️', label: 'Partiellement nuageux' };
  if (code === 3) return { icon: '☁️', label: 'Nuageux' };
  if (code === 45 || code === 48) return { icon: '🌫️', label: 'Brouillard' };
  if (code >= 51 && code <= 57) return { icon: '🌦️', label: 'Bruine' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { icon: '🌧️', label: 'Pluie' };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { icon: '🌨️', label: 'Neige' };
  if (code >= 95) return { icon: '⛈️', label: 'Orage' };
  return { icon: '🌡️', label: 'Conditions météo' };
};

class MontrealWeather extends HTMLElement {
  private controller?: AbortController;
  private idleCallback?: number;
  private fallbackTimeout?: number;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();

    const scheduleWeather = () => {
      if (!this.isConnected) return;
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      };

      if (idleWindow.requestIdleCallback) {
        this.idleCallback = idleWindow.requestIdleCallback(() => void this.loadWeather(), { timeout: 3000 });
      } else {
        this.fallbackTimeout = window.setTimeout(() => void this.loadWeather(), 1500);
      }
    };

    if (document.readyState === 'complete') {
      scheduleWeather();
    } else {
      window.addEventListener('load', scheduleWeather, { once: true, signal: this.controller.signal });
    }
  }

  private async loadWeather() {
    const weather = this.querySelector<HTMLElement>('[data-weather]');
    const temperature = this.querySelector<HTMLElement>('[data-temperature]');
    const weatherIcon = this.querySelector<HTMLElement>('[data-weather-icon]');
    const weatherLabel = this.querySelector<HTMLElement>('[data-weather-label]');
    const bike = this.querySelector<HTMLElement>('[data-bike]');
    const bikeLabel = this.querySelector<HTMLElement>('[data-bike-label]');

    if (!weather || !temperature || !weatherIcon || !weatherLabel || !bike || !bikeLabel) return;

    try {
      const parameters = new URLSearchParams({
        latitude: '45.5019',
        longitude: '-73.5674',
        current: 'temperature_2m,weather_code,is_day',
        timezone: 'America/Toronto',
      });
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`, {
        signal: this.controller?.signal,
      });

      if (!response.ok) throw new Error('Weather request failed');

      const data = (await response.json()) as MontrealWeatherResponse;
      const current = data.current;
      if (
        typeof current?.temperature_2m !== 'number' ||
        typeof current.weather_code !== 'number'
      ) return;

      const isSnowing =
        (current.weather_code >= 71 && current.weather_code <= 77) ||
        (current.weather_code >= 85 && current.weather_code <= 86);
      const condition = getWeatherCondition(current.weather_code, current.is_day !== 0);

      temperature.textContent = `${new Intl.NumberFormat('fr-CA', { maximumFractionDigits: 0 }).format(current.temperature_2m)} °C`;
      weatherIcon.textContent = condition.icon;
      weatherLabel.textContent = ` ${condition.label}.`;
      bike.textContent = isSnowing ? '⛷️' : '🚴';
      bikeLabel.textContent = isSnowing ? ' Ski alpin' : ' Vélo';
      weather.setAttribute('aria-busy', 'false');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      temperature.textContent = '-- °C';
      weatherIcon.textContent = '🌡️';
      weatherLabel.textContent = ' Météo indisponible.';
      bike.textContent = '🚴';
      bikeLabel.textContent = ' Vélo';
      weather.setAttribute('aria-busy', 'false');
    }
  }

  disconnectedCallback() {
    this.controller?.abort();
    const idleWindow = window as Window & { cancelIdleCallback?: (handle: number) => void };
    if (this.idleCallback !== undefined) idleWindow.cancelIdleCallback?.(this.idleCallback);
    if (this.fallbackTimeout !== undefined) window.clearTimeout(this.fallbackTimeout);
  }
}

if (!customElements.get('project-filter')) customElements.define('project-filter', ProjectFilter);
if (!customElements.get('project-role-highlight')) customElements.define('project-role-highlight', ProjectRoleHighlight);
if (!customElements.get('clip-line-reveal')) customElements.define('clip-line-reveal', ClipLineReveal);
if (!customElements.get('copy-email')) customElements.define('copy-email', CopyEmail);
if (!customElements.get('montreal-weather')) customElements.define('montreal-weather', MontrealWeather);
if (!customElements.get('music-preview')) customElements.define('music-preview', MusicPreview);
