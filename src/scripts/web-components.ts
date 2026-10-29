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

type SpotifyEmbedController = {
  addListener: (event: string, callback: (event?: { data?: { isPaused?: boolean } }) => void) => void;
  destroy: () => void;
  loadEntity: (uri: string) => void;
  pause: () => void;
  play: () => void;
};

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { width: number; height: number; uri: string },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    spotifyIframeApi?: SpotifyIframeApi;
  }
}

let spotifyApiPromise: Promise<SpotifyIframeApi> | undefined;

function getSpotifyIframeApi() {
  if (window.spotifyIframeApi) return Promise.resolve(window.spotifyIframeApi);
  if (spotifyApiPromise) return spotifyApiPromise;

  spotifyApiPromise = new Promise((resolve) => {
    const previousCallback = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = (api) => {
      window.spotifyIframeApi = api;
      previousCallback?.(api);
      resolve(api);
    };

    if (!document.querySelector<HTMLScriptElement>('[data-spotify-iframe-api]')) {
      const script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      script.dataset.spotifyIframeApi = '';
      document.head.append(script);
    }
  });

  return spotifyApiPromise;
}

class SpotifyPreview extends HTMLElement {
  private controller?: AbortController;
  private embedController?: SpotifyEmbedController;
  private activeCard?: HTMLElement;
  private player?: HTMLElement;
  private firstUri?: string;
  private loadedUri?: string;
  private playerInitialized = false;
  private playerReady = false;
  private playerObserver?: MutationObserver;
  private preloadObserver?: IntersectionObserver;
  private preloadIdleCallback?: number;
  private preloadTimeout?: number;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();

    const cards = Array.from(this.querySelectorAll<HTMLElement>('[data-spotify-card][data-spotify-uri]'));
    const player = this.querySelector<HTMLElement>('[data-spotify-player]');
    const firstUri = cards[0]?.dataset.spotifyUri;
    if (!player || !firstUri) return;
    this.player = player;
    this.firstUri = firstUri;

    cards.forEach((card) => {
      const button = card.querySelector<HTMLButtonElement>('[data-spotify-toggle]');
      button?.addEventListener('click', () => this.toggle(card), { signal: this.controller?.signal });
    });

    const preparePlayer = () => this.initializePlayer();
    this.addEventListener('pointerenter', preparePlayer, { once: true, signal: this.controller.signal });
    this.addEventListener('focusin', preparePlayer, { once: true, signal: this.controller.signal });

    const scheduleIdlePreload = () => {
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      };
      if (idleWindow.requestIdleCallback) {
        this.preloadIdleCallback = idleWindow.requestIdleCallback(preparePlayer, { timeout: 4000 });
      } else {
        this.preloadTimeout = window.setTimeout(preparePlayer, 2500);
      }
    };

    if (document.readyState === 'complete') scheduleIdlePreload();
    else window.addEventListener('load', scheduleIdlePreload, { once: true, signal: this.controller.signal });

    if (typeof IntersectionObserver !== 'undefined') {
      this.preloadObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          this.preloadObserver?.disconnect();
          this.preloadObserver = undefined;
          this.initializePlayer();
        },
        { rootMargin: '75% 0px' },
      );
      this.preloadObserver.observe(this);
    } else {
      window.addEventListener('load', preparePlayer, { once: true, signal: this.controller.signal });
    }
  }

  private initializePlayer() {
    const player = this.player;
    const firstUri = this.firstUri;
    if (this.playerInitialized || !player || !firstUri) return;
    this.playerInitialized = true;

    const hidePlayerFrame = () => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe[src*="open.spotify.com/embed"]');
      iframe?.setAttribute('title', 'Lecteur Spotify masqué');
      iframe?.setAttribute('tabindex', '-1');
      iframe?.setAttribute('aria-hidden', 'true');
    };
    this.playerObserver?.disconnect();
    this.playerObserver = new MutationObserver(hidePlayerFrame);
    this.playerObserver.observe(document.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: ['src'] });

    void getSpotifyIframeApi().then((api) => {
      if (!this.isConnected) return;

      api.createController(player, { width: 152, height: 152, uri: firstUri }, (embedController) => {
        this.embedController = embedController;
        hidePlayerFrame();
        embedController.addListener('ready', () => {
          hidePlayerFrame();
          this.loadedUri = firstUri;
          this.playerReady = true;
          this.dataset.spotifyReady = '';
          if (this.activeCard) this.startPlayback(this.activeCard);
        });
        embedController.addListener('playback_update', (event) => {
          if (!this.activeCard || event?.data?.isPaused === undefined) return;
          this.setCardPlaybackState(this.activeCard, !event.data.isPaused);
        });
      });
    });
  }

  private toggle(card: HTMLElement) {
    if (this.activeCard === card && card.hasAttribute('data-playing')) {
      this.pause(card);
      return;
    }

    if (this.activeCard) this.pause(this.activeCard);

    this.activeCard = card;
    if (this.playerReady) {
      this.startPlayback(card);
    } else {
      this.initializePlayer();
    }
  }

  private startPlayback(card: HTMLElement) {
    const uri = card.dataset.spotifyUri;
    if (!uri || !this.embedController) return;

    this.querySelectorAll<HTMLElement>('[data-spotify-card]').forEach((item) => delete item.dataset.playing);
    if (this.loadedUri !== uri) {
      this.embedController.loadEntity(uri);
      this.loadedUri = uri;
    }
    this.embedController.play();
    this.setCardPlaybackState(card, true);

    const status = this.querySelector<HTMLElement>('[data-spotify-status]');
    if (status) status.textContent = `Lecture de ${card.textContent?.trim() ?? 'la chanson'}.`;
  }

  private pause(card: HTMLElement) {
    if (this.activeCard !== card) return;
    this.embedController?.pause();
    this.setCardPlaybackState(card, false);
    this.activeCard = undefined;

    const status = this.querySelector<HTMLElement>('[data-spotify-status]');
    if (status) status.textContent = 'Lecture en pause.';
  }

  private setCardPlaybackState(card: HTMLElement, playing: boolean) {
    const button = card.querySelector<HTMLButtonElement>('[data-spotify-toggle]');
    card.toggleAttribute('data-playing', playing);
    button?.setAttribute('aria-pressed', String(playing));
    const label = playing ? button?.dataset.pauseLabel : button?.dataset.playLabel;
    if (label) button?.setAttribute('aria-label', label);
  }

  disconnectedCallback() {
    this.controller?.abort();
    const idleWindow = window as Window & { cancelIdleCallback?: (handle: number) => void };
    if (this.preloadIdleCallback !== undefined) idleWindow.cancelIdleCallback?.(this.preloadIdleCallback);
    if (this.preloadTimeout !== undefined) window.clearTimeout(this.preloadTimeout);
    this.preloadIdleCallback = undefined;
    this.preloadTimeout = undefined;
    this.preloadObserver?.disconnect();
    this.preloadObserver = undefined;
    this.playerObserver?.disconnect();
    this.playerObserver = undefined;
    this.embedController?.destroy();
    this.embedController = undefined;
    this.player = undefined;
    this.firstUri = undefined;
    this.loadedUri = undefined;
    this.playerInitialized = false;
    this.playerReady = false;
    delete this.dataset.spotifyReady;
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
if (!customElements.get('spotify-preview')) customElements.define('spotify-preview', SpotifyPreview);
