document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-navigation');

if (menuButton && navigation) {
  const closeMenu = ({ returnFocus = false } = {}) => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      closeMenu({ returnFocus: true });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) {
      closeMenu();
    }
  });
}

window.LLSG = window.LLSG || {};

function showComponentError(container, message) {
  const notice = document.createElement('p');
  notice.className = 'component-error';
  notice.setAttribute('role', 'status');
  notice.textContent = message;
  container.prepend(notice);
}

function initEvidenceFilters(root = document) {
  root.querySelectorAll('[data-evidence-filter]:not([data-ready])').forEach(filter => {
    filter.dataset.ready = 'true';
    const input = filter.querySelector('[data-evidence-query]');
    const buttons = Array.from(filter.querySelectorAll('[data-filter]'));
    const grid = root.querySelector('[data-evidence-grid]');
    const empty = root.querySelector('[data-filter-empty]');
    if (!grid || !input) return;

    let active = 'all';
    const update = () => {
      const query = input.value.trim().toLocaleLowerCase('de');
      let visible = 0;
      grid.querySelectorAll('[data-tags]').forEach(card => {
        const haystack = `${card.dataset.tags} ${card.textContent}`.toLocaleLowerCase('de');
        const matches = (active === 'all' || haystack.includes(active)) && (!query || haystack.includes(query));
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (empty) empty.hidden = visible !== 0;
    };

    input.addEventListener('input', update);
    buttons.forEach(button => button.addEventListener('click', () => {
      active = button.dataset.filter;
      buttons.forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      update();
    }));
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    update();
  });
}

function initXRay(root = document) {
  root.querySelectorAll('[data-xray]:not([data-ready])').forEach(xray => {
    const dataNode = xray.querySelector('[data-xray-data]');
    const evidenceNode = xray.querySelector('[data-xray-evidence-data]');
    if (!dataNode) return;
    let steps;
    try { steps = JSON.parse(dataNode.dataset.xrayData || '[]'); } catch { showComponentError(xray, 'Die Prozessdaten konnten nicht geladen werden. Die statische Ablaufbeschreibung bleibt verfügbar.'); return; }
    if (!Array.isArray(steps) || !steps.length) { showComponentError(xray, 'Für diese Prozessansicht liegen derzeit keine gültigen Schritte vor.'); return; }
    let evidenceItems = [];
    try { evidenceItems = evidenceNode ? JSON.parse(evidenceNode.dataset.xrayEvidenceData || '[]') : []; } catch { evidenceItems = []; }
    const evidenceById = new Map(evidenceItems.map(item => [item.id, item]));
    xray.dataset.ready = 'true';

    const progress = xray.querySelector('[data-xray-steps]');
    const viewButtons = Array.from(xray.querySelectorAll('[data-view]'));
    const number = xray.querySelector('[data-xray-number]');
    const status = xray.querySelector('[data-xray-status]');
    const title = xray.querySelector('[data-xray-title]');
    const content = xray.querySelector('[data-xray-content]');
    const story = xray.querySelector('[data-xray-story]');
    let activeStep = 0;
    let activeView = 'business';

    const xrayId = xray.id || `xray-${Math.random().toString(36).slice(2, 9)}`;
    xray.id = xrayId;
    const panelId = `${xrayId}-panel`;
    const viewLabels = { business: 'Business', sap: 'SAP X-Ray', proof: 'Proof' };
    content.id = panelId;
    content.setAttribute('role', 'tabpanel');
    content.tabIndex = 0;

    const moveTab = (buttons, currentIndex, key) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return null;
      if (key === 'Home') return 0;
      if (key === 'End') return buttons.length - 1;
      return (currentIndex + (key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    };

    const stepButtons = steps.map((step, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'xray-step';
      button.setAttribute('role', 'tab');
      button.id = `${xrayId}-step-${index}`;
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-selected', String(index === activeStep));
      button.tabIndex = index === activeStep ? 0 : -1;
      button.setAttribute('aria-label', `Schritt ${step.number}: ${step.title}`);
      button.textContent = step.number;
      button.addEventListener('click', () => { activeStep = index; render(); });
      progress.append(button);
      return button;
    });

    const render = () => {
      const step = steps[activeStep];
      const proof = evidenceById.get(step.proof);
      stepButtons.forEach((button, index) => {
        const selected = index === activeStep;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      viewButtons.forEach(button => {
        const selected = button.dataset.view === activeView;
        button.setAttribute('aria-selected', String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      number.textContent = step.number;
      status.textContent = step.status;
      title.textContent = step.title;
      story.textContent = step.story;
      content.replaceChildren();
      const heading = document.createElement('h3');
      if (activeView === 'business') {
        heading.textContent = 'Was geschieht fachlich?';
        const paragraph = document.createElement('p');
        paragraph.textContent = step.business;
        content.append(heading, paragraph);
      } else if (activeView === 'sap') {
        heading.textContent = 'Was geschieht in SAP?';
        const paragraph = document.createElement('p');
        paragraph.textContent = step.sap;
        const details = document.createElement('dl');
        [['Module', step.modules], ['Objekte', step.objects]].forEach(([term, value]) => {
          const dt = document.createElement('dt'); dt.textContent = term;
          const dd = document.createElement('dd'); dd.textContent = value;
          details.append(dt, dd);
        });
        content.append(heading, paragraph, details);
      } else {
        heading.textContent = 'Wie wird der Schritt belegt?';
        const details = document.createElement('dl');
        [['Evidence-ID', step.proof], ['Nachweisstatus', proof?.evidenceStatus || 'Nicht veröffentlicht']].forEach(([term, value]) => {
          const dt = document.createElement('dt'); dt.textContent = term;
          const dd = document.createElement('dd'); dd.textContent = value;
          details.append(dt, dd);
        });
        const paragraph = document.createElement('p');
        paragraph.textContent = proof?.claim || 'Für diesen Schritt ist noch keine Evidence-Aussage hinterlegt.';
        content.append(heading, details, paragraph);
      }
      content.setAttribute('aria-labelledby', `${stepButtons[activeStep].id} ${xrayId}-view-${activeView}`);
    };

    viewButtons.forEach(button => {
      button.id = `${xrayId}-view-${button.dataset.view}`;
      button.setAttribute('aria-controls', panelId);
      button.addEventListener('click', () => { activeView = button.dataset.view; render(); });
    });
    xray.querySelector('.xray-toolbar')?.addEventListener('keydown', event => {
      const currentIndex = viewButtons.findIndex(button => button.dataset.view === activeView);
      const nextIndex = moveTab(viewButtons, currentIndex, event.key);
      if (nextIndex === null) return;
      event.preventDefault();
      activeView = viewButtons[nextIndex].dataset.view;
      viewButtons[nextIndex].focus();
      render();
    });
    progress.addEventListener('keydown', event => {
      const nextIndex = moveTab(stepButtons, activeStep, event.key);
      if (nextIndex === null) return;
      event.preventDefault();
      activeStep = nextIndex;
      stepButtons[activeStep].focus();
      render();
    });
    render();
  });
}

function initSiteSearch(root = document) {
  root.querySelectorAll('[data-site-search]:not([data-ready])').forEach(search => {
    const dataNode = search.querySelector('[data-search-data]');
    if (!dataNode) return;
    let items;
    try { items = JSON.parse(dataNode.dataset.searchData || '[]'); } catch { showComponentError(search, 'Die Suche konnte nicht geladen werden. Bitte nutze die Hauptnavigation.'); return; }
    if (!Array.isArray(items)) { showComponentError(search, 'Die Suche enthält keine gültigen Einträge. Bitte nutze die Hauptnavigation.'); return; }
    search.dataset.ready = 'true';
    const input = search.querySelector('[data-search-input]');
    const clear = search.querySelector('[data-search-clear]');
    const results = search.querySelector('[data-search-results]');
    const summary = search.querySelector('[data-search-summary]');

    const render = () => {
      const query = input.value.trim().toLocaleLowerCase('de');
      const filtered = items.filter(item => !query || `${item.title} ${item.type} ${item.text}`.toLocaleLowerCase('de').includes(query));
      summary.textContent = query ? `${filtered.length} Treffer für „${input.value.trim()}“` : `${filtered.length} vorbereitete Inhalte`;
      results.replaceChildren(...filtered.map(item => {
        const link = document.createElement('a');
        link.className = 'search-result';
        link.href = document.querySelector('template[data-route]') ? `#${item.url}` : `${document.documentElement.dataset.baseurl || ''}${item.url}`;
        const type = document.createElement('small'); type.textContent = item.type;
        const title = document.createElement('strong'); title.textContent = item.title;
        const text = document.createElement('span'); text.textContent = item.text;
        link.append(type, title, text);
        return link;
      }));
    };
    input.addEventListener('input', render);
    clear.addEventListener('click', () => { input.value = ''; input.focus(); render(); });
    render();
  });
}

function initGateRoadmap(root = document) {
  root.querySelectorAll('[data-gate-roadmap]:not([data-ready])').forEach(roadmap => {
    const dataNode = roadmap.querySelector('[data-gate-data]');
    const track = roadmap.querySelector('[data-gate-track]');
    const cards = Array.from(roadmap.querySelectorAll('[data-gate-index]'));
    const evidenceNode = roadmap.querySelector('[data-gate-evidence-data]');
    if (!dataNode || !track || !cards.length) return;

    let gates;
    try { gates = JSON.parse(dataNode.dataset.gateData || '[]'); } catch { showComponentError(roadmap, 'Die interaktive Roadmap konnte nicht geladen werden. Das aktuell ausgewählte Gate bleibt sichtbar.'); return; }
    if (!Array.isArray(gates) || gates.length !== cards.length) { showComponentError(roadmap, 'Die interaktive Roadmap ist derzeit nicht verfügbar. Das aktuell ausgewählte Gate bleibt sichtbar.'); return; }
    let evidenceEntries = [];
    try { evidenceEntries = evidenceNode ? JSON.parse(evidenceNode.dataset.gateEvidenceData || '[]') : []; } catch { evidenceEntries = []; }
    const evidenceById = new Map(evidenceEntries.map(item => [item.id, item]));

    const detail = roadmap.querySelector('#gate-detail');
    const status = roadmap.querySelector('[data-gate-detail-status]');
    const counter = roadmap.querySelector('[data-gate-counter]');
    const label = roadmap.querySelector('[data-gate-label]');
    const title = roadmap.querySelector('[data-gate-title]');
    const summary = roadmap.querySelector('[data-gate-summary]');
    const evidence = roadmap.querySelector('[data-gate-evidence]');
    const link = roadmap.querySelector('[data-gate-link]');
    const previous = roadmap.querySelector('[data-gate-previous]');
    const next = roadmap.querySelector('[data-gate-next]');
    if (![detail, status, counter, label, title, summary, evidence, link, previous, next].every(Boolean)) return;

    let activeIndex = Math.max(0, gates.findIndex(gate => gate.selected));
    const routeHref = route => document.querySelector('template[data-route]')
      ? `#${route}`
      : `${document.documentElement.dataset.baseurl || ''}${route}`;

    const render = (index, { focus = false, scroll = true } = {}) => {
      activeIndex = Math.min(Math.max(index, 0), gates.length - 1);
      const gate = gates[activeIndex];
      cards.forEach((card, cardIndex) => {
        const selected = cardIndex === activeIndex;
        card.classList.toggle('is-selected', selected);
        card.setAttribute('aria-selected', String(selected));
        card.tabIndex = selected ? 0 : -1;
      });
      detail.setAttribute('aria-labelledby', cards[activeIndex].id);
      status.textContent = gate.detailStatus;
      counter.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(gates.length).padStart(2, '0')}`;
      label.textContent = gate.label;
      title.textContent = gate.title;
      summary.textContent = gate.summary;
      const resultItems = (gate.evidenceIds || []).map(id => evidenceById.get(id)?.claim).filter(Boolean);
      const displayedResults = resultItems.length ? resultItems : (gate.plannedResults || []);
      evidence.replaceChildren(...displayedResults.map(item => {
        const listItem = document.createElement('li');
        const check = document.createElement('span');
        check.setAttribute('aria-hidden', 'true');
        check.textContent = '✓';
        listItem.append(check, document.createTextNode(item));
        return listItem;
      }));
      link.replaceChildren(document.createTextNode(`${gate.linkLabel} `));
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      link.append(arrow);
      link.href = routeHref(gate.url);
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === gates.length - 1;
      if (scroll) cards[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      if (focus) cards[activeIndex].focus({ preventScroll: true });
    };

    cards.forEach((card, index) => {
      card.disabled = false;
      card.addEventListener('click', () => render(index));
    });
    track.addEventListener('keydown', event => {
      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!direction && !['Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? gates.length - 1 : activeIndex + direction;
      render(target, { focus: true });
    });
    previous.addEventListener('click', () => render(activeIndex - 1, { focus: true }));
    next.addEventListener('click', () => render(activeIndex + 1, { focus: true }));
    roadmap.dataset.ready = 'true';
    render(activeIndex, { scroll: false });
  });
}

function initProofLightbox(root = document) {
  root.querySelectorAll('.proof-figure img:not([data-lightbox-ready])').forEach(image => {
    image.dataset.lightboxReady = 'true';
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `${image.alt || 'SAP-Nachweis'} vergrößern`);
    const open = () => {
      const dialog = document.createElement('dialog');
      dialog.className = 'proof-dialog';
      dialog.setAttribute('aria-label', `Vergrößerter Nachweis: ${image.alt || 'SAP-Nachweis'}`);
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'proof-dialog-close';
      close.textContent = 'Schließen';
      const clone = image.cloneNode();
      clone.removeAttribute('tabindex');
      clone.removeAttribute('role');
      const caption = document.createElement('p');
      caption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
      dialog.append(close, clone, caption);
      document.body.append(dialog);
      close.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
      dialog.addEventListener('close', () => { dialog.remove(); image.focus(); });
      dialog.showModal();
      close.focus();
      if (document.documentElement.dataset.environment === 'production' && document.documentElement.dataset.analytics === 'true') {
        window.llsgAnalyticsQueue = window.llsgAnalyticsQueue || [];
        window.llsgAnalyticsQueue.push({ name: 'screenshot_open', path: location.pathname, timestamp: Date.now() });
      }
    };
    image.addEventListener('click', open);
    image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  });
}

window.LLSG.initPage = function initPage(root = document) {
  initEvidenceFilters(root);
  initXRay(root);
  initSiteSearch(root);
  initGateRoadmap(root);
  initProofLightbox(root);
};

window.LLSG.initPage();

const analyticsEnabled = document.documentElement.dataset.environment === 'production' && document.documentElement.dataset.analytics === 'true';
if (analyticsEnabled) {
  window.llsgAnalyticsQueue = window.llsgAnalyticsQueue || [];
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    let name = link.dataset.track;
    if (!name && href.includes('/evidence/')) name = 'evidence_open';
    if (!name && /\/projects\/[^#]+\/gate-/.test(href)) name = 'gate_open';
    if (!name && href.includes('/inside-llsg/people/')) name = 'person_detail_open';
    if (!name && href.includes('/inside-llsg/business-episodes/')) name = 'business_episode_open';
    if (!name && href.includes('/inside-llsg/off-duty/')) name = 'off_duty_open';
    if (!name && href.includes('/llsg/specialty-pharmaceuticals/chronundo/')) name = 'product_open';
    if (!name && href.includes('/xray/')) name = 'xray_open';
    if (!name && /\.(?:pdf|docx?|xlsx?|zip)(?:$|[?#])/.test(href)) name = 'download';
    if (!name && /linkedin\.com/.test(href)) name = 'linkedin_open';
    if (name) window.llsgAnalyticsQueue.push({ name, path: location.pathname, target: href, timestamp: Date.now() });
  });
  if (document.body.classList.contains('not-found')) {
    window.llsgAnalyticsQueue.push({ name: 'not_found', path: location.pathname, timestamp: Date.now() });
  }
}
