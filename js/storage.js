// Gaia Field Log — storage.
// All entries live in this browser's localStorage, on this device,
// by design: see the Ethics Checklist tab for why. No server, no
// account, no third party ever sees this data.

var GaiaStorage = (function () {
  var STORAGE_KEY = 'gaia_field_log_entries_v1';

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // Storage can be unavailable (private browsing, quota, etc).
      // The app still works for the current page view; it just
      // won't persist across a reload. Fail silently rather than
      // breaking the form.
    }
  }

  return { load: load, save: save };
})();
