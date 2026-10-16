// A4 세로 PNG 출력
//   npm run png            → 모든 시안 × 회차 3장 (out/a-01.png, out/b-02.png …)
//   npm run png -- b       → 시안 B만
//   npm run png -- b 2     → 시안 B의 2회차 강조본만
// 웹 포스터를 ?static 모드(애니메이션 없이 완성 상태)로 열어 #poster 영역만 캡처합니다.
// 794×1123(A4 @96dpi) 화면을 3.125배로 찍어 2481×3509px ≈ A4 300dpi.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DRAFTS = Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(k => [k, k === 'a' ? 'poster' : `poster-${k}`]));
// 두 글자 키 시안
DRAFTS.aa = 'poster-aa';
const root = fileURLToPath(new URL('..', import.meta.url));
const [which, focus] = process.argv.slice(2);
const drafts = which ? [which] : Object.keys(DRAFTS);
const focuses = focus ? [focus] : ['1', '2', '3'];

const browser = await chromium.launch({ channel: 'msedge' });
// 가로형(16:9) 시안은 1600×900 @2x = 3200×1800px
const WIDE = new Set(['k']);
// 한 파일로 세로·가로를 모두 지원하는 시안: 세로(out/n-01.png)와 가로(out/n-wide-01.png)를 함께 출력
const DUAL = new Set(['n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'aa']);
const A4 = { viewport: { width: 794, height: 1123 }, deviceScaleFactor: 3.125 };
const HD = { viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 };
const pages = { a4: await browser.newPage(A4), hd: await browser.newPage(HD) };
await mkdir(root + 'out', { recursive: true });

for (const d of drafts) {
  const base = pathToFileURL(`${root}${DRAFTS[d]}/index.html`).href;
  const runs = DUAL.has(d)
    ? [[pages.a4, '&layout=tall', ''], [pages.hd, '&layout=wide', '-wide']]
    : [[WIDE.has(d) ? pages.hd : pages.a4, '', '']];
  for (const [page, extra, suffix] of runs) for (const f of focuses) {
    await page.goto(`${base}?static&focus=${f}${extra}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const out = `${root}out/${d}${suffix}-0${f}.png`;
    await page.locator('#poster').screenshot({ path: out });
    console.log('PNG ->', out);
  }
}
await browser.close();
