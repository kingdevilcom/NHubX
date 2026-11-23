import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: {
    baseURL: 'http://127.0.0.1:4177',
    channel: process.env.PLAYWRIGHT_CHROMIUM_CHANNEL,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build -- --outDir dist-ssr && npm run preview -- --outDir dist-ssr --host 127.0.0.1 --port 4177 --strictPort',
    url: 'http://127.0.0.1:4177',
  },
});
