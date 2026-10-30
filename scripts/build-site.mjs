// 배포용 폴더 만들기: npm run site → site/ (최종 포스터 X + 필요한 파일만)
// Vercel·GitHub Pages는 이 site/ 폴더를 그대로 올리면 돼요. 포스터를 고친 뒤에는 다시 실행하고 커밋하세요.
import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = root + 'site/';
const SHARED = ['base.css', 'core.css', 'fonts.css', 'data.js', 'kit.js', 'core.js', 'qr.svg', 'qr-apply.svg', 'qr-chat.svg',
  'smoe-logo.png', 'event.webp', 'event-card1.webp', 'event-card2.webp', 'event-card3.webp',
  'fonts/PretendardVariable.woff2', 'fonts/Galmuri11.woff2', 'fonts/Galmuri11-Bold.woff2',
  'fonts/LICENSE-pretendard.txt', 'fonts/LICENSE-galmuri.txt'];

await rm(out, { recursive: true, force: true });
await mkdir(out + 'shared/fonts', { recursive: true });
for (const f of SHARED) await copyFile(root + 'shared/' + f, out + 'shared/' + f);
// 링크 미리보기 썸네일 (npm run og 로 생성)
await copyFile(root + 'assets/og.png', out + 'og.png');

// 포스터 페이지: ../shared/ → shared/
const html = (await readFile(root + 'poster-x/index.html', 'utf8')).split('../shared/').join('shared/');
await writeFile(out + 'index.html', html);
console.log('site/ 준비 완료 —', SHARED.length + 1, '개 파일');
