/* ── MultiDB — moteur i18n ──
   Les traductions ne sont PAS dans ce fichier : elles sont dans /locales/<code>.json
   (une entrée par clé). Le site est proposé en français et en anglais ; le moteur
   est identique à celui de MultiCraft Info et accepte d'autres langues (il suffit
   d'ajouter un fichier locales/<code>.json et une ligne dans LANGUAGES).

   HTML (appliqué automatiquement au chargement et à chaque changement de langue) :
     <h1 data-i18n="hero-title-start">…</h1>              → texte
     <h1 data-i18n-html="post-mod-text">…</h1>            → texte contenant du HTML
     <input data-i18n-placeholder="search-placeholder">
     <button data-i18n-title="…">                         → attribut title
     <button data-i18n-aria-label="…">                    → attribut aria-label
     <meta data-i18n-content="page-description">          → attribut content

   JavaScript :
     t('mod-found-plural')                     → « mods trouvés »
     t('key', { count: 12 })                   → remplace {count} dans la traduction
     i18n.ready.then(…)                        → traductions de la langue courante chargées
     i18n.apply()                              → ré-applique les traductions au DOM
     document.addEventListener('langchange', fn) → re-traduire les contenus générés en JS

   Comportement si une clé n'existe pas : console.warn + la clé est renvoyée telle
   quelle (l'élément HTML concerné garde son contenu d'origine).*/
