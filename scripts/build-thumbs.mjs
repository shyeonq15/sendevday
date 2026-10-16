// 투표 페이지용 썸네일: npm run thumbs → vote/thumbs/a.png … (1회차 강조본, 794×1123 @1.5x)
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const DRAFTS = Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(k => [k, k === 'a' ? 'poster' : `poster-${k}`]));
// 두 글자 키 시안
DRAFTS.aa = 'poster-aa';

const browser = await chromium.launch({ channel: 'msedge' });
const a4 = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5 });
const hd = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const WIDE = new Set(['k']);
await mkdir(root + 'vote/thumbs', { recursive: true });
for (const [k, dir] of Object.entries(DRAFTS)) {
  const page = WIDE.has(k) ? hd : a4;
  // 시안 J는 봉투 오프닝 장면을 썸네일로
  const intro = k === 'j';
  await page.goto(pathToFileURL(`${root}${dir}/index.html`).href + (intro ? '?focus=1' : '?static&focus=1') + (('nopqrstuvwxyz'.includes(k) || k === 'aa') ? '&layout=tall' : ''), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (intro) await page.waitForTimeout(600);
  await page.locator('#poster').screenshot({ path: `${root}vote/thumbs/${k}.png` });
  console.log('thumb', k);
}
// 세로·가로 겸용 시안의 가로판 썸네일 (nw, ow, pw)
for (const k of [...'nopqrstuvwxyz', 'aa']) {
  await hd.goto(pathToFileURL(`${root}poster-${k}/index.html`).href + '?static&focus=1&layout=wide', { waitUntil: 'networkidle' });
  await hd.evaluate(() => document.fonts.ready);
  await hd.locator('#poster').screenshot({ path: `${root}vote/thumbs/${k}w.png` });
  console.log('thumb', k + 'w');
}
await browser.close();
