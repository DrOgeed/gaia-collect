# Gaia Collect

A website and field tool for Gaia Collect, a community-led indigenous
tree propagation and riparian restoration project.

- `index.html` — the Gaia Collect site: what the project does, how it
  works, and how to get in touch.
- `field-log.html` — **Gaia Field Log**, an offline-first notebook for
  logging tree plantings and tracking survival over time.

Both pages are plain HTML, CSS and JavaScript. No build step, no
framework, no backend.

## Why no AI model

Gaia Field Log was built alongside UNESCO's *AI for Environment and
Ecosystems Toolkit for Policymakers* (Constanza Gómez Mont and Carlo
Angeles), as part of a project for UNESCO's AI Ethics Action Cohorts at
the 4th UNESCO Global Forum on the Ethics of AI.

The toolkit's own first question is whether a problem needs AI at all.
Logging a planting and plotting a rough relative position doesn't, so
the tool has no model in it — just arithmetic, local storage, and a
canvas. The tool's **Ethics Checklist** tab walks through this and four
other toolkit-grounded design choices directly, in plain language, as
part of the product rather than as a separate document.

## Running it

Open `index.html` in a browser. That's the whole setup. `field-log.html`
is linked from the site's nav and hero, or can be opened directly.

## Publishing with GitHub Pages

1. Push this repository to GitHub.
2. In the repo's **Settings → Pages**, set the source to the `main`
   branch, root folder.
3. GitHub will publish the site at
   `https://<username>.github.io/<repo-name>/`.

## Data

Gaia Field Log stores every entry in the browser's `localStorage`, on
the device that entered it — nothing is sent anywhere. Entries can be
exported as CSV at any time (download, or copy to clipboard as a
fallback where a direct download is blocked).

## License

MIT — see `LICENSE`.
