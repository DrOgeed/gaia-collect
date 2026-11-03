// Gaia Collect — website behaviour.
// Only job: copy the contact email to the clipboard, with a visible
// fallback when the Clipboard API is unavailable.

function copyEmail(event) {
  var addr = document.getElementById('emailAddr').textContent;
  var btn = event.target;
  var original = btn.textContent;

  function done(ok) {
    btn.textContent = ok ? 'Copied' : 'Select the address above';
    setTimeout(function () {
      btn.textContent = original;
    }, 1800);
  }

  try {
    navigator.clipboard
      .writeText(addr)
      .then(function () {
        done(true);
      })
      .catch(function () {
        done(false);
      });
  } catch (e) {
    done(false);
  }
}
