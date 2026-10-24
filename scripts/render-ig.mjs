// 인스타그램 9분할 출력: npm run ig → out/ig/
//   전체.png (3240×4320) + 칸 9장 (각 1080×1440, 프로필 그리드 3:4)
//   인스타는 최근 게시물이 왼쪽 위에 오므로, 파일 이름 번호 순서대로(오른쪽 아래 칸부터) 올리면 됩니다.
import { chromium } from 'playwright-core';
import { mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = root + 'out/ig/';
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 3 });
await page.goto(pathToFileURL(root + 'poster-ig/index.html').href + '?static');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

await page.screenshot({ path: out + '전체.png', clip: { x: 0, y: 0, width: 1080, height: 1440 } });
let n = 0;
for (let r = 2; r >= 0; r--) for (let c = 2; c >= 0; c--) {
  n++;
  const name = `${String(n).padStart(2, '0')}번째로_올리기_${r + 1}행${c + 1}열.png`;
  await page.screenshot({ path: out + name, clip: { x: c * 360, y: r * 480, width: 360, height: 480 } });
  console.log('PNG ->', out + name);
}
await browser.close();
