export default function handler(_request, response) {
  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Retry-After', '3600')
  response.status(503).send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Scheduled maintenance | NHubX</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #101828; color: #f8fafc; font: 1rem/1.6 system-ui, sans-serif; }
    main { width: min(100%, 36rem); padding: clamp(24px, 6vw, 56px); background: #192438; border: 1px solid #35435a; border-radius: 20px; }
    h1 { font-size: clamp(2rem, 6vw, 3rem); line-height: 1.1; margin: 1rem 0; }
    p { margin: 0; color: #ced9ea; }
    .brand { color: #91d7ff; font-weight: 700; }
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
