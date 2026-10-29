export {};

class ProjectFilter extends HTMLElement {
  private controller?: AbortController;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.dataset.enhanced = '';

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
        },
        { signal: this.controller?.signal },
      );
    });
  }

  disconnectedCallback() {
    this.controller?.abort();
  }
}

class CopyEmail extends HTMLElement {
  private controller?: AbortController;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.dataset.enhanced = '';

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
      weather.hidden = false;
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
if (!customElements.get('copy-email')) customElements.define('copy-email', CopyEmail);
if (!customElements.get('montreal-weather')) customElements.define('montreal-weather', MontrealWeather);
if (!customElements.get('music-preview')) customElements.define('music-preview', MusicPreview);
