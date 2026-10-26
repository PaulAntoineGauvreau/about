class ProjectFilter extends HTMLElement {
  private controller?: AbortController;

  connectedCallback() {
    this.controller?.abort();
    this.controller = new AbortController();
    this.dataset.enhanced = '';

    const buttons = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const cards = Array.from(this.querySelectorAll<HTMLElement>('[data-project-card]'));
    const status = this.querySelector<HTMLElement>('[data-filter-status]');

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

if (!customElements.get('project-filter')) customElements.define('project-filter', ProjectFilter);
if (!customElements.get('copy-email')) customElements.define('copy-email', CopyEmail);
