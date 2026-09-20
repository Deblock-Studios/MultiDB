// ===== MultiDB =====
// Charge la liste des mods/textures depuis mods.json
// Gère l'affichage (liste + page détail), la recherche, la traduction et les filtres

(function () {
  'use strict';

  // ========== SYSTÈME DE TRADUCTION ==========
  var translations = {
    fr: {
      'hero-title-start': 'Mods',
      'hero-title-gradient': '& Textures',
      'hero-subtitle': 'Parcours, découvre et télécharge des mods et packs de textures créés par la communauté.',
      'search-placeholder': 'Rechercher un mod, un auteur…',
      'filter-all': 'Tout',
      'filter-mods': 'Mods',
      'filter-textures': 'Packs de textures',
      'filter-games': 'Jeux',
      'sort-label': 'Trier :',
      'sort-downloads-desc': 'Du plus téléchargé au moins téléchargé',
      'sort-downloads-asc': 'Du moins téléchargé au plus téléchargé',
      'sort-name-asc': 'Ordre alphabétique',
      'sort-name-desc': 'Ordre alphabétique inversé',
      'sort-rating-desc': 'Mieux notés',
      'sort-rating-asc': 'Moins bien notés',
      'loading-label': 'Chargement…',
      'loading-mods': 'Chargement des mods…',
      'error-load': 'Impossible de charger la liste des mods. Réessaie plus tard.',
      'mod-found-singular': 'mod trouvé',
      'mod-found-plural': 'mods trouvés',
      'no-results': 'Aucun élément ne correspond à ta recherche.',
      'back-button': '← Retour à la liste',
      'mod-not-found': 'Ce mod n\'existe pas ou plus.',
      'author-label': 'Par',
      'discord-button': 'Discord',
      'discord-copied': 'Nom d\'utilisateur copié !',
      'description-title': 'Description',
      'download-button': 'Télécharger',
      'downloads-label-singular': 'téléchargement',
      'downloads-label-plural': 'téléchargements',
      'footer-text': 'MultiDB — Store communautaire de mods et textures pour MultiCraft. Non affilié à MultiCraft.',
      'page-title': 'MultiDB — Mods & Textures pour MultiCraft',
      'page-description': 'MultiDB, le store communautaire de mods et textures pour MultiCraft.',
      'page-detail-title': '— MultiDB',
      'post-mod-button': 'Poster un mod',
      'post-mod-title': 'Poster un mod',
      'post-mod-text': 'Pour poster un mod, envoie un message sur Discord à <strong>.lucas76.</strong> ou un mail à <a href="mailto:deblock-studios@proton.me">deblock-studios@proton.me</a>.',
      'post-mod-close': 'Fermer',
      'tuto-button': '📖 Tutoriel',
      'survey-text': "Nous aimerions connaitre votre avis sur MultiDB. Nous avons créé un sondage : il ne dure pas plus d'une minute à remplir ! Un grand merci à ceux qui le feront, vous aidez le développement de MultiDB.",
      'survey-btn': '🤝 Donner mon avis',
      'survey-skip': 'Plus tard',
      'announcement-text': '+5000 serveurs répertoriés sur notre autre site, <strong>MultiCraft Info</strong> !',
      'announcement-btn': 'Accéder →',
      // Compte Deblock
      'account-login': 'Connexion',
      'account-hero-title': 'COMPTE DEBLOCK',
      'account-hero-sub': 'Un seul compte pour tout un univers',
      'account-login-title': 'Connexion Deblock',
      'account-email': 'Email',
      'account-password': 'Mot de passe',
      'account-login-btn': 'Se connecter',
      'account-no-account': 'Pas encore de compte ?',
      'account-create': 'Créer un compte',
      'account-forgot': 'Mot de passe oublié ?',
      'account-signup-title': 'Créer un compte',
      'account-pseudo': 'Pseudo',
      'account-pseudo-placeholder': 'Votre pseudo',
      'account-confirm-password': 'Confirmer le mot de passe',
      'account-consent': 'J\'accepte la <a href="legal.html#privacy-title" target="_blank" rel="noopener noreferrer" style="color:var(--green);">politique de confidentialité</a> et les <a href="legal.html" target="_blank" rel="noopener noreferrer" style="color:var(--green);">conditions d\'utilisation</a>.',
      'account-shared-note': 'Note : Ce sont les mêmes comptes que sur MultiCraft Info. Si vous avez déjà un compte là-bas, connectez-vous avec les mêmes identifiants.',
      'account-signup-btn': 'Créer mon compte',
      'account-has-account': 'Déjà un compte ?',
      'account-forgot-title': 'Mot de passe oublié',
      'account-send-reset': 'Envoyer le lien de réinitialisation',
      'account-back-login': '← Retour à la connexion',
      'account-loading': 'Chargement…',
      'account-err-fill': 'Veuillez remplir tous les champs.',
      'account-err-password-short': 'Le mot de passe doit contenir au moins 6 caractères.',
      'account-err-password-match': 'Les mots de passe ne correspondent pas.',
      'account-err-consent': 'Veuillez accepter la politique de confidentialité et les conditions d\'utilisation.',
      'account-err-login': 'Erreur de connexion',
      'account-err-signup': 'Erreur lors de l\'inscription',
      'account-signup-success': '✅ Compte créé ! Vérifiez votre email pour confirmer votre inscription.',
      'account-err-email': 'Veuillez entrer votre email.',
      'account-reset-sent': '✅ Lien de réinitialisation envoyé par email',
      'account-err-send': 'Erreur lors de l\'envoi',
      // Profil
      'profile-title': 'Mon Profil',
      'profile-subtitle': 'Gérez vos informations personnelles',
      'profile-avatar': 'Photo de profil',
      'profile-avatar-hint': 'JPG, PNG ou GIF · max 2 Mo',
      'profile-avatar-save': 'Enregistrer',
      'profile-avatar-remove': 'Supprimer',
      'profile-pseudo': 'Pseudo',
      'profile-pseudo-placeholder': 'Votre pseudo',
      'profile-email': 'Email',
      'profile-password': 'Mot de passe',
      'profile-new-password': 'Nouveau mot de passe (6 caractères minimum)',
      'profile-confirm-password': 'Confirmer le mot de passe',
      'profile-save': 'Enregistrer',
      'profile-logout': 'Déconnexion',
      'profile-logout-btn': 'Se déconnecter',
      'profile-delete-title': 'Supprimer mon compte',
      'profile-delete-text': 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      'profile-delete-btn': 'Supprimer mon compte',
      'profile-delete-cancel': 'Annuler',
      'profile-delete-confirm-btn': 'Oui, supprimer',
      'profile-avatar-too-big': '❌ Image trop lourde (max 2 Mo).',
      'profile-avatar-saved': '✓ Photo de profil mise à jour !',
      'profile-avatar-removed': '✓ Photo supprimée.',
      'profile-pseudo-empty': 'Le pseudo ne peut pas être vide.',
      'profile-email-empty': 'L\'email ne peut pas être vide.',
      'profile-pseudo-changed': '✓ Pseudo mis à jour !',
      'profile-email-changed': '✓ Email de confirmation envoyé.',
      'profile-password-changed': '✓ Mot de passe changé !',
      'profile-error': 'Erreur : ',
      'profile-deleted': '✓ Compte supprimé.',
      'profile-login-required': 'Connectez-vous pour accéder à votre profil.',
      // Avis
      'reviews-title': 'Avis',
      'reviews-no-reviews': 'Aucun avis pour le moment. Soyez le premier !',
      'reviews-loading': 'Chargement…',
      'reviews-sort-recent': 'Plus récents',
      'reviews-sort-desc': 'Meilleures notes',
      'reviews-sort-asc': 'Notes les plus basses',
      'reviews-rating-label': 'Note :',
      'reviews-placeholder': 'Votre avis (facultatif)',
      'reviews-success': '✅ Merci pour votre avis !',
      'reviews-already-done': 'Vous avez déjà laissé un avis.',
      'reviews-already-left': 'Vous avez déjà laissé un avis pour ce mod.',
      'reviews-error': 'Erreur : ',
      'reviews-login-btn': 'Se connecter',
      'reviews-form-title-pre': 'Laisser un avis en tant que ',
      'reviews-no-badge': 'Aucun avis',
      'reviews-count-suffix': 'avis',
      'reviews-connect-prompt': 'Connectez-vous pour laisser un avis.',
      'reviews-load-error': 'Impossible de charger les avis.',
      'review-submit-btn': 'Publier'
    },
    en: {
      'hero-title-start': 'Mods',
      'hero-title-gradient': '& Textures',
      'hero-subtitle': 'Browse, discover and download mods and texture packs created by the community.',
      'search-placeholder': 'Search for a mod, an author…',
      'filter-all': 'All',
      'filter-mods': 'Mods',
      'filter-textures': 'Texture Packs',
      'filter-games': 'Games',
      'sort-label': 'Sort:',
      'sort-downloads-desc': 'Most downloaded',
      'sort-downloads-asc': 'Least downloaded',
      'sort-name-asc': 'Alphabetical (A to Z)',
      'sort-name-desc': 'Alphabetical (Z to A)',
      'sort-rating-desc': 'Highest rated',
      'sort-rating-asc': 'Lowest rated',
      'loading-label': 'Loading…',
      'loading-mods': 'Loading mods…',
      'error-load': 'Failed to load the mod list. Try again later.',
      'mod-found-singular': 'mod found',
      'mod-found-plural': 'mods found',
      'no-results': 'No items match your search.',
      'back-button': '← Back to list',
      'mod-not-found': 'This mod doesn\'t exist or has been removed.',
      'author-label': 'By',
      'discord-button': 'Discord',
      'discord-copied': 'Username copied!',
      'description-title': 'Description',
      'download-button': 'Download',
      'downloads-label-singular': 'download',
      'downloads-label-plural': 'downloads',
      'footer-text': 'MultiDB — Community store of mods and textures for MultiCraft. Not affiliated with MultiCraft.',
      'page-title': 'MultiDB — Mods & Textures for MultiCraft',
      'page-description': 'MultiDB, the community store of mods and textures for MultiCraft.',
      'page-detail-title': '— MultiDB',
      'post-mod-button': 'Post a mod',
      'post-mod-title': 'Post a mod',
      'post-mod-text': 'To post a mod, send a message on Discord to <strong>.lucas76.</strong> or an email to <a href="mailto:deblock-studios@proton.me">deblock-studios@proton.me</a>.',
      'post-mod-close': 'Close',
      'tuto-button': '📖 Tutorial',
      'survey-text': 'We would love to know your opinion on MultiDB. We created a survey: it takes no more than a minute to fill out! Many thanks to those who will do it, you help develop MultiDB.',
      'survey-btn': '🤝 Give my opinion',
      'survey-skip': 'Later',
      'announcement-text': '+5000 servers listed on our other site, <strong>MultiCraft Info</strong>!',
      'announcement-btn': 'Visit →',
      // Deblock account
      'account-login': 'Log in',
      'account-hero-title': 'DEBLOCK ACCOUNT',
      'account-hero-sub': 'One account for a whole universe',
      'account-login-title': 'Deblock login',
      'account-email': 'Email',
      'account-password': 'Password',
      'account-login-btn': 'Log in',
      'account-no-account': 'No account yet?',
      'account-create': 'Create an account',
      'account-forgot': 'Forgot your password?',
      'account-signup-title': 'Create an account',
      'account-pseudo': 'Username',
      'account-pseudo-placeholder': 'Your username',
      'account-confirm-password': 'Confirm password',
      'account-consent': 'I accept the <a href="legal.html#privacy-title" target="_blank" rel="noopener noreferrer" style="color:var(--green);">privacy policy</a> and the <a href="legal.html" target="_blank" rel="noopener noreferrer" style="color:var(--green);">terms of use</a>.',
      'account-shared-note': 'Note: These are the same accounts as on MultiCraft Info. If you already have an account there, log in with the same credentials.',
      'account-signup-btn': 'Create my account',
      'account-has-account': 'Already have an account?',
      'account-forgot-title': 'Forgot password',
      'account-send-reset': 'Send the reset link',
      'account-back-login': '← Back to login',
      'account-loading': 'Loading…',
      'account-err-fill': 'Please fill in all fields.',
      'account-err-password-short': 'The password must be at least 6 characters long.',
      'account-err-password-match': 'Passwords do not match.',
      'account-err-consent': 'Please accept the privacy policy and the terms of use.',
      'account-err-login': 'Login error',
      'account-err-signup': 'Signup error',
      'account-signup-success': '✅ Account created! Check your email to confirm your registration.',
      'account-err-email': 'Please enter your email.',
      'account-reset-sent': '✅ Reset link sent by email',
      'account-err-send': 'Error while sending',
      // Profile
      'profile-title': 'My Profile',
      'profile-subtitle': 'Manage your personal information',
      'profile-avatar': 'Profile picture',
      'profile-avatar-hint': 'JPG, PNG or GIF · max 2 MB',
      'profile-avatar-save': 'Save',
      'profile-avatar-remove': 'Remove',
      'profile-pseudo': 'Username',
      'profile-pseudo-placeholder': 'Your username',
      'profile-email': 'Email',
      'profile-password': 'Password',
      'profile-new-password': 'New password (at least 6 characters)',
      'profile-confirm-password': 'Confirm password',
      'profile-save': 'Save',
      'profile-logout': 'Log out',
      'profile-logout-btn': 'Log out',
      'profile-delete-title': 'Delete my account',
      'profile-delete-text': 'Are you sure you want to delete your account? This action is irreversible.',
      'profile-delete-btn': 'Delete my account',
      'profile-delete-cancel': 'Cancel',
      'profile-delete-confirm-btn': 'Yes, delete',
      'profile-avatar-too-big': '❌ Image too large (max 2 MB).',
      'profile-avatar-saved': '✓ Profile picture updated!',
      'profile-avatar-removed': '✓ Picture removed.',
      'profile-pseudo-empty': 'The username cannot be empty.',
      'profile-email-empty': 'The email cannot be empty.',
      'profile-pseudo-changed': '✓ Username updated!',
      'profile-email-changed': '✓ Confirmation email sent.',
      'profile-password-changed': '✓ Password changed!',
      'profile-error': 'Error: ',
      'profile-deleted': '✓ Account deleted.',
      'profile-login-required': 'Log in to access your profile.',
      // Reviews
      'reviews-title': 'Reviews',
      'reviews-no-reviews': 'No reviews yet. Be the first!',
      'reviews-loading': 'Loading…',
      'reviews-sort-recent': 'Most recent',
      'reviews-sort-desc': 'Highest rated',
      'reviews-sort-asc': 'Lowest rated',
      'reviews-rating-label': 'Rating:',
      'reviews-placeholder': 'Your review (optional)',
      'reviews-success': '✅ Thanks for your review!',
      'reviews-already-done': 'You have already left a review.',
      'reviews-already-left': 'You have already reviewed this mod.',
      'reviews-error': 'Error: ',
      'reviews-login-btn': 'Log in',
      'reviews-form-title-pre': 'Leave a review as ',
      'reviews-no-badge': 'No reviews',
      'reviews-count-suffix': 'reviews',
      'reviews-connect-prompt': 'Log in to leave a review.',
      'reviews-load-error': 'Unable to load reviews.',
      'review-submit-btn': 'Publish'
    }
  };

  // Moteur de traduction : locales/<code>.json via i18n.js (une langue par fichier).
  // Le dictionnaire `translations` ci-dessus ne sert plus que de repli si i18n.js
  // n'a pas pu être chargé (CDN bloqué, fichier local manquant…).
  function t(key, vars) {
    if (window.i18n && window.i18n.t) {
      var value = window.i18n.t(key, vars);
      if (value !== key) return value;
    }
    var dict = translations[langCode()] || translations.fr || {};
    return dict[key] || (translations.fr && translations.fr[key]) || key;
  }

  function langCode() {
    return (window.i18n && window.i18n.lang) ? window.i18n.lang : 'fr';
  }

  // Balise de locale sûre pour Intl (formatage des nombres et des dates).
  function localeTag() {
    var code = langCode();
    try { new Date().toLocaleDateString(code); return code; } catch (e) { return 'en-US'; }
  }

  var mods = [];
  var loadError = false;
  var currentFilter = 'all';
  var currentSort = 'downloads-desc';
  var downloadCounts = {};
  var modReviewStats = {};

  var modsListEl = document.getElementById('mods-list');
  var modsCountEl = document.getElementById('mods-count');
  var searchInput = document.getElementById('search-input');
  var pageHome = document.getElementById('page-home');
  var pageDetail = document.getElementById('page-detail');
  var detailContent = document.getElementById('mod-detail-content');
  var backBtn = document.getElementById('back-btn');
  var pageAccount = document.getElementById('page-account');
  var pageProfile = document.getElementById('page-profile');
  var filterButtons = document.querySelectorAll('.filter-btn');

  // ========== MISE À JOUR DE L'INTERFACE ==========

  function updateUILanguage() {
    document.getElementById('page-title').textContent = t('page-title');
    document.getElementById('page-description').content = t('page-description');
    document.getElementById('search-input').placeholder = t('search-placeholder');
    document.getElementById('hero-title').innerHTML = t('hero-title-start') + ' <span class="gradient-text">' + t('hero-title-gradient') + '</span>';
    document.getElementById('hero-subtitle').textContent = t('hero-subtitle');
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      var category = btn.getAttribute('data-category');
      if (category === 'all') btn.textContent = t('filter-all');
      else if (category === 'mod') btn.textContent = t('filter-mods');
      else if (category === 'texture') btn.textContent = t('filter-textures');
      else if (category === 'game') btn.textContent = t('filter-games');
    });
    var sortLabelEl = document.getElementById('sort-label');
    if (sortLabelEl) sortLabelEl.textContent = t('sort-label');
    var sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.setAttribute('aria-label', t('sort-label'));
      document.querySelectorAll('#sort-select option').forEach(function (opt) {
        var sortValue = opt.getAttribute('data-value');
        if (sortValue) opt.textContent = t('sort-' + sortValue);
      });
    }
    document.getElementById('back-btn').textContent = t('back-button');
    document.getElementById('footer-text').textContent = t('footer-text');
    document.getElementById('post-mod-btn').textContent = t('post-mod-button');
    document.getElementById('post-mod-title').textContent = t('post-mod-title');
    document.getElementById('post-mod-text').innerHTML = t('post-mod-text');
    document.getElementById('post-mod-close').setAttribute('aria-label', t('post-mod-close'));
    var tutoBtn = document.getElementById('tuto-btn');
    if (tutoBtn) tutoBtn.textContent = t('tuto-button');
    var surveyTextEl = document.getElementById('survey-text');
    if (surveyTextEl) surveyTextEl.textContent = t('survey-text');
    var surveyLinkEl = document.getElementById('survey-link');
    if (surveyLinkEl) surveyLinkEl.textContent = t('survey-btn');
    var surveySkipEl = document.getElementById('survey-skip');
    if (surveySkipEl) surveySkipEl.textContent = t('survey-skip');
    var announcementTextEl = document.getElementById('announcement-text');
    if (announcementTextEl) announcementTextEl.innerHTML = t('announcement-text');
    var announcementBtnEl = document.getElementById('announcement-btn');
    if (announcementBtnEl) announcementBtnEl.textContent = t('announcement-btn');
    var surveyCloseEl = document.getElementById('survey-close');
    if (surveyCloseEl) surveyCloseEl.setAttribute('aria-label', t('post-mod-close'));
    applyAccountTranslations();
  }


  // ========== UTILITAIRES ==========

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

  function getLocalizedText(field) {
    if (typeof field === 'object' && field !== null) {
      // Les descriptions de mods.json n'existent qu'en français et en anglais.
      return field[langCode()] || field.en || field.fr || '';
    }
    return field || '';
  }

  function getDownloadCount(mod) {
    if (!mod) return 0;
    var count = downloadCounts[mod.name];
    return typeof count === 'number' ? count : 0;
  }

  function formatCount(count) {
    return count.toLocaleString(localeTag());
  }

  function getModRating(mod) {
    var stat = modReviewStats[mod.id];
    return (stat && stat.count) ? stat.avg : null;
  }

  function sortMods(arr) {
    return arr.slice().sort(function (a, b) {
      var diff;
      if (currentSort === 'rating-desc' || currentSort === 'rating-asc') {
        var ra = getModRating(a);
        var rb = getModRating(b);
        // Les mods sans note restent toujours en fin de liste.
        if (ra === null && rb === null) return a.name.localeCompare(b.name, localeTag());
        if (ra === null) return 1;
        if (rb === null) return -1;
        diff = currentSort === 'rating-asc' ? ra - rb : rb - ra;
      } else if (currentSort === 'downloads-asc') {
        diff = getDownloadCount(a) - getDownloadCount(b);
      } else if (currentSort === 'name-asc') {
        diff = a.name.localeCompare(b.name, localeTag());
      } else if (currentSort === 'name-desc') {
        diff = b.name.localeCompare(a.name, localeTag());
      } else {
        diff = getDownloadCount(b) - getDownloadCount(a);
      }
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name, localeTag());
    });
  }

  function downloadIcon() {
    return (
      '<svg class="dl-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
      '<polyline points="7 10 12 15 17 10"/>' +
      '<line x1="12" y1="15" x2="12" y2="3"/>' +
      '</svg>'
    );
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  // ========== RENDU DE LA LISTE ==========

  function renderList(query) {
    var q = (query || '').trim().toLowerCase();

    var filtered = mods.filter(function (mod) {
      var matchesQuery = !q ||
        (mod.name || '').toLowerCase().indexOf(q) !== -1 ||
        (mod.author || '').toLowerCase().indexOf(q) !== -1 ||
        getLocalizedText(mod.description).toLowerCase().indexOf(q) !== -1;

      var matchesFilter = currentFilter === 'all' || mod.category === currentFilter;

      return matchesQuery && matchesFilter;
    });

    if (mods.length === 0 && !loadError) {
      modsListEl.innerHTML =
        '<div class="loading-state"><div class="spinner"></div>' + t('loading-mods') + '</div>';
      modsCountEl.textContent = '';
      return;
    }

    if (loadError) {
      modsListEl.innerHTML =
        '<div class="error-state">' + t('error-load') + '</div>';
      modsCountEl.textContent = '';
      return;
    }

    var countText = filtered.length === 1 ? t('mod-found-singular') : t('mod-found-plural');
    modsCountEl.textContent = filtered.length + ' ' + countText;

    if (filtered.length === 0) {
      modsListEl.innerHTML =
        '<div class="empty-state">' + t('no-results') + '</div>';
      return;
    }

    var html = sortMods(filtered)
      .map(function (mod, index) {
        var desc = getLocalizedText(mod.description);
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
          '<span class="mod-card-author">' + t('author-label') + ' ' +
          escapeHtml(mod.author) +
          '</span>' +
          '<span class="mod-card-excerpt">' +
          escapeHtml(excerpt(desc, 140)) +
          '</span>' +
          buildRatingBadgeHtml(mod.id) +
          '<span class="mod-card-downloads">' +
          downloadIcon() +
          '<span class="dl-count">' +
          formatCount(getDownloadCount(mod)) +
          '</span>' +
          '</span>' +
          '</span>' +
          '</button>'
        );
      })
      .join('');

    modsListEl.innerHTML = html;
  }

  // ========== RENDU DU DÉTAIL ==========

  function renderDetail(id) {
    var mod = findMod(id);

    if (!mod) {
      detailContent.innerHTML =
        '<div class="error-state">' + t('mod-not-found') + '</div>';
      return;
    }

    var desc = getLocalizedText(mod.description);
    var author = escapeHtml(mod.author);
    var name = escapeHtml(mod.name);
    var dlCount = getDownloadCount(mod);
    var ratingHtml = buildRatingBadgeHtml(mod.id);
    var discordHtml = '';

    if (mod.discord) {
      discordHtml =
        '<button type="button" class="btn-discord" id="discord-copy-btn" data-username="' +
        escapeHtml(mod.discord) +
        '">' +
        '<span class="discord-btn-label">' + t('discord-button') + '</span>' +
        '</button>';
    }

    detailContent.innerHTML =
      '<img class="mod-detail-banner" src="' +
      escapeHtml(mod.image) +
      '" alt="Image de présentation de ' +
      name +
      '" onerror="this.style.display=\'none\'">' +
      '<h1 class="mod-detail-title">' +
      name +
      '</h1>' +
      '<div class="mod-detail-meta">' +
      '<span class="mod-detail-author">' + t('author-label') + ' ' +
      author +
      '</span>' +
      '<span class="mod-detail-downloads">' +
      downloadIcon() +
      '<span class="dl-count">' +
      formatCount(dlCount) +
      '</span> ' +
      (dlCount === 1 ? t('downloads-label-singular') : t('downloads-label-plural')) +
      '</span>' +
      ratingHtml +
      discordHtml +
      '</div>' +
      '<div class="mod-detail-description">' +
      '<h3>' + t('description-title') + '</h3>' +
      '<p>' +
      escapeHtml(desc) +
      '</p>' +
      '</div>' +
      '<div class="mod-detail-actions">' +
      '<a class="btn btn-primary download-btn" href="' +
      escapeHtml(mod.download) +
      '" data-file="' +
      escapeHtml(mod.name) +
      '">' + t('download-button') + '</a>' +
      '</div>' +
      '<div id="mod-reviews-section" class="mod-reviews-section"></div>';

    renderReviewsSection(mod.id);
  }

  // ========== ROUTAGE ==========

  function showPage(name) {
    [pageHome, pageDetail, pageAccount, pageProfile].forEach(function (page) {
      if (page) page.classList.remove('active');
    });
    var target = name === 'detail' ? pageDetail
      : name === 'account' ? pageAccount
        : name === 'profile' ? pageProfile
          : pageHome;
    if (target) target.classList.add('active');
  }

  function route() {
    var hash = window.location.hash || '#/';
    var modMatch = hash.match(/^#\/mod\/(.+)$/);

    if (modMatch) {
      showPage('detail');
      renderDetail(decodeURIComponent(modMatch[1]));
      window.scrollTo(0, 0);
      return;
    }

    if (hash === '#/compte') {
      showPage('account');
      resetAuthForms();
      document.title = t('account-login-title') + ' — MultiDB';
      window.scrollTo(0, 0);
      return;
    }

    if (hash === '#/profil') {
      showPage('profile');
      refreshProfileData();
      document.title = t('profile-title') + ' — MultiDB';
      window.scrollTo(0, 0);
      // La session Supabase peut ne pas être encore restaurée : on attend
      // que le module soit prêt avant de renvoyer vers la connexion.
      if (window.Deblock) {
        Deblock.ready().then(function () {
          if (!Deblock.getUser()) window.location.hash = '#/compte';
          else refreshProfileData();
        });
      }
      return;
    }

    showPage('home');
    document.title = t('page-title');
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', route);

  // ========== COMPTE DEBLOCK (SUPABASE AUTH) ==========

  function supabaseUrl() {
    return (window.Deblock && Deblock.getSupabaseUrl)
      ? Deblock.getSupabaseUrl()
      : 'https://rdtvftclctwfqtpkbzlf.supabase.co';
  }

  function getApiHeaders() {
    if (window.Deblock && Deblock.getApiHeaders) return Deblock.getApiHeaders();
    return { 'Content-Type': 'application/json' };
  }

  function applyAccountTranslations() {
    var setText = function (id, key) {
      var el = document.getElementById(id);
      if (el) el.textContent = t(key);
    };
    var setHtml = function (id, key) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = t(key);
    };
    var setPlaceholder = function (id, key) {
      var el = document.getElementById(id);
      if (el) el.placeholder = t(key);
    };

    // Widget d'en-tête
    setText('deblock-btn-label', 'account-login');

    // Page compte
    setText('account-hero-title', 'account-hero-title');
    setText('account-hero-sub', 'account-hero-sub');
    setText('account-login-title', 'account-login-title');
    setText('account-email-label', 'account-email');
    setText('account-password-label', 'account-password');
    setText('deblock-login-submit', 'account-login-btn');
    setText('account-no-account', 'account-no-account');
    setText('deblock-show-signup', 'account-create');
    setText('deblock-show-forgot', 'account-forgot');
    setText('account-signup-title', 'account-signup-title');
    setText('account-pseudo-label', 'account-pseudo');
    setText('account-signup-email-label', 'account-email');
    setText('account-signup-password-label', 'account-password');
    setText('account-confirm-label', 'account-confirm-password');
    setHtml('account-consent', 'account-consent');
    setText('account-info-note-login', 'account-shared-note');
    setText('account-info-note-signup', 'account-shared-note');
    setText('deblock-signup-submit', 'account-signup-btn');
    setText('account-has-account', 'account-has-account');
    setText('deblock-show-login', 'account-login');
    setText('account-forgot-title', 'account-forgot-title');
    setText('account-forgot-email-label', 'account-email');
    setText('deblock-forgot-submit', 'account-send-reset');
    setText('deblock-back-to-login', 'account-back-login');
    setText('account-loading-text', 'account-loading');
    setPlaceholder('deblock-signup-pseudo', 'account-pseudo-placeholder');

    // Page profil
    setText('profile-title', 'profile-title');
    setText('profile-subtitle', 'profile-subtitle');
    setText('profile-avatar-title', 'profile-avatar');
    setText('profile-avatar-hint', 'profile-avatar-hint');
    setText('profile-avatar-save', 'profile-avatar-save');
    setText('profile-avatar-remove', 'profile-avatar-remove');
    setText('profile-pseudo-title', 'profile-pseudo');
    setText('profile-save-pseudo', 'profile-save');
    setText('profile-email-title', 'profile-email');
    setText('profile-save-email', 'profile-save');
    setText('profile-password-title', 'profile-password');
    setText('profile-save-password', 'profile-save');
    setText('profile-logout-title', 'profile-logout');
    setText('deblock-logout-btn', 'profile-logout-btn');
    setText('profile-delete-title', 'profile-delete-title');
    setText('profile-delete-text', 'profile-delete-text');
    setText('profile-delete-btn', 'profile-delete-btn');
    setText('profile-delete-cancel', 'profile-delete-cancel');
    setText('profile-delete-confirm', 'profile-delete-confirm-btn');
    setPlaceholder('profile-pseudo', 'profile-pseudo-placeholder');
    setPlaceholder('profile-new-password', 'profile-new-password');
    setPlaceholder('profile-confirm-password', 'profile-confirm-password');
  }

  function resetAuthForms() {
    var loginMode = document.getElementById('deblock-login-mode');
    var signupMode = document.getElementById('deblock-signup-mode');
    var forgotMode = document.getElementById('deblock-forgot-mode');
    var loading = document.getElementById('deblock-auth-loading');
    var err = document.getElementById('deblock-login-error');
    if (loginMode) loginMode.hidden = false;
    if (signupMode) signupMode.hidden = true;
    if (forgotMode) forgotMode.hidden = true;
    if (loading) loading.hidden = true;
    if (err) err.hidden = true;
    ['deblock-email', 'deblock-password', 'deblock-signup-pseudo', 'deblock-signup-email',
      'deblock-signup-password', 'deblock-signup-confirm', 'deblock-forgot-email'
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var consent = document.getElementById('deblock-signup-consent');
    if (consent) consent.checked = false;
  }

  function openAccountPage() {
    if ((window.location.hash || '') === '#/compte') {
      resetAuthForms();
    } else {
      window.location.hash = '#/compte';
    }
  }

  function showLoginError(msg) {
    var errEl = document.getElementById('deblock-login-error');
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.hidden = false;
  }

  function showAuthLoading(show) {
    var loading = document.getElementById('deblock-auth-loading');
    var loginMode = document.getElementById('deblock-login-mode');
    var signupMode = document.getElementById('deblock-signup-mode');
    var forgotMode = document.getElementById('deblock-forgot-mode');
    if (loading) loading.hidden = !show;
    if (loginMode) loginMode.hidden = show;
    if (signupMode) signupMode.hidden = true;
    if (forgotMode) forgotMode.hidden = true;
  }

  function updateDeblockUI() {
    var loginBtn = document.getElementById('deblock-login-btn');
    var userInfo = document.getElementById('deblock-user-info');
    var avatarEl = document.getElementById('deblock-avatar');
    var usernameEl = document.getElementById('deblock-username');
    var user = window.Deblock ? Deblock.getUser() : null;

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userInfo) {
        userInfo.removeAttribute('hidden');
        userInfo.style.display = 'flex';
      }
      if (avatarEl) {
        setImageSrcSafely(avatarEl, Deblock.getAvatarUrl());
        avatarEl.alt = Deblock.getDisplayName();
      }
      if (usernameEl) usernameEl.textContent = Deblock.getDisplayName();
    } else {
      if (loginBtn) loginBtn.style.display = '';
      if (avatarEl) setImageSrcSafely(avatarEl, '');
      if (userInfo) {
        userInfo.setAttribute('hidden', '');
        userInfo.style.display = 'none';
      }
    }

    // Rafraîchit le formulaire d'avis / la page profil selon la route courante.
    var hash = window.location.hash || '';
    var modMatch = hash.match(/^#\/mod\/(.+)$/);
    if (modMatch) renderReviewsSection(decodeURIComponent(modMatch[1]));
    if (hash === '#/profil') {
      if (user) refreshProfileData();
      else window.location.hash = '#/compte';
    }
  }

  var deblockAuthInitialized = false;

  function initDeblockAuth() {
    if (deblockAuthInitialized || !window.Deblock) return;
    deblockAuthInitialized = true;

    Deblock.ready().then(function () {
      updateDeblockUI();
      initProfilePage();
      refreshProfileData();
    });

    Deblock.onAuthStateChanged(function () {
      updateDeblockUI();
    });

    // ── Navigation / basculement de mode ──
    document.addEventListener('click', function (e) {
      if (e.target.closest('#deblock-login-btn')) {
        e.preventDefault();
        if (Deblock.getUser()) return;
        openAccountPage();
      }

      if (e.target.closest('#deblock-logout-btn')) {
        Deblock.logout().then(function () {
          window.location.hash = '#/';
        }).catch(console.error);
      }

      if (e.target.closest('#deblock-show-signup')) {
        e.preventDefault();
        document.getElementById('deblock-login-mode').hidden = true;
        document.getElementById('deblock-signup-mode').hidden = false;
        document.getElementById('deblock-login-error').hidden = true;
        ['deblock-signup-pseudo', 'deblock-signup-email', 'deblock-signup-password', 'deblock-signup-confirm'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = '';
        });
      }

      if (e.target.closest('#deblock-show-login')) {
        e.preventDefault();
        document.getElementById('deblock-signup-mode').hidden = true;
        document.getElementById('deblock-login-mode').hidden = false;
        document.getElementById('deblock-login-error').hidden = true;
      }

      if (e.target.closest('#deblock-show-forgot')) {
        e.preventDefault();
        document.getElementById('deblock-login-mode').hidden = true;
        document.getElementById('deblock-forgot-mode').hidden = false;
        document.getElementById('deblock-login-error').hidden = true;
        document.getElementById('deblock-forgot-email').value = '';
      }

      if (e.target.closest('#deblock-back-to-login')) {
        e.preventDefault();
        document.getElementById('deblock-forgot-mode').hidden = true;
        document.getElementById('deblock-login-mode').hidden = false;
        document.getElementById('deblock-login-error').hidden = true;
      }

      if (e.target.closest('#deblock-password-toggle')) {
        e.preventDefault();
        var pwInput = document.getElementById('deblock-password');
        var toggle = e.target.closest('#deblock-password-toggle');
        if (!pwInput || !toggle) return;
        if (pwInput.type === 'password') {
          pwInput.type = 'text';
          toggle.textContent = '🙈';
        } else {
          pwInput.type = 'password';
          toggle.textContent = '👁';
        }
      }
    });

    // ── Connexion ──
    var loginSubmit = document.getElementById('deblock-login-submit');
    if (loginSubmit) loginSubmit.addEventListener('click', async function () {
      var email = (document.getElementById('deblock-email').value || '').trim();
      var password = document.getElementById('deblock-password').value;
      if (!email || !password) { showLoginError(t('account-err-fill')); return; }
      showAuthLoading(true);
      try {
        await Deblock.login(email, password);
        showAuthLoading(false);
        window.location.hash = '#/';
      } catch (err) {
        showAuthLoading(false);
        showLoginError(err.message || t('account-err-login'));
      }
    });

    // ── Inscription ──
    var signupSubmit = document.getElementById('deblock-signup-submit');
    if (signupSubmit) signupSubmit.addEventListener('click', async function () {
      var pseudo = (document.getElementById('deblock-signup-pseudo').value || '').trim();
      var email = (document.getElementById('deblock-signup-email').value || '').trim();
      var password = document.getElementById('deblock-signup-password').value;
      var confirm = document.getElementById('deblock-signup-confirm').value;
      if (!email || !password) { showLoginError(t('account-err-fill')); return; }
      if (password.length < 6) { showLoginError(t('account-err-password-short')); return; }
      if (password !== confirm) { showLoginError(t('account-err-password-match')); return; }
      var consent = document.getElementById('deblock-signup-consent');
      if (consent && !consent.checked) { showLoginError(t('account-err-consent')); return; }
      showAuthLoading(true);
      try {
        await Deblock.signUp(email, password, pseudo || null);
        showAuthLoading(false);
        showLoginError(t('account-signup-success'));
      } catch (err) {
        showAuthLoading(false);
        showLoginError(err.message || t('account-err-signup'));
      }
    });

    // ── Mot de passe oublié ──
    var forgotSubmit = document.getElementById('deblock-forgot-submit');
    if (forgotSubmit) forgotSubmit.addEventListener('click', async function () {
      var email = (document.getElementById('deblock-forgot-email').value || '').trim();
      if (!email) { showLoginError(t('account-err-email')); return; }
      showAuthLoading(true);
      try {
        await Deblock.sendMagicLink(email);
        showAuthLoading(false);
        resetAuthForms();
        window.location.hash = '#/';
      } catch (err) {
        showAuthLoading(false);
        showLoginError(err.message || t('account-err-send'));
      }
    });

    // ── Touche Entrée ──
    var pwEl = document.getElementById('deblock-password');
    if (pwEl) pwEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('deblock-login-submit').click();
    });
    var confirmEl = document.getElementById('deblock-signup-confirm');
    if (confirmEl) confirmEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('deblock-signup-submit').click();
    });
    var forgotEl = document.getElementById('deblock-forgot-email');
    if (forgotEl) forgotEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('deblock-forgot-submit').click();
    });
  }

  // ========== PAGE PROFIL ==========

  var profilePageInitialized = false;

  /* Affecte l'URL d'une <img> sans déclencher de boucle de chargement.
     Réaffecter `src` relance TOUJOURS le chargement, même avec la même valeur ;
     et une valeur vide se résout vers l'URL de la page (document HTML), donc le
     navigateur émet « error » à chaque fois. Si le gestionnaire d'erreur
     réaffecte `src`, on entre dans une boucle infinie à ~10 000 itérations par
     seconde (CPU à 100 %, RAM qui explose, page qui ne finit jamais de charger).
     Ici : on détache le gestionnaire avant toute affectation, on n'écrit jamais
     une valeur vide et on ne réaffecte pas une URL déjà en place. */
  function setImageSrcSafely(img, url) {
    if (!img) return;
    img.onerror = null;
    if (url) {
      img.onerror = function () {
        // Image cassée : on retire la source, sans relancer de chargement.
        img.onerror = null;
        img.removeAttribute('src');
      };
      if (img.getAttribute('src') !== url) img.src = url;
    } else if (img.hasAttribute('src')) {
      img.removeAttribute('src');
    }
  }

  function refreshProfileData() {
    if (!window.Deblock) return;
    var user = Deblock.getUser();
    if (!user) return;
    var pseudoInput = document.getElementById('profile-pseudo');
    var emailInput = document.getElementById('profile-email');
    if (pseudoInput) pseudoInput.value = Deblock.getDisplayName() || '';
    if (emailInput) emailInput.value = user.email || '';
    setImageSrcSafely(document.getElementById('profile-avatar-preview'), Deblock.getAvatarUrl());
    var newPwdInput = document.getElementById('profile-new-password');
    var confirmPwdInput = document.getElementById('profile-confirm-password');
    if (newPwdInput) newPwdInput.value = '';
    if (confirmPwdInput) confirmPwdInput.value = '';
    var deleteBtn = document.getElementById('profile-delete-btn');
    var deleteCancel = document.getElementById('profile-delete-cancel');
    var deleteConfirm = document.getElementById('profile-delete-confirm');
    if (deleteBtn) deleteBtn.hidden = false;
    if (deleteCancel) deleteCancel.hidden = true;
    if (deleteConfirm) deleteConfirm.hidden = true;
    var msgEl = document.getElementById('profile-status-msg');
    if (msgEl) msgEl.hidden = true;
  }

  function initProfilePage() {
    if (profilePageInitialized) return;
    profilePageInitialized = true;

    var profilePage = document.getElementById('page-profile');
    if (!profilePage) return;

    var msgEl = document.getElementById('profile-status-msg');

    function showProfileMsg(msg, isSuccess) {
      if (!msgEl) return;
      msgEl.textContent = msg;
      msgEl.hidden = false;
      msgEl.style.color = isSuccess ? 'var(--green)' : '#f87171';
      setTimeout(function () { msgEl.hidden = true; }, 4000);
    }

    /* ── Avatar ── */
    (function initAvatarSection() {
      var previewEl = document.getElementById('profile-avatar-preview');
      var inputEl = document.getElementById('profile-avatar-input');
      var saveBtn = document.getElementById('profile-avatar-save');
      var removeBtn = document.getElementById('profile-avatar-remove');
      var progressWrap = document.getElementById('profile-avatar-progress');
      var progressBar = progressWrap && progressWrap.querySelector('.profile-avatar-progress-bar');

      var MAX_BYTES = 2 * 1024 * 1024;
      var pendingFile = null;

      function setProgress(pct) {
        if (!progressWrap || !progressBar) return;
        progressWrap.hidden = pct === 0;
        progressBar.style.width = pct + '%';
      }

      function loadCurrentAvatar() {
        if (!previewEl) return;
        setImageSrcSafely(previewEl, Deblock.getAvatarUrl());
      }
      loadCurrentAvatar();

      if (inputEl) {
        inputEl.addEventListener('change', function () {
          var file = inputEl.files && inputEl.files[0];
          if (!file) return;
          if (file.size > MAX_BYTES) {
            showProfileMsg(t('profile-avatar-too-big'), false);
            inputEl.value = '';
            return;
          }
          pendingFile = file;
          if (saveBtn) saveBtn.disabled = false;
          var reader = new FileReader();
          reader.onload = function (e) { setImageSrcSafely(previewEl, e.target.result); };
          reader.readAsDataURL(file);
        });
      }

      if (saveBtn) {
        saveBtn.addEventListener('click', async function () {
          if (!pendingFile) return;
          saveBtn.disabled = true;
          setProgress(10);
          try {
            var avatarUrl = await uploadAvatarWithFallback(pendingFile);
            setProgress(90);
            await Deblock.updateProfile({ avatar_url: avatarUrl });
            setProgress(100);
            pendingFile = null;
            if (inputEl) inputEl.value = '';
            updateDeblockUI();
            showProfileMsg(t('profile-avatar-saved'), true);
          } catch (err) {
            showProfileMsg('❌ ' + (err.message || 'Erreur lors de l\'upload.'), false);
          } finally {
            setTimeout(function () { setProgress(0); if (progressWrap) progressWrap.hidden = true; }, 1200);
            saveBtn.disabled = !pendingFile;
          }
        });
      }

      if (removeBtn) {
        removeBtn.addEventListener('click', async function () {
          try {
            await Deblock.updateProfile({ avatar_url: '' });
            setImageSrcSafely(previewEl, '');
            pendingFile = null;
            if (inputEl) inputEl.value = '';
            if (saveBtn) saveBtn.disabled = true;
            updateDeblockUI();
            showProfileMsg(t('profile-avatar-removed'), true);
          } catch (err) {
            showProfileMsg('❌ ' + (err.message || 'Erreur.'), false);
          }
        });
      }

      async function uploadAvatarWithFallback(file) {
        try {
          var url = await uploadToSupabase(file);
          if (url) return url;
        } catch (e) {
          console.warn('[Avatar] Supabase Storage échoué, bascule sur CatBox :', e.message);
        }
        return await uploadToCatBox(file);
      }

      async function uploadToSupabase(file) {
        var client = Deblock.getClient();
        if (!client) throw new Error('Client Supabase non disponible');
        var user = Deblock.getUser();
        if (!user) throw new Error('Non authentifié');

        var ext = file.name.split('.').pop() || 'jpg';
        var path = 'avatars/' + user.id + '.' + ext;

        var res = await client.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
        if (res.error) throw new Error(res.error.message);

        var pub = client.storage.from('avatars').getPublicUrl(path);
        if (!pub.data || !pub.data.publicUrl) throw new Error('URL publique introuvable');
        return pub.data.publicUrl + '?t=' + Date.now();
      }

      async function uploadToCatBox(file) {
        // CatBox bloque le CORS direct depuis le navigateur, on passe par des proxies.
        try {
          var f1 = new FormData();
          f1.append('reqtype', 'fileupload');
          f1.append('fileToUpload', file);
          var r1 = await fetch('https://corsproxy.io/?url=https://catbox.moe/user/api.php', { method: 'POST', body: f1 });
          if (r1.ok) { var u1 = (await r1.text()).trim(); if (u1.indexOf('https://') === 0) return u1; }
        } catch (e) { /* ignore */ }

        try {
          var f2 = new FormData();
          f2.append('reqtype', 'fileupload');
          f2.append('fileToUpload', file);
          var r2 = await fetch('https://crossorigin.me/https://catbox.moe/user/api.php', { method: 'POST', body: f2 });
          if (r2.ok) { var u2 = (await r2.text()).trim(); if (u2.indexOf('https://') === 0) return u2; }
        } catch (e) { /* ignore */ }

        throw new Error('Upload impossible (CORS). Active le bucket Supabase Storage "avatars" pour résoudre ce problème.');
      }
    })();

    /* ── Pseudo ── */
    var savePseudo = document.getElementById('profile-save-pseudo');
    if (savePseudo) savePseudo.addEventListener('click', async function () {
      var pseudoInput = document.getElementById('profile-pseudo');
      var newPseudo = pseudoInput ? pseudoInput.value.trim() : '';
      if (!newPseudo) { showProfileMsg(t('profile-pseudo-empty'), false); return; }
      try {
        await Deblock.updateProfile({ display_name: newPseudo });
        updateDeblockUI();
        showProfileMsg(t('profile-pseudo-changed'), true);
      } catch (err) {
        showProfileMsg(t('profile-error') + (err.message || ''), false);
      }
    });

    /* ── Email ── */
    var saveEmail = document.getElementById('profile-save-email');
    if (saveEmail) saveEmail.addEventListener('click', async function () {
      var emailInput = document.getElementById('profile-email');
      var newEmail = emailInput ? emailInput.value.trim() : '';
      if (!newEmail) { showProfileMsg(t('profile-email-empty'), false); return; }
      try {
        await Deblock.updateEmail(newEmail);
        showProfileMsg(t('profile-email-changed'), true);
      } catch (err) {
        showProfileMsg(t('profile-error') + (err.message || ''), false);
      }
    });

    /* ── Mot de passe ── */
    var savePassword = document.getElementById('profile-save-password');
    if (savePassword) savePassword.addEventListener('click', async function () {
      var newPwdInput = document.getElementById('profile-new-password');
      var confirmPwdInput = document.getElementById('profile-confirm-password');
      var pwd = newPwdInput ? newPwdInput.value : '';
      var confirm = confirmPwdInput ? confirmPwdInput.value : '';
      if (!pwd || pwd.length < 6) { showProfileMsg(t('account-err-password-short'), false); return; }
      if (pwd !== confirm) { showProfileMsg(t('account-err-password-match'), false); return; }
      try {
        await Deblock.updatePassword(pwd);
        if (newPwdInput) newPwdInput.value = '';
        if (confirmPwdInput) confirmPwdInput.value = '';
        showProfileMsg(t('profile-password-changed'), true);
      } catch (err) {
        showProfileMsg(t('profile-error') + (err.message || ''), false);
      }
    });

    if (document.getElementById('profile-confirm-password')) {
      document.getElementById('profile-confirm-password').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('profile-save-password').click();
      });
    }

    /* ── Suppression de compte ── */
    var deleteBtn = document.getElementById('profile-delete-btn');
    var deleteCancel = document.getElementById('profile-delete-cancel');
    var deleteConfirm = document.getElementById('profile-delete-confirm');

    if (deleteBtn) deleteBtn.addEventListener('click', function () {
      deleteBtn.hidden = true;
      if (deleteCancel) deleteCancel.hidden = false;
      if (deleteConfirm) deleteConfirm.hidden = false;
    });

    if (deleteCancel) deleteCancel.addEventListener('click', function () {
      deleteCancel.hidden = true;
      if (deleteConfirm) deleteConfirm.hidden = true;
      if (deleteBtn) deleteBtn.hidden = false;
    });

    if (deleteConfirm) deleteConfirm.addEventListener('click', async function () {
      try {
        await Deblock.deleteAccount();
        showProfileMsg(t('profile-deleted'), true);
        setTimeout(function () {
          window.location.hash = '#/';
          updateDeblockUI();
        }, 1500);
      } catch (err) {
        showProfileMsg(t('profile-error') + (err.message || ''), false);
        if (deleteCancel) deleteCancel.hidden = true;
        if (deleteConfirm) deleteConfirm.hidden = true;
        if (deleteBtn) deleteBtn.hidden = false;
      }
    });
  }

  // ========== SYSTÈME D'AVIS (table mod_reviews) ==========

  function hasRecentlyReviewed(modId) {
    if (window.Deblock && Deblock.getUser()) return false;
    try {
      var data = JSON.parse(localStorage.getItem('multidb_reviewed') || '{}');
      var last = data[modId];
      return !!(last && (Date.now() - last) < 3600000);
    } catch (e) { return false; }
  }

  function markReviewed(modId) {
    if (window.Deblock && Deblock.getUser()) return;
    try {
      var data = JSON.parse(localStorage.getItem('multidb_reviewed') || '{}');
      data[modId] = Date.now();
      localStorage.setItem('multidb_reviewed', JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  function fetchModReviews(modId) {
    var url = supabaseUrl() + '/rest/v1/mod_reviews?mod_id=eq.' +
      encodeURIComponent(modId) + '&order=created_at.desc&limit=50';
    return fetch(url, { headers: getApiHeaders() }).then(function (res) {
      if (!res.ok) throw new Error('Erreur chargement avis (' + res.status + ')');
      return res.json();
    });
  }

  function submitModReview(modId, pseudo, rating, text) {
    var currentUser = window.Deblock ? Deblock.getUser() : null;
    var payload = {
      mod_id: modId,
      pseudo: (pseudo || 'Anonyme').slice(0, 32).trim() || 'Anonyme',
      rating: rating,
      text: (text || '').slice(0, 280).trim(),
    };
    if (currentUser) {
      payload.user_id = currentUser.id;
      payload.pseudo = (Deblock.getDisplayName() || 'Anonyme').slice(0, 32);
    }
    return fetch(supabaseUrl() + '/rest/v1/mod_reviews', {
      method: 'POST',
      headers: Object.assign({}, getApiHeaders(), { 'Prefer': 'return=minimal' }),
      body: JSON.stringify(payload),
    }).then(function (res) {
      if (res.ok) return;
      return res.json().catch(function () { return {}; }).then(function (err) {
        if (err && err.code === '23505') throw new Error('already_reviewed');
        throw new Error((err && err.message) || 'Erreur soumission');
      });
    });
  }

  function buildStarsHtml(rating, total) {
    total = total || 5;
    var html = '';
    for (var i = 1; i <= total; i++) {
      html += '<span class="review-star' + (i <= rating ? ' filled' : '') + '">★</span>';
    }
    return html;
  }

  function buildAvgHtml(reviews) {
    if (!reviews.length) return '<span class="reviews-no-badge">' + t('reviews-no-badge') + '</span>';
    var avg = (reviews.reduce(function (s, r) { return s + r.rating; }, 0) / reviews.length).toFixed(1);
    return '<span class="reviews-avg-badge">★ ' + avg + ' <span class="reviews-count">(' + reviews.length + ' ' + t('reviews-count-suffix') + ')</span></span>';
  }

  function buildReviewCardsHtml(reviews) {
    if (!reviews.length) return '<p class="reviews-empty">' + t('reviews-no-reviews') + '</p>';
    var locale = localeTag();
    return reviews.map(function (r) {
      var dateLabel = r.date || (r.created_at ? new Date(r.created_at).toLocaleDateString(locale) : '');
      return '<div class="review-card"><div class="review-header"><span class="review-stars">' +
        buildStarsHtml(r.rating) +
        '</span><span class="review-pseudo">' + escapeHtml(r.pseudo || 'Anonyme') +
        '</span><span class="review-date">' + escapeHtml(dateLabel) + '</span></div>' +
        (r.text ? '<p class="review-text">' + escapeHtml(r.text) + '</p>' : '') + '</div>';
    }).join('');
  }

  function bindStarPicker(picker) {
    if (!picker) return;
    var stars = picker.querySelectorAll('.star-pick');
    function refresh(selected, hovered) {
      stars.forEach(function (s) {
        var v = parseInt(s.dataset.val, 10);
        s.classList.toggle('active', hovered ? v <= hovered : v <= selected);
      });
    }
    stars.forEach(function (star) {
      star.addEventListener('mouseenter', function () { refresh(parseInt(picker.dataset.selected || 0, 10), parseInt(star.dataset.val, 10)); });
      star.addEventListener('mouseleave', function () { refresh(parseInt(picker.dataset.selected || 0, 10), 0); });
      star.addEventListener('click', function () {
        picker.dataset.selected = star.dataset.val;
        refresh(parseInt(star.dataset.val, 10), 0);
      });
    });
  }

  function renderReviewsSection(modId) {
    var section = document.getElementById('mod-reviews-section');
    if (!section) return;
    var currentUser = window.Deblock ? Deblock.getUser() : null;
    var alreadyReviewed = hasRecentlyReviewed(modId);
    var formHtml;

    if (!currentUser) {
      formHtml = '<div class="review-deblock-prompt"><svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg><span>' + t('reviews-connect-prompt') + '</span><button type="button" class="btn-deblock-inline" id="review-deblock-login-btn">' + t('reviews-login-btn') + '</button></div>';
    } else if (alreadyReviewed) {
      formHtml = '<p class="review-already-done">' + t('reviews-already-done') + '</p>';
    } else {
      var starsHtml = '';
      for (var i = 1; i <= 5; i++) starsHtml += '<span class="star-pick" data-val="' + i + '">★</span>';
      formHtml = '<div class="review-form" id="review-form-wrap"><p class="review-form-title">' +
        t('reviews-form-title-pre') + '<strong style="color:var(--green-muted)">' + escapeHtml(Deblock.getDisplayName()) + '</strong></p>' +
        '<div class="review-form-fields"><div class="review-form-row"><div class="review-star-picker" data-selected="0">' +
        '<span class="review-star-picker-label">' + t('reviews-rating-label') + '</span>' + starsHtml + '</div></div>' +
        '<textarea class="review-input review-text-input" placeholder="' + escapeHtml(t('reviews-placeholder')) + '" maxlength="280" rows="2"></textarea>' +
        '<div class="review-form-footer"><span class="review-char-count" id="review-char-count">0 / 280</span>' +
        '<button type="button" class="btn btn-primary review-submit-btn">' + t('review-submit-btn') + '</button></div></div></div>';
    }

    section.innerHTML = '<div class="reviews-header"><h3 class="reviews-title">' + t('reviews-title') + '</h3>' +
      '<div class="reviews-header-right"><span class="reviews-avg-wrap"><span class="reviews-no-badge">' + t('reviews-loading') + '</span></span>' +
      '<select class="reviews-sort-select" id="reviews-sort-select" aria-label="' + escapeHtml(t('reviews-title')) + '">' +
      '<option value="recent">' + t('reviews-sort-recent') + '</option>' +
      '<option value="desc">' + t('reviews-sort-desc') + '</option>' +
      '<option value="asc">' + t('reviews-sort-asc') + '</option></select></div></div>' +
      '<div class="reviews-list" id="reviews-list-inner"><div class="reviews-spinner"><div class="spinner"></div></div></div>' + formHtml;

    var reviewLoginBtn = section.querySelector('#review-deblock-login-btn');
    if (reviewLoginBtn) reviewLoginBtn.addEventListener('click', function () { openAccountPage(); });

    bindStarPicker(section.querySelector('.review-star-picker'));

    var textarea = section.querySelector('.review-text-input');
    var charCount = section.querySelector('#review-char-count');
    if (textarea && charCount) {
      textarea.addEventListener('input', function () { charCount.textContent = textarea.value.length + ' / 280'; });
    }

    var submitBtn = section.querySelector('.review-submit-btn');
    var picker = section.querySelector('.review-star-picker');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var rating = picker ? parseInt(picker.dataset.selected || 0, 10) : 0;
        if (!rating) {
          if (picker) {
            picker.classList.add('shake');
            setTimeout(function () { picker.classList.remove('shake'); }, 450);
          }
          return;
        }
        var pseudo = currentUser ? Deblock.getDisplayName() : '';
        var text = textarea ? textarea.value.trim() : '';
        submitBtn.disabled = true;
        submitBtn.textContent = '…';
        submitModReview(modId, pseudo, rating, text)
          .then(function () {
            markReviewed(modId);
            var form = document.getElementById('review-form-wrap');
            if (form) form.innerHTML = '<p class="review-success-msg">' + t('reviews-success') + '</p>';
            return fetchModReviews(modId);
          })
          .then(function (reviews) { refreshReviewsList(reviews, section); loadReviewStats(); })
          .catch(function (err) {
            console.error(err);
            submitBtn.disabled = false;
            submitBtn.textContent = t('review-submit-btn');
            var msg = err.message === 'already_reviewed'
              ? t('reviews-already-left')
              : t('reviews-error') + escapeHtml(err.message || '');
            submitBtn.insertAdjacentHTML('afterend', '<p class="review-error-msg">' + msg + '</p>');
          });
      });
    }

    fetchModReviews(modId).then(function (reviews) {
      refreshReviewsList(reviews, section);
      var sortSelect = section.querySelector('#reviews-sort-select');
      if (sortSelect) sortSelect.addEventListener('change', function () { refreshReviewsList(reviews, section); });
    }).catch(function () {
      var list = document.getElementById('reviews-list-inner');
      if (list) list.innerHTML = '<p class="reviews-empty">' + t('reviews-load-error') + '</p>';
    });
  }

  function sortReviews(reviews, mode) {
    var sorted = reviews.slice();
    if (mode === 'desc') sorted.sort(function (a, b) { return b.rating - a.rating; });
    else if (mode === 'asc') sorted.sort(function (a, b) { return a.rating - b.rating; });
    return sorted;
  }

  function refreshReviewsList(reviews, section) {
    var sortSelect = section.querySelector('#reviews-sort-select');
    var mode = sortSelect ? sortSelect.value : 'recent';
    var sorted = sortReviews(reviews, mode);
    var list = document.getElementById('reviews-list-inner');
    if (list) list.innerHTML = buildReviewCardsHtml(sorted);
    var avgWrap = section.querySelector('.reviews-avg-wrap');
    if (avgWrap) avgWrap.innerHTML = buildAvgHtml(reviews);
  }

  function buildRatingBadgeHtml(modId) {
    var stat = modReviewStats[modId];
    if (!stat || !stat.count) return '';
    return '<span class="mod-card-rating">★ ' + stat.avg.toFixed(1) +
      ' <span class="rating-count">(' + stat.count + ')</span></span>';
  }

  function loadReviewStats() {
    fetch(supabaseUrl() + '/rest/v1/mod_reviews?select=mod_id,rating&limit=10000', { headers: getApiHeaders() })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (rows) {
        if (!Array.isArray(rows)) return;
        var acc = {};
        rows.forEach(function (r) {
          if (!r || typeof r.mod_id !== 'string' || typeof r.rating !== 'number') return;
          if (!acc[r.mod_id]) acc[r.mod_id] = { sum: 0, count: 0 };
          acc[r.mod_id].sum += r.rating;
          acc[r.mod_id].count += 1;
        });
        Object.keys(acc).forEach(function (k) { acc[k].avg = acc[k].sum / acc[k].count; });
        modReviewStats = acc;
        refreshCounters();
      })
      .catch(function () {
        // Table mod_reviews absente ou inaccessible : on n'affiche simplement aucune note.
      });
  }

  // ========== ÉVÉNEMENTS ==========

  modsListEl.addEventListener('click', function (e) {
    var card = e.target.closest('.mod-card');
    if (!card) return;
    var id = card.getAttribute('data-id');
    window.location.hash = '#/mod/' + encodeURIComponent(id);
  });

  backBtn.addEventListener('click', function () {
    window.location.hash = '#/';
  });

  detailContent.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-discord');
    if (!btn) return;

    var username = btn.getAttribute('data-username');
    if (!username) return;

    copyToClipboard(username).then(function () {
      var label = btn.querySelector('.discord-btn-label');
      if (!label) return;

      clearTimeout(btn._copyTimer);
      btn.classList.add('copied');
      label.textContent = t('discord-copied');

      btn._copyTimer = setTimeout(function () {
        btn.classList.remove('copied');
        label.textContent = t('discord-button');
      }, 1800);
    });
  });

  // ========== SUIVI DES TÉLÉCHARGEMENTS AVEC GOATCOUNTER ==========
  detailContent.addEventListener('click', function (e) {
    var downloadBtn = e.target.closest('.download-btn');
    if (!downloadBtn) return;

    var fileName = downloadBtn.getAttribute('data-file');
    if (!fileName) return;

    // Envoyer un événement à GoatCounter
    if (typeof goatcounter !== 'undefined') {
      goatcounter.count({
        path: `Téléchargement: ${fileName}`,
        title: `Téléchargement - ${fileName}`,
        event: true,
      });
    }

    // Rediriger après un court délai pour laisser le temps à GoatCounter d'enregistrer l'événement
    var fileUrl = downloadBtn.getAttribute('href');
    setTimeout(function () {
      window.location.href = fileUrl;
    }, 200);
  });

  var searchTimer = null;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    var value = searchInput.value;
    searchTimer = setTimeout(function () {
      renderList(value);
    }, 80);
  });

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = btn.getAttribute('data-category');
      currentFilter = category;
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      renderList(searchInput.value);
    });
  });

  var sortSelectEl = document.getElementById('sort-select');
  if (sortSelectEl) {
    sortSelectEl.addEventListener('change', function () {
      currentSort = sortSelectEl.value;
      renderList(searchInput.value);
    });
  }

  // ========== MODALE "POSTER UN MOD" ==========

  var postModBtn = document.getElementById('post-mod-btn');
  var postModOverlay = document.getElementById('post-mod-overlay');
  var postModClose = document.getElementById('post-mod-close');

  function openPostModModal() {
    postModOverlay.classList.add('active');
  }

  function closePostModModal() {
    postModOverlay.classList.remove('active');
  }

  postModBtn.addEventListener('click', openPostModModal);
  postModClose.addEventListener('click', closePostModModal);
  postModOverlay.addEventListener('click', function (e) {
    if (e.target === postModOverlay) closePostModModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePostModModal();
  });

  // ========== CHARGEMENT DES DONNÉES ==========

  fetch('mods.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      mods = Array.isArray(data) ? data : [];
      whenI18nReady().then(function () {
        renderList(searchInput.value);
        route();
      });
    })
    .catch(function () {
      loadError = true;
      whenI18nReady().then(function () { renderList(''); });
    });

  // ========== CHARGEMENT DU COMPTEUR DE TÉLÉCHARGEMENTS ==========

  function refreshCounters() {
    if (mods.length === 0) return;
    renderList(searchInput.value);
    var hash = window.location.hash || '';
    if (hash.indexOf('#/mod/') === 0) {
      var match = hash.match(/^#\/mod\/(.+)$/);
      if (match) renderDetail(decodeURIComponent(match[1]));
    }
  }

  function loadDownloadCounts() {
    fetch('https://multidb-download-counter.creatif-france.workers.dev/stats/hits?start=2026-07-01')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (stats) {
        if (!Array.isArray(stats)) return;
        stats.forEach(function (entry) {
          if (!entry || typeof entry.name !== 'string' || typeof entry.count !== 'number') return;
          var clean = entry.name;
          if (clean.indexOf('Téléchargement: ') === 0) {
            clean = clean.slice('Téléchargement: '.length);
          }
          if (!clean) return;
          downloadCounts[clean] = entry.count;
        });
        refreshCounters();
      })
      .catch(function () {
        // En cas d'échec, chaque élément reste affiché à 0 téléchargement.
      });
  }

  loadDownloadCounts();

  // ========== CHARGEMENT DES NOTES MOYENNES ==========

  loadReviewStats();

  // ========== INITIALISATION DU COMPTE DEBLOCK ==========

  initDeblockAuth();

  // ========== INITIALISATION ==========

  // Attend que les traductions de la langue courante soient chargées.
  function whenI18nReady() {
    return (window.i18n && window.i18n.ready) ? window.i18n.ready : Promise.resolve();
  }

  // Réapplique tous les textes (statiques + générés) après un changement de langue.
  function refreshTranslations() {
    updateUILanguage();
    if (mods.length > 0) {
      renderList(searchInput.value);
      var hash = window.location.hash || '';
      var match = hash.match(/^#\/mod\/(.+)$/);
      if (match) renderDetail(decodeURIComponent(match[1]));
    }
  }

  document.addEventListener('langchange', refreshTranslations);
  whenI18nReady().then(refreshTranslations);

  // ========== HALO QUI SUIT LE CURSEUR (DÉCORATIF) ==========

  var halo = document.getElementById('cursor-halo');
  if (halo && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      document.body.classList.add('cursor-active');
      halo.style.transform =
        'translate(' + (e.clientX - 50) + 'px, ' + (e.clientY - 50) + 'px)';
    });
  }

  // ========== SURVEY POPUP ==========
  var surveyOverlay = document.getElementById('survey-overlay');
  var surveyCloseBtn = document.getElementById('survey-close');
  var surveySkipBtn = document.getElementById('survey-skip');
  var surveyLinkBtn = document.getElementById('survey-link');

  function showSurveyPopup() {
    if (!surveyOverlay) return;
    if (localStorage.getItem('multidb-survey-dismissed')) return;
    surveyOverlay.classList.add('active');
  }

  function closeSurvey() {
    if (surveyOverlay) surveyOverlay.classList.remove('active');
  }

  function dismissSurvey() {
    closeSurvey();
    localStorage.setItem('multidb-survey-dismissed', 'true');
  }

  if (surveyCloseBtn) surveyCloseBtn.addEventListener('click', dismissSurvey);
  if (surveySkipBtn) surveySkipBtn.addEventListener('click', dismissSurvey);
  if (surveyOverlay) surveyOverlay.addEventListener('click', function (e) {
    if (e.target === surveyOverlay) dismissSurvey();
  });
  if (surveyLinkBtn) surveyLinkBtn.addEventListener('click', dismissSurvey);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dismissSurvey();
  });

  setTimeout(showSurveyPopup, 1500);

  // ========== OMBRE DU HEADER AU SCROLL ==========
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', function () {
      siteHeader.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }
})();
