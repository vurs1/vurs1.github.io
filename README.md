# Vaibhav Urs - Portfolio

A three-part personal portfolio with a warm, playful landing page that branches
into two distinct worlds: a technical engineering portfolio and a music page.
Pure HTML/CSS/JS - no framework or build step.

## Highlights

- Original desk-inspired landing page with Work and Music choices.
- Editorial Work page using Vaibhav's ASU-inspired maroon, gold, and cream palette.
- Jazz-inspired Music page with performance links and personal context.
- Responsive navigation, accessible focus states, and reduced-motion support.
- Lightweight one-time reveal effects with no continuous animation loops.
- **Recruiter-ready**: direct email, LinkedIn, GitHub, project, and social links.

## Project structure

```
portfolio/
├── index.html          # Work / Music landing page
├── work.html           # Engineering experience and projects
├── music.html          # Saxophone and music page
├── serve.js            # Tiny zero-dependency local server
└── assets/
    ├── home.css        # Landing page
    ├── work.css        # Technical portfolio
    ├── work.js         # Work-page navigation and reveals
    └── music.css       # Music page
```

## Run locally

```bash
node serve.js          # then open http://localhost:3000
```
(Or just open `index.html` — this version has no ES modules, so `file://` works too.)

## Customize

- **Content** - edit `index.html`, `work.html`, and `music.html`.
- **Email/contact** - update the `mailto:` links in the HTML files.
- **Palette** - edit the CSS variables at the top of each page's stylesheet.

## Deploy to GitHub Pages

GitHub Pages publishes the `main` branch automatically at
`https://vurs1.github.io/`.
