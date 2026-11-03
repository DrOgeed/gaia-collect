// Gaia Field Log — app.
// Wires up tabs, the entry form, the entries list, CSV export and
// the relative plot. Depends on storage.js, csv.js and plot.js
// loading first.

(function () {
  var entries = GaiaStorage.load();

  // ---- Tabs ----

  var tabs = document.querySelectorAll('.tab');
  var views = document.querySelectorAll('.view');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', 'false');
      });
      views.forEach(function (v) {
        v.classList.remove('active');
      });
      tab.setAttribute('aria-selected', 'true');
      document.getElementById('view-' + tab.dataset.view).classList.add('active');

      if (tab.dataset.view === 'entries') renderEntries();
      if (tab.dataset.view === 'plot') renderPlot();
    });
  });

  // ---- Form ----

  var form = document.getElementById('entryForm');
  var dateInput = document.getElementById('date');

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }
  dateInput.value = todayIso();

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var species = document.getElementById('species').value.trim();
    if (!species) return;

    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;

    var entry = {
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      species: species,
      status: document.getElementById('status').value,
      date: dateInput.value,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      loggedBy: document.getElementById('loggedBy').value.trim(),
      notes: document.getElementById('notes').value.trim()
    };

    entries.unshift(entry);
    GaiaStorage.save(entries);

    form.reset();
    dateInput.value = todayIso();
    showToast('Entry saved');
  });

  // ---- Entries list ----

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function renderEntries() {
    var list = document.getElementById('entriesList');

    if (entries.length === 0) {
      list.innerHTML =
        '<div class="empty"><strong>No entries yet</strong>Log your first tree from the Log tab.</div>';
      return;
    }

    list.innerHTML = entries
      .map(function (entry) {
        var coords =
          entry.lat != null && entry.lng != null
            ? entry.lat.toFixed(5) + ', ' + entry.lng.toFixed(5)
            : 'no coordinates';

        return (
          '<div class="entry" data-id="' + entry.id + '">' +
          '<div class="entry-top">' +
          '<span class="entry-species">' + escapeHtml(entry.species) + '</span>' +
          '<span class="status" data-s="' + entry.status + '">' + entry.status + '</span>' +
          '</div>' +
          '<div class="entry-meta"><span>' + (entry.date || 'no date') + '</span><span>' + coords + '</span>' +
          (entry.loggedBy ? '<span>' + escapeHtml(entry.loggedBy) + '</span>' : '') +
          '</div>' +
          (entry.notes ? '<div class="entry-notes">' + escapeHtml(entry.notes) + '</div>' : '') +
          '<div class="entry-actions"><button class="linklike" data-del="' + entry.id + '">Delete</button></div>' +
          '</div>'
        );
      })
      .join('');

    list.querySelectorAll('[data-del]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-del');
        entries = entries.filter(function (entry) {
          return entry.id !== id;
        });
        GaiaStorage.save(entries);
        renderEntries();
        showToast('Entry deleted');
      });
    });
  }

  // ---- CSV export ----

  document.getElementById('downloadCsv').addEventListener('click', function () {
    GaiaCsv.download(GaiaCsv.toCsv(entries), 'gaia-field-log.csv');
    showToast('If nothing downloaded, use Copy CSV instead');
  });

  document.getElementById('copyCsv').addEventListener('click', function () {
    GaiaCsv.copyToClipboard(GaiaCsv.toCsv(entries))
      .then(function () {
        showToast('CSV copied to clipboard');
      })
      .catch(function () {
        showToast('Could not copy — try Download instead');
      });
  });

  // ---- Plot ----

  function renderPlot() {
    GaiaPlot.render(document.getElementById('plotCanvas'), document.getElementById('plotNote'), entries);
  }

  // ---- Toast ----

  var toastTimer;
  function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  renderEntries();
})();