(function () {
  'use strict';

  /* ── Langues disponibles ──
     Le site est en français et en anglais uniquement.
     Pour ajouter une langue plus tard : créer locales/<code>.json et ajouter
     une ligne ici (le sélecteur se met à jour tout seul). */
  const LANGUAGES = [
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
  ];

  const LANGUAGE_BY_CODE = {};
  LANGUAGES.forEach(function (lang) { LANGUAGE_BY_CODE[lang.code.toLowerCase()] = lang; });

  const REFERENCE_LANGUAGE = 'en'; // secours si une clé manque dans la langue courante
  const DEFAULT_LANGUAGE = 'fr';
  const LOCALES_PATH = 'locales/';
  const STORAGE_KEY = 'multidb-lang';

  /* ── Langue : détection et persistance ── */

  function canonical(code) {
    if (typeof code !== 'string') return null;
    const lang = LANGUAGE_BY_CODE[code.toLowerCase()];
    return lang ? lang.code : null;
  }

  function isSupported(code) {
    return canonical(code) !== null;
  }

  function matchBrowserLang(raw) {
    if (!raw) return null;
    const lower = String(raw).toLowerCase();
    if (LANGUAGE_BY_CODE[lower]) return LANGUAGE_BY_CODE[lower].code;
    const base = lower.split('-')[0];
    if (LANGUAGE_BY_CODE[base]) return LANGUAGE_BY_CODE[base].code;
    return null;
  }

  function detectBrowserLang() {
    const candidates = [];
    if (Array.isArray(navigator.languages)) candidates.push.apply(candidates, navigator.languages);
    if (navigator.language) candidates.push(navigator.language);
    if (navigator.userLanguage) candidates.push(navigator.userLanguage);
    for (let i = 0; i < candidates.length; i++) {
      const match = matchBrowserLang(candidates[i]);
      if (match) return match;
    }
    return null;
  }

  function detectLang() {
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* stockage indisponible */ }
    if (isSupported(stored)) return canonical(stored);
    return detectBrowserLang() || DEFAULT_LANGUAGE;
  }

  let currentLang = detectLang();
  const dictionaries = {};
  const fileRequests = {};

  /* ── Chargement des fichiers de traduction ── */

  function localeFile(code) {
    const lang = LANGUAGE_BY_CODE[code.toLowerCase()];
    return (lang && lang.file) || (lang && lang.code) || code;
  }

  function loadDictionary(code) {
    if (dictionaries[code]) return Promise.resolve(dictionaries[code]);
    const file = localeFile(code);
    if (!fileRequests[file]) {
      fileRequests[file] = fetch(LOCALES_PATH + file + '.json')
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .catch(function (err) {
          console.error('[i18n] chargement impossible : ' + LOCALES_PATH + file + '.json', err);
          return {};
        });
    }
    return fileRequests[file].then(function (data) {
      dictionaries[code] = data || {};
      return dictionaries[code];
    });
  }

  /* ── Accès aux traductions ── */

  const warned = {};

  function warnOnce(message) {
    if (warned[message]) return;
    warned[message] = true;
    console.warn('[i18n] ' + message);
  }

  function rawValue(key, lang) {
    const dict = dictionaries[lang];
    if (!dict) return undefined;
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : undefined;
  }

  function interpolate(text, vars) {
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, function (token, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : token;
    });
  }

  function t(key, vars) {
    // Fichier de langue pas encore arrivé (chargement asynchrone) : on renvoie la
    // clé sans avertir — i18n.ready / l'événement « langchange » re-traduisent ensuite.
    if (!dictionaries[currentLang]) return key;

    let value = rawValue(key, currentLang);
    if (value === undefined && currentLang !== REFERENCE_LANGUAGE) {
      value = rawValue(key, REFERENCE_LANGUAGE);
      if (value !== undefined) warnOnce('clé « ' + key + ' » absente en « ' + currentLang + ' »');
    }
    if (value === undefined) {
      warnOnce('clé inconnue : « ' + key + ' »');
      return key;
    }
    if (typeof value !== 'string') return value;
    return interpolate(value, vars);
  }

  /* ── Application au DOM ── */

  const DOM_BINDINGS = [
    ['data-i18n', function (el, value) { el.textContent = value; }],
    ['data-i18n-html', function (el, value) { el.innerHTML = value; }],
    ['data-i18n-placeholder', function (el, value) { el.placeholder = value; }],
    ['data-i18n-title', function (el, value) { el.title = value; }],
    ['data-i18n-aria-label', function (el, value) { el.setAttribute('aria-label', value); }],
    ['data-i18n-content', function (el, value) { el.setAttribute('content', value); }],
  ];

  function applyTranslations() {
    document.documentElement.lang = currentLang;

    DOM_BINDINGS.forEach(function (binding) {
      const attr = binding[0];
      const apply = binding[1];
      document.querySelectorAll('[' + attr + ']').forEach(function (el) {
        const key = el.getAttribute(attr);
        const value = t(key);
        if (value !== key) apply(el, value);
      });
    });

    renderLangSwitcher();
  }

  /* ── Sélecteur de langue : bouton drapeau + menu déroulant ── */

  function currentLanguage() {
    return LANGUAGE_BY_CODE[currentLang.toLowerCase()] || LANGUAGE_BY_CODE[DEFAULT_LANGUAGE];
  }

  function setHeaderOverflow(container, open) {
    const header = container.closest ? container.closest('.site-header') : null;
    if (header) header.classList.toggle('lang-menu-open', open);
  }

  function setMenuOpen(open) {
    const container = document.getElementById('lang-switcher');
    if (!container) return;
    container.classList.toggle('open', open);
    const toggle = container.querySelector('.lang-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    setHeaderOverflow(container, open);
  }

  function buildFlag(lang) {
    // Le français et l'anglais disposent d'un emoji : pas besoin d'images de drapeaux.
    const span = document.createElement('span');
    span.className = 'lang-flag';
    span.textContent = lang.flag || '';
    return span;
  }

  function buildLanguageItem(lang) {
    const active = lang.code.toLowerCase() === currentLang.toLowerCase();
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'lang-item' + (active ? ' active' : '');
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', active ? 'true' : 'false');
    item.dataset.lang = lang.code;

    const flag = buildFlag(lang);
    const name = document.createElement('span');
    name.className = 'lang-name';
    name.textContent = lang.name;

    item.appendChild(flag);
    item.appendChild(name);
    item.addEventListener('click', function () {
      setMenuOpen(false);
      setLang(lang.code);
    });
    return item;
  }

  function renderLangSwitcher() {
    const container = document.getElementById('lang-switcher');
    if (!container) return;
    container.innerHTML = '';
    container.classList.remove('open');
    setHeaderOverflow(container, false);

    const current = currentLanguage();

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'lang-toggle';
    toggle.className = 'lang-toggle';
    toggle.setAttribute('aria-haspopup', 'listbox');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Language / Langue');
    toggle.innerHTML =
      '<span class="lang-flag"></span>' +
      '<span class="lang-code"></span>' +
      '<svg class="lang-caret" width="10" height="7" viewBox="0 0 10 7" aria-hidden="true">' +
      '<path d="M1 1.5l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    toggle.querySelector('.lang-flag').appendChild(buildFlag(current));
    toggle.querySelector('.lang-code').textContent = current.code.toUpperCase();
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();
      setMenuOpen(!container.classList.contains('open'));
    });
    container.appendChild(toggle);

    const menu = document.createElement('ul');
    menu.className = 'lang-menu';
    menu.id = 'lang-menu';
    menu.setAttribute('role', 'listbox');
    LANGUAGES.forEach(function (lang) {
      const li = document.createElement('li');
      li.appendChild(buildLanguageItem(lang));
      menu.appendChild(li);
    });
    container.appendChild(menu);
  }

  document.addEventListener('click', function (event) {
    const container = document.getElementById('lang-switcher');
    if (container && !container.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  /* ── Changement de langue ── */

  function setLang(lang) {
    const target = canonical(lang);
    if (!target || target === currentLang) return Promise.resolve();
    try { localStorage.setItem(STORAGE_KEY, target); } catch (e) { /* stockage indisponible */ }
    return loadDictionary(target).then(function () {
      currentLang = target;
      window.i18n.lang = currentLang;
      applyTranslations();
      // script.js re-traduit ici ses contenus générés en JS.
      document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
    });
  }

  /* ── API publique ── */

  window.i18n = {
    lang: currentLang,
    t: t,
    apply: applyTranslations,
    ready: null,
    isLang: isSupported,
    languages: LANGUAGES,
    defaultLang: DEFAULT_LANGUAGE,
  };

  window.setLang = setLang;

  /* ── Init ── */

  window.i18n.ready = loadDictionary(currentLang).then(function () {
    applyTranslations();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: currentLang } }));
  });
})();
