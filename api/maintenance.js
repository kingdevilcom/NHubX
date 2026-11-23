import { getFireTheme, getFireThemeProperties } from '../src/fireTheme.js';

export default function handler(_request, response) {
  const properties = Object.entries(getFireThemeProperties(getFireTheme()))
    .map(([property, value]) => property + ':' + value)
    .join(';');

  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Retry-After', '3600')
  response.status(503).send(`<!doctype html>
<html lang="en" style="${properties}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Scheduled maintenance | NHubX</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(ellipse at 50% 25%, rgb(var(--fire-accent) / .14), transparent 58%), rgb(var(--fire-background)); color: #fff7f2; font: 1rem/1.6 system-ui, sans-serif; }
    main { width: min(100%, 37rem); padding: clamp(24px, 6vw, 56px); background: rgb(var(--fire-background) / .9); border: 1px solid rgb(var(--fire-accent) / .3); border-radius: 20px; }
    h1 { font-size: clamp(2rem, 6vw, 3rem); line-height: 1.1; letter-spacing: -.04em; margin: 1rem 0; }
    p { margin: 0; color: #e8d2c9; }
    .brand { color: rgb(var(--fire-accent)); font-weight: 750; font-size: 1.25rem; }
    .brand::before { content: ''; display: inline-block; width: .65em; height: .85em; margin-right: .6em; border-radius: 70% 15% 65% 55%; transform: rotate(-20deg); background: linear-gradient(rgb(var(--fire-highlight)), rgb(var(--fire-accent))); }
  </style>
</head>
<body>
  <main>
    <p class="brand">NHubX</p>
    <h1>We&rsquo;re undergoing maintenance</h1>
    <p>We&rsquo;re updating the website. Please check back later.</p>
  </main>
</body>
</html>`)
}
