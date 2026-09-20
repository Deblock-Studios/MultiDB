/* ── Deblock Auth Module (Supabase Auth v2) ──
 *
 * Central auth layer for the MultiDB site.
 * Repris tel quel du module de MultiCraft Info (même projet Supabase),
 * afin que les deux sites partagent exactement les mêmes comptes.
 * No other file should interact with Supabase Auth directly.
 *
 * Usage:
 *   Deblock.login(email, password)
 *   Deblock.signUp(email, password)
 *   Deblock.logout()
 *   Deblock.getUser()        → auth.user object or null
 *   Deblock.getAccessToken() → JWT string or null
 *   Deblock.getDisplayName() → string
 *   Deblock.getAvatarUrl()   → string
 *   Deblock.onAuthStateChanged(callback)
 *   Deblock.getApiHeaders()  → headers object for REST calls
 *   Deblock.getSupabaseUrl() → string
 *   Deblock.getAnonKey()     → string
 *   Deblock.isReady()        → boolean
 */
(function () {
  'use strict';

  /* ── Supabase credentials (anon key only, never service_role) ── */
  var SUPABASE_URL = 'https://rdtvftclctwfqtpkbzlf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkdHZmdGNsY3R3ZnF0cGtiemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTc0MjksImV4cCI6MjEwMDI5MzQyOX0.DIsdZkJaoziW2OI2hbDalDl0IQCGPF3QRcBhKT7GW7o';

  /* ── Internal state ── */
  var supabase = null;
  var currentUser = null;
  var cachedAccessToken = null;
  var authListeners = [];
  var ready = false;
  var initializationPromise = null;

  /* ── Initialize Supabase client ── */
  function init() {
    if (initializationPromise) return initializationPromise;

    initializationPromise = new Promise(function (resolve) {
      // Wait for supabase-js to be loaded on the page
      var attempts = 0;
      var MAX_ATTEMPTS = 200; // ~10s : abandonne si le CDN supabase ne charge pas
      function tryInit() {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
          supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true,
              flowType: 'pkce',
            },
          });

          // Get current session (or restore one passed in the URL by another
          // Deblock site, e.g. MultiCraft Info → MultiDB single sign-on).
          restoreSessionFromUrl().then(function () {
            return supabase.auth.getSession();
          }).then(function (result) {
            var session = result.data && result.data.session ? result.data.session : null;
            if (session) {
              currentUser = session.user;
              cachedAccessToken = session.access_token;
            }
            ready = true;
            notifyListeners(currentUser);
            resolve();
          });

          // Listen for future auth changes
          supabase.auth.onAuthStateChange(function (event, session) {
            if (session) {
              currentUser = session.user;
              cachedAccessToken = session.access_token;
            } else {
              currentUser = null;
              cachedAccessToken = null;
            }
            // Notify asynchronously to avoid Supabase sync context restrictions
            setTimeout(function () { notifyListeners(currentUser); }, 0);
          });
        } else {
          // supabase-js not loaded yet, retry
          attempts += 1;
          if (attempts >= MAX_ATTEMPTS) {
            // CDN bloqué / hors-ligne : on libère l'initialisation au lieu de boucler à l'infini
            ready = true;
            resolve();
          } else {
            setTimeout(tryInit, 50);
          }
        }
      }
      tryInit();
    });

    return initializationPromise;
  }

  /* ── Restaure une session passée via l'URL (SSO inter-sites) ──
     Un autre site Deblock (MultiCraft Info) peut renvoyer l'utilisateur ici
     avec ?access_token=…&refresh_token=…. On reconstruit alors la session locale
     puis on nettoie l'URL pour ne pas laisser traîner les jetons. */
  function restoreSessionFromUrl() {
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return Promise.resolve();
    }
    var accessToken = params.get('access_token');
    var refreshToken = params.get('refresh_token');
    if (!accessToken || !refreshToken) return Promise.resolve();

    return supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).then(function () {
      try {
        params.delete('access_token');
        params.delete('refresh_token');
        params.delete('expires_in');
        params.delete('token_type');
        params.delete('type');
        var query = params.toString();
        var clean = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
        window.history.replaceState({}, document.title, clean);
      } catch (e) { /* ignore */ }
    }).catch(function () { /* jeton invalide : on ignore */ });
  }

  /* ── Notify all listeners ── */
  function notifyListeners(user) {
    for (var i = 0; i < authListeners.length; i++) {
      try { authListeners[i](user); } catch (e) { console.error('[Deblock] Listener error:', e); }
    }
  }

  /* ── Expose once supabase-js is available ── */
  (function boot() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();

  /* ── Public API ── */
  window.Deblock = {
    /* Wait for the module to be ready (returns a promise) */
    ready: function () { return initializationPromise || init(); },

    /* Check if the module has finished initializing */
    isReady: function () { return ready; },

    /* Get the Supabase client instance (for advanced usage) */
    getClient: function () { return supabase; },

    /* Get the Supabase URL */
    getSupabaseUrl: function () { return SUPABASE_URL; },

    /* Get the Supabase anon key */
    getAnonKey: function () { return SUPABASE_ANON_KEY; },

    /* Get the current authenticated user (from auth.users) or null */
    getUser: function () { return currentUser; },

    /* Get the current JWT access token or null */
    getAccessToken: function () { return cachedAccessToken; },

    /* Get properly authenticated headers for Supabase REST API calls.
     * - Public (no token) → uses anon key as bearer (RLS controls access)
     * - Authenticated → uses user JWT
     */
    getApiHeaders: function () {
      var headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      };
      headers['Authorization'] = 'Bearer ' + (cachedAccessToken || SUPABASE_ANON_KEY);
      return headers;
    },

    /* Get the display name from the user's profile.
     * Falls back: display_name → username → email → 'Utilisateur'
     */
    getDisplayName: function () {
      if (!currentUser) return '';
      return currentUser.user_metadata && currentUser.user_metadata.display_name
        ? currentUser.user_metadata.display_name
        : (currentUser.user_metadata && currentUser.user_metadata.username
          ? currentUser.user_metadata.username
          : (currentUser.email || ''));
    },

    /* Get the avatar URL from the user's profile */
    getAvatarUrl: function () {
      if (!currentUser) return '';
      if (currentUser.user_metadata && currentUser.user_metadata.avatar_url) {
        return currentUser.user_metadata.avatar_url;
      }
      // Fallback: generate a default avatar URL using the user's email hash
      if (currentUser.email) {
        var hash = 0;
        var email = currentUser.email.trim().toLowerCase();
        for (var i = 0; i < email.length; i++) {
          hash = ((hash << 5) - hash) + email.charCodeAt(i);
          hash |= 0;
        }
        var seed = Math.abs(hash) % 6;
        return SUPABASE_URL + '/storage/v1/object/public/avatars/default-' + seed + '.png';
      }
      return '';
    },

    /* Log in with email and password */
    login: async function (email, password) {
      if (!supabase) await init();
      var result = await supabase.auth.signInWithPassword({ email: email, password: password });
      if (result.error) throw result.error;
      return result.data;
    },

    /* Create a new account with optional display_name (pseudo) */
    signUp: async function (email, password, displayName, redirectTo) {
      if (!supabase) await init();
      var options = {
        emailRedirectTo: redirectTo || (window.location.origin + window.location.pathname),
      };
      if (displayName && displayName.trim()) {
        options.data = { display_name: displayName.trim() };
      }
      var result = await supabase.auth.signUp({
        email: email,
        password: password,
        options: options,
      });
      if (result.error) throw result.error;
      return result.data;
    },

    /* Send a magic link / OTP (used for password reset) */
    sendMagicLink: async function (email, redirectTo) {
      if (!supabase) await init();
      var result = await supabase.auth.signInWithOtp({
        email: email,
        options: { emailRedirectTo: redirectTo || (window.location.origin + window.location.pathname) },
      });
      if (result.error) throw result.error;
      return result.data;
    },

    /* Construit l'URL de retour vers un autre site Deblock en y ajoutant
       les jetons de session courants, pour que le site cible puisse
       restaurer la session Supabase (authentification inter-origines). */
    buildAuthRedirect: async function (target) {
      if (!supabase) await init();
      var result = await supabase.auth.getSession();
      var session = result.data && result.data.session ? result.data.session : null;
      if (!session) return target;

      var params = new URLSearchParams();
      params.set('access_token', session.access_token);
      params.set('refresh_token', session.refresh_token);
      if (session.expires_in != null) params.set('expires_in', String(session.expires_in));
      params.set('token_type', session.token_type || 'bearer');
      params.set('type', 'signin');

      var hashIndex = target.indexOf('#');
      var base = target;
      var hash = '';
      if (hashIndex !== -1) {
        base = target.slice(0, hashIndex);
        hash = target.slice(hashIndex);
      }
      var sep = base.indexOf('?') === -1 ? '?' : '&';
      return base + sep + params.toString() + hash;
    },

    /* Log out */
    logout: async function () {
      if (!supabase) return;
      var result = await supabase.auth.signOut();
      if (result.error) throw result.error;
    },

    /* Check if user is authenticated (convenience) */
    isLoggedIn: function () { return currentUser !== null; },

    /* Register a callback for auth state changes.
     * Callback receives user (object) or null.
     * Returns an unsubscribe function.
     */
    onAuthStateChanged: function (callback) {
      authListeners.push(callback);
      // Notify immediately with current state if ready
      if (ready) {
        setTimeout(function () { callback(currentUser); }, 0);
      }
      // Return unsubscribe
      return function () {
        authListeners = authListeners.filter(function (cb) { return cb !== callback; });
      };
    },

    /* Get the Supabase auth session token for custom API use */
    getSession: async function () {
      if (!supabase) await init();
      var result = await supabase.auth.getSession();
      return result.data && result.data.session ? result.data.session : null;
    },

    /* Update user metadata (e.g. display_name / avatar_url) */
    updateProfile: async function (metadata) {
      if (!supabase) await init();
      if (!currentUser) throw new Error('Not authenticated');
      var result = await supabase.auth.updateUser({ data: metadata });
      if (result.error) throw result.error;
      // Update local state
      if (result.data && result.data.user) {
        currentUser = result.data.user;
      }
      return result.data;
    },

    /* Change email */
    updateEmail: async function (newEmail) {
      if (!supabase) await init();
      if (!currentUser) throw new Error('Not authenticated');
      var result = await supabase.auth.updateUser({ email: newEmail });
      if (result.error) throw result.error;
      return result.data;
    },

    /* Change password (requires reauthentication in Supabase) */
    updatePassword: async function (newPassword) {
      if (!supabase) await init();
      if (!currentUser) throw new Error('Not authenticated');
      var result = await supabase.auth.updateUser({ password: newPassword });
      if (result.error) throw result.error;
      return result.data;
    },

    /* Delete account via the Supabase `delete-account` edge function */
    deleteAccount: async function () {
      if (!supabase) await init();
      if (!currentUser) throw new Error('Not authenticated');
      var session = await supabase.auth.getSession();
      var accessToken = session && session.data && session.data.session
        ? session.data.session.access_token
        : null;
      if (!accessToken) throw new Error('No active session');

      var response = await fetch(SUPABASE_URL + '/functions/v1/delete-account', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        var errData = await response.json().catch(function () { return {}; });
        throw new Error(errData.error || 'Erreur lors de la suppression du compte');
      }
      // Sign out locally
      await supabase.auth.signOut();
      return true;
    },
  };
})();
