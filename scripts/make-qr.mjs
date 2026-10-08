// 포스터 QR 생성: npm run qr -- [url]
// 신청 링크가 확정되면 url을 넘겨 다시 실행하고, 데이터의 cta.url도 같이 바꿔 주세요.
// (시안 A는 poster/index.html 안의 POSTER, 시안 B·C는 shared/data.js)
import QRCode from 'qrcode';
import { writeFile } from 'node:fs/promises';

const url = process.argv[2] || 'https://sendev.kr';
const svg = await QRCode.toString(url, {
  type: 'svg',
  margin: 0,
  errorCorrectionLevel: 'M',
  color: { dark: '#0E1311', light: '#0000' },
});

for (const p of ['../poster/assets/qr.svg', '../shared/qr.svg']) {
  await writeFile(new URL(p, import.meta.url), svg);
}
console.log('QR ->', url);
