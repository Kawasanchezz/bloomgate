<div align="center">

<img src="logo/banner.svg" alt="Bloomgate" width="100%">

<br>

### Step through a portal. Bloom into the next flower.

<sub>Plain HTML, CSS and JavaScript &nbsp;·&nbsp; No build step &nbsp;·&nbsp; No dependencies</sub>

<br>

![HTML](https://img.shields.io/badge/HTML5-e34f26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572b6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)

<br>

[About](#about) &nbsp;·&nbsp; [Features](#features) &nbsp;·&nbsp; [Getting started](#getting-started) &nbsp;·&nbsp; [Controls](#controls) &nbsp;·&nbsp; [Customize](#customize)

</div>

<br>

## About

Bloomgate is a slow trip through a garden of eight flowers. Each one opens into a full-screen view with its family, blooming season, meaning and a small curiosity. Travel one by one through the portal, or jump straight to any of them.

<div align="center">

Rose &nbsp;·&nbsp; Sakura &nbsp;·&nbsp; Lotus &nbsp;·&nbsp; Orchid &nbsp;·&nbsp; Tulip &nbsp;·&nbsp; Lily &nbsp;·&nbsp; Daisy &nbsp;·&nbsp; Sunflower

</div>

## Features

- 🌸 **Cinematic intro.** The rose photo settles while a 0–100% counter runs and the logo glides into the header.
- 🪟 **Canvas portal.** A rounded window over a stationary photo that tilts with the mouse and grows to fill the screen when you travel.
- 📖 **Eight flowers**, each with its family, blooming season, meaning and a curiosity.
- 🧭 **Fast navigation.** Sidebar, **Flowers** grid and **Explore** panel, plus a **Surprise me** button.
- 🗂️ **Panels.** **About** and **Menu**, closed with the button, the backdrop or `Esc`.
- ✨ **Polished details.** Custom cursor, responsive layout (desktop, tablet, phone) and reduced-motion support.

## Getting started

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

```text
bloomgate/
├── index.html   page structure
├── css/
│   └── style.css   layout, animations and panels
├── js/
│   └── script.js   flower data, portal canvas, travel and panels
├── foto/        one photo per flower
└── logo/        logo, banner and favicons
```

## Customize

**Add or change a flower**

1. Put a landscape photo in `foto/`.
2. Add an entry to the `FLOWERS` array at the top of `js/script.js`:

```js
{ key:'peony', name:'Peony', image:'foto/peony.jpg',
  blurb:'One short sentence.',
  facts:[['Family:','…'], ['Blooms:','…'], ['Meaning:','…'], ['Curiosity:','…']] }
```

The portal order follows the array, and the last flower links back to the first. Keep exactly four facts per flower.

**Photo darkness.** Edit `VEIL` in `js/script.js`.

> [!NOTE]
> Photos are compressed JPGs (under 450 KB each) and load on demand — only the current and next flower load up front, the rest load as you travel.

> [!IMPORTANT]
> Make sure you have the rights to use the photos and the logo before publishing.

<br>

<div align="center">

<sub>Made with care by <a href="https://github.com/Kawasanchezz">Kawasanchezz</a></sub>

</div>
