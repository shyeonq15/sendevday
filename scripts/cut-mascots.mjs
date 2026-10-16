// 붙여 받은 마스코트 이미지에서 캐릭터를 잘라 배경을 투명하게 만든 PNG로 저장
//   node scripts/cut-mascots.mjs <원본폴더>  → assets/mascot/*.png
// 배경은 잘라 낸 영역의 가장자리에서 시작해, 배경색과 비슷한 픽셀만 따라가며(flood fill) 지웁니다.
// 캐릭터 안쪽의 밝은 부분(신발, 눈 흰자)은 가장자리와 이어지지 않으면 지워지지 않아요.
// 3D 프롬이 단독 컷은 몸이 흰색이라 흰 배경과 구분이 안 돼 자동으로 떼어 낼 수 없어요(원본 PNG 필요).
import { chromium } from 'playwright-core';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = process.argv[2];
if (!src) throw new Error('원본 폴더를 넘겨 주세요');

// [파일, 이름, x, y, 너비, 높이, (배경 판정 기준 HARD, SOFT — 흰 프롬이가 있는 컷은 엄격하게)]
const CUTS = [
  ['13.png', 'duo', 0, 30, 858, 521, 9, 18],
  ['14.png', 'm-look', 92, 62, 148, 268],
  ['14.png', 'm-think', 232, 62, 140, 268],
  ['14.png', 'm-design', 368, 62, 148, 268],
  ['14.png', 'm-make', 512, 62, 150, 268],
  ['14.png', 'f-look', 40, 410, 180, 285],
  ['14.png', 'f-think', 214, 410, 166, 285],
  ['14.png', 'f-design', 376, 410, 156, 285],
  ['14.png', 'f-make', 530, 410, 176, 285],
];

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage();
await mkdir(root + 'assets/mascot', { recursive: true });

for (const [file, name, x, y, w, h, HARD = 24, SOFT = 44] of CUTS) {
  const data = 'data:image/png;base64,' + (await readFile(`${src}/${file}`)).toString('base64');
  const png = await page.evaluate(async ({ data, x, y, w, h, HARD, SOFT }) => {
    const img = new Image(); img.src = data; await img.decode();
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.drawImage(img, x, y, w, h, 0, 0, w, h);
    const im = g.getImageData(0, 0, w, h), d = im.data;
    // 배경색: 네 모서리 평균
    const at = (px, py) => (py * w + px) * 4;
    let br = 0, bg = 0, bb = 0;
    for (const [px, py] of [[1, 1], [w - 2, 1], [1, h - 2], [w - 2, h - 2]]) { const i = at(px, py); br += d[i]; bg += d[i + 1]; bb += d[i + 2]; }
    br /= 4; bg /= 4; bb /= 4;
    const dist = i => Math.hypot(d[i] - br, d[i + 1] - bg, d[i + 2] - bb);
    const seen = new Uint8Array(w * h), stack = [];
    for (let px = 0; px < w; px++) stack.push(px, 0, px, h - 1);
    for (let py = 0; py < h; py++) stack.push(0, py, w - 1, py);
    while (stack.length) {
      const py = stack.pop(), px = stack.pop();
      if (px < 0 || py < 0 || px >= w || py >= h) continue;
      const k = py * w + px; if (seen[k]) continue;
      const i = k * 4, dd = dist(i);
      // 밝고 색이 거의 없는 픽셀(바닥 그림자의 흰 얼룩)도 배경으로 이어서 지움
      const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]);
      // 흰 몸인 프롬이가 지워지지 않게, 흰 얼룩 지우기는 아래쪽 15%(발밑)에서만
      const pale = py > h * .85 && mn > 200 && mx - mn < 10;
      if (dd > SOFT && !pale) continue;
      seen[k] = 1;
      // 배경에 가까울수록 투명, 경계는 반투명으로 부드럽게
      d[i + 3] = (dd <= HARD || pale) ? 0 : Math.round(255 * (dd - HARD) / (SOFT - HARD));
      if (dd <= HARD || pale) stack.push(px + 1, py, px - 1, py, px, py + 1, px, py - 1);
    }
    g.putImageData(im, 0, 0);
    return c.toDataURL('image/png');
  }, { data, x, y, w, h, HARD, SOFT });
  await writeFile(`${root}assets/mascot/${name}.png`, Buffer.from(png.split(',')[1], 'base64'));
  console.log('cut', name);
}
await browser.close();
