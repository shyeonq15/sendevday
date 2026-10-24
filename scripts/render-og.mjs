// 링크 미리보기(카톡·문자·SNS) 썸네일: npm run og → assets/og.png (1200×630)
// 포스터 X 가로판을 찍어 검정 바탕 가운데에 넣습니다. 포스터를 고친 뒤 다시 실행하고, npm run site 로 site/에 복사하세요.
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const browser = await chromium.launch({ channel: 'msedge' });

const p = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(root + 'poster-x/index.html').href + '?static&layout=wide');
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);
const shot = await p.locator('#poster').screenshot();

const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(`<body style="margin:0;width:1200px;height:630px;background:#0E1311;display:grid;place-items:center">
  <img src="data:image/png;base64,${shot.toString('base64')}" style="max-width:1200px;max-height:630px;display:block"></body>`);
await og.waitForTimeout(200);
await og.screenshot({ path: root + 'assets/og.png' });
console.log('PNG ->', root + 'assets/og.png');
await browser.close();
