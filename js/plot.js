// Gaia Field Log — relative plot.
// Deliberately not a real map: no map tiles are loaded, no claim of
// true scale or orientation is made. Entries with coordinates are
// placed relative to each other inside a bounding box. This is the
// "proportionality" choice named in the Ethics Checklist tab: a
// plain scatter plot is enough for what this tool needs to show.

var GaiaPlot = (function () {
  function render(canvas, noteEl, entries) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var cssW = canvas.clientWidth || 600;
    var cssH = 280;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    var styles = getComputedStyle(document.documentElement);
    var ink = styles.getPropertyValue('--ink').trim() || '#16241B';
    var muted = styles.getPropertyValue('--muted').trim() || '#55624F';
    var accent = styles.getPropertyValue('--accent').trim() || '#B56A3C';
    var line = styles.getPropertyValue('--line').trim() || 'rgba(0,0,0,0.15)';

    var points = entries.filter(function (e) {
      return e.lat != null && e.lng != null && !isNaN(e.lat) && !isNaN(e.lng);
    });

    if (points.length < 2) {
      noteEl.textContent = 'Add coordinates to at least two entries to see a relative plot.';
      ctx.fillStyle = muted;
      ctx.font = '13px sans-serif';
      ctx.fillText('Not enough located entries yet', 16, cssH / 2);
      return;
    }

    noteEl.textContent =
      points.length + ' located entries, plotted by relative position (not true scale or orientation).';

    var pad = 24;
    var lats = points.map(function (p) {
      return p.lat;
    });
    var lngs = points.map(function (p) {
      return p.lng;
    });
    var minLat = Math.min.apply(null, lats);
    var maxLat = Math.max.apply(null, lats);
    var minLng = Math.min.apply(null, lngs);
    var maxLng = Math.max.apply(null, lngs);
    var rangeLat = maxLat - minLat || 1;
    var rangeLng = maxLng - minLng || 1;

    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, cssW - pad * 2, cssH - pad * 2);

    points.forEach(function (p) {
      var x = pad + ((p.lng - minLng) / rangeLng) * (cssW - pad * 2);
      var y = pad + (1 - (p.lat - minLat) / rangeLat) * (cssH - pad * 2);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  return { render: render };
})();
