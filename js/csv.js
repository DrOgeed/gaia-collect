// Gaia Field Log — CSV export.
// Keeps every entry exportable in one click, as plain text Gaia
// Collect can open in any spreadsheet, forever, with no lock-in.

var GaiaCsv = (function () {
  var FIELDS = ['species', 'status', 'date', 'lat', 'lng', 'loggedBy', 'notes'];

  function toCsv(entries) {
    var rows = [FIELDS.join(',')];
    entries.forEach(function (entry) {
      var row = FIELDS.map(function (field) {
        var value = entry[field];
        if (value === null || value === undefined) value = '';
        value = String(value).replace(/"/g, '""');
        return '"' + value + '"';
      });
      rows.push(row.join(','));
    });
    return rows.join('\n');
  }

  function download(csv, filename) {
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function copyToClipboard(csv) {
    return navigator.clipboard.writeText(csv);
  }

  return { toCsv: toCsv, download: download, copyToClipboard: copyToClipboard };
})();
