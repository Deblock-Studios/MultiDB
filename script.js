// ===== MultiDB =====
// Charge la liste des mods depuis mods.json et gère l'affichage
// (liste + page détail) ainsi que la recherche.

(function () {
  'use strict';

  var mods = [];
  var loadError = false;

  var modsListEl = document.getElementById('mods-list');
  var modsCountEl = document.getElementById('mods-count');
  var searchInput = document.getElementById('search-input');
  var pageHome = document.getElementById('page-home');
  var pageDetail = document.getElementById('page-detail');
  var detailContent = document.getElementById('mod-detail-content');
  var backBtn = document.getElementById('back-btn');

  // ---------- Utilitaires ----------

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function excerpt(text, max) {
    if (!text) return '';
    var clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return clean.slice(0, max).trim() + '…';
  }

  function findMod(id) {
    for (var i = 0; i < mods.length; i++) {
      if (mods[i].id === id) return mods[i];
    }
    return null;
  }

  // ---------- Rendu de la liste ----------

  function renderList(query) {
    var q = (query || '').trim().toLowerCase();

    var filtered = mods.filter(function (mod) {
      if (!q) return true;
      return (
        (mod.name || '').toLowerCase().indexOf(q) !== -1 ||
        (mod.author || '').toLowerCase().indexOf(q) !== -1 ||
        (mod.description || '').toLowerCase().indexOf(q) !== -1
      );
    });

    if (mods.length === 0 && !loadError) {
      modsListEl.innerHTML =
        '<div class="loading-state"><div class="spinner"></div>Chargement des mods…</div>';
      modsCountEl.textContent = '';
      return;
    }

    if (loadError) {
      modsListEl.innerHTML =
        '<div class="error-state">Impossible de charger la liste des mods. Réessaie plus tard.</div>';
      modsCountEl.textContent = '';
      return;
    }

    modsCountEl.textContent =
      filtered.length + (filtered.length === 1 ? ' mod trouvé' : ' mods trouvés');

    if (filtered.length === 0) {
      modsListEl.innerHTML =
        '<div class="empty-state">Aucun mod ne correspond à ta recherche.</div>';
      return;
    }

    var html = filtered
      .map(function (mod, index) {
        return (
          '<button type="button" class="mod-card" data-id="' +
          escapeHtml(mod.id) +
          '" style="animation-delay:' +
          Math.min(index * 0.05, 0.4) +
          's">' +
          '<img class="mod-card-image" src="' +
          escapeHtml(mod.image) +
          '" alt="" loading="lazy" onerror="this.style.visibility=\'hidden\'">' +
          '<span class="mod-card-body">' +
          '<span class="mod-card-title">' +
          escapeHtml(mod.name) +
          '</span>' +
          '<span class="mod-card-author">Par ' +
          escapeHtml(mod.author) +
          '</span>' +
          '<span class="mod-card-excerpt">' +
          escapeHtml(excerpt(mod.description, 140)) +
          '</span>' +
          '</span>' +
          '</button>'
        );
      })
      .join('');

    modsListEl.innerHTML = html;
  }

  // ---------- Rendu du détail ----------

  function renderDetail(id) {
    var mod = findMod(id);

    if (!mod) {
      detailContent.innerHTML =
        '<div class="error-state">Ce mod n\'existe pas ou plus.</div>';
      return;
    }

    detailContent.innerHTML =
      '<img class="mod-detail-banner" src="' +
      escapeHtml(mod.image) +
      '" alt="Image de présentation de ' +
      escapeHtml(mod.name) +
      '" onerror="this.style.display=\'none\'">' +
      '<h1 class="mod-detail-title">' +
      escapeHtml(mod.name) +
      '</h1>' +
      '<div class="mod-detail-meta">' +
      '<span class="mod-detail-author">Par ' +
      escapeHtml(mod.author) +
      '</span>' +
      (mod.source
        ? '<a href="' +
          escapeHtml(mod.source) +
          '" target="_blank" rel="noopener noreferrer">Voir le code source ↗</a>'
        : '') +
      '</div>' +
      '<div class="mod-detail-description">' +
      '<h3>Description</h3>' +
      '<p>' +
      escapeHtml(mod.description) +
      '</p>' +
      '</div>' +
      '<div class="mod-detail-actions">' +
      '<a class="btn btn-primary" href="' +
      escapeHtml(mod.download) +
      '">⬇ Télécharger le mod</a>' +
      (mod.source
        ? '<a class="btn btn-ghost" href="' +
          escapeHtml(mod.source) +
          '" target="_blank" rel="noopener noreferrer">Code source</a>'
        : '') +
      '</div>';

    document.title = mod.name + ' — MultiDB';
  }

  // ---------- Routage ----------
  // Routes possibles : "#/" (accueil) ou "#/mod/<id>" (détail)

  function route() {
    var hash = window.location.hash || '#/';
    var match = hash.match(/^#\/mod\/(.+)$/);

    if (match) {
      var id = decodeURIComponent(match[1]);
      pageHome.classList.remove('active');
      pageDetail.classList.add('active');
      renderDetail(id);
      window.scrollTo(0, 0);
    } else {
      pageDetail.classList.remove('active');
      pageHome.classList.add('active');
      document.title = 'MultiDB — Mods pour MultiCraft';
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener('hashchange', route);

  // ---------- Évènements ----------

  modsListEl.addEventListener('click', function (e) {
    var card = e.target.closest('.mod-card');
    if (!card) return;
    var id = card.getAttribute('data-id');
    window.location.hash = '#/mod/' + encodeURIComponent(id);
  });

  backBtn.addEventListener('click', function () {
    window.location.hash = '#/';
  });

  var searchTimer = null;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    var value = searchInput.value;
    searchTimer = setTimeout(function () {
      renderList(value);
    }, 80);
  });

  // ---------- Chargement des données ----------

  fetch('mods.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      mods = Array.isArray(data) ? data : [];
      renderList(searchInput.value);
      route();
    })
    .catch(function () {
      loadError = true;
      renderList('');
    });

  // ---------- Halo qui suit le curseur (décoratif) ----------

  var halo = document.getElementById('cursor-halo');
  if (halo && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      document.body.classList.add('cursor-active');
      halo.style.transform =
        'translate(' + (e.clientX - 50) + 'px, ' + (e.clientY - 50) + 'px)';
    });
  }

  // Affichage initial (avant la réponse fetch)
  renderList('');
})();
