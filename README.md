# Vaibhav Urs - Portfolio

A modern, fast portfolio built around current design trends: a **bento
grid**, **oversized kinetic typography**, smooth **scroll-reveal** animations,
**micro-interactions**, an animated aurora + grain background, and a punchy
near-black + acid-lime + violet palette. Pure HTML/CSS/JS — no framework, no
build step.

## Highlights

- **Bold hero** with giant Space Grotesk type and an outlined accent word.
- **Marquee** strip of roles, kinetic scrolling.
- **Bento grid** about section - intro, photo (from GitHub), **education (ASU)**,
  "Now @ Microsoft", **Next Prospect**, teaching and research metrics,
  a live **saxophone equalizer**, stack badges, and count-up stats.
- **Work** as big hover rows with tech tags.
- **Watch me play** — a reels gallery linking my saxophone
  [@vaibhav.saxophone](https://www.instagram.com/vaibhav.saxophone/) on Instagram
  &amp; TikTok. (The clip cards currently link to the profiles — swap each card's
  `href` in `index.html` for a specific reel/video URL to point at individual clips.)
- **Custom cursor** (dot + ring), **magnetic** primary button, subtle card tilt,
  nav active states, live local clock.
- **"How'd he make that" effects:**
  - **Interactive particle constellation** in the hero that reacts to your mouse —
    and **pulses to the saxophone** when you hit Play (sound-reactive).
  - **Spotlight + holographic sheen** on the bento cards (glow follows the cursor;
    a light sweep on hover).
  - **Text scramble / decode** animation on the headings.
  - **Marquee** that skews with your scroll velocity.
  - **Scroll-progress bar** and subtle **mouse parallax** on the name.
- **Play my sax** — a saxophone phrase synthesized live with the Web Audio API,
  driving the on-page equalizer.
- Responsive, accessible (skip link, keyboard focus rings, respects
  `prefers-reduced-motion` for entrance), and lightweight.
- **Recruiter-ready**: direct email and LinkedIn links, Open Graph / Twitter share
  previews, a tasteful page-load intro, and a back-to-top button.

## Project structure

```
portfolio/
├── index.html          # All sections + content
├── serve.js            # Tiny zero-dependency local server
└── assets/
    ├── styles.css      # The full design system
    └── main.js         # Cursor, reveals, magnetics, clock, sax synth + equalizer
```

## Run locally

```bash
node serve.js          # then open http://localhost:3000
```
(Or just open `index.html` — this version has no ES modules, so `file://` works too.)

## Customize

- **Content** — edit the sections in `index.html`.
- **Resume** - optionally add a PDF and link it from `index.html`.
- **Email/contact** - update the `mailto:` links in `index.html`.
- **Palette** — CSS vars at the top of `styles.css` (`--lime`, `--violet`, …).
- **The sax phrase** — the `phrase` note array in `assets/main.js`.

## Deploy to GitHub Pages

GitHub Pages publishes the `main` branch automatically at
`https://vurs1.github.io/`.
