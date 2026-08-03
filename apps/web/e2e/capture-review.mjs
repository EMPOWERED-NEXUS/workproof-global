/**
 * Local visual review captures (not committed).
 * Usage from apps/web: node e2e/capture-review.mjs
 * Expects preview server at http://127.0.0.1:4173
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'review-artifacts');
fs.mkdirSync(outDir, { recursive: true });

const baseURL = process.env.REVIEW_BASE_URL ?? 'http://127.0.0.1:4173';
const routes = [
  ['landing', '/'],
  ['login', '/login'],
  ['register', '/register'],
  ['forgot-password', '/forgot-password'],
  ['support', '/support'],
];

const widths = [
  ['mobile-360', 360],
  ['mobile-390', 390],
  ['tablet-768', 768],
  ['desktop-1440', 1440],
];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const [wName, width] of widths) {
  await page.setViewportSize({ width, height: 900 });
  for (const [name, route] of routes) {
    await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
    const file = path.join(outDir, `${name}-${wName}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('wrote', file);
  }
}

await browser.close();
console.log('Review images in', outDir);
