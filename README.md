# Bloomgate

An immersive trip through a garden of flowers. Step through a portal to bloom into the next flower, or jump straight to any of them.

Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Features

- Cinematic intro: the rose photo settles while a 0–100% counter runs and the logo glides into the header.
- Canvas portal: a rounded window over a stationary photo that tilts with the mouse and grows to fill the screen when you travel.
- Eight flowers, each with its family, blooming season, meaning and a curiosity.
- Sidebar, **Flowers** grid and **Explore** panel to jump to any flower, plus a **Surprise me** button.
- **About** and **Menu** panels (close with the button, the backdrop or `Esc`).
- Custom cursor, responsive layout (desktop, tablet, phone) and reduced-motion support.

## Run it

Open `index.html` in a browser. For the smoothest experience, serve the folder locally:

```bash
python -m http.server
```

Then visit `http://localhost:8000`. It also works as-is on GitHub Pages.

## Controls

| Action | How |
| --- | --- |
| Go to the next flower | Click the portal window |
| Jump to a flower | Click it in the sidebar, or open **Flowers** |
| Random flower | **Explore** → **Surprise me** |
| Tilt the portal | Move the mouse |
| Close a panel | **Close**, click outside, click **Menu** again, or `Esc` |

## Project structure

```
index.html   page structure
style.css    layout, animations and panels
script.js    flower data, portal canvas, travel and panels
foto/        one photo per flower
logo/        logo.svg
```

## Add or change a flower

1. Put a landscape photo in `foto/`.
2. Add an entry to the `FLOWERS` array at the top of `script.js`:

```js
{ key:'peony', name:'Peony', image:'foto/peony.jpg',
  blurb:'One short sentence.',
  facts:[['Family:','…'], ['Blooms:','…'], ['Meaning:','…'], ['Curiosity:','…']] }
```

The portal order follows the array, and the last flower links back to the first. Keep exactly four facts per flower. To change how dark the photos are, edit `VEIL` in `script.js`.

## Notes

- The photos are large (about 3 MB each). Compress them (for example to WebP) for faster loading.
- Make sure you have the rights to use the photos and the logo before publishing.
# bloomgate
# bloomgate
# bloomgate
