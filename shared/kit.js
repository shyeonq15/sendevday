/* 시안 공통 부품: 8비트 프롬이 + 등장 효과 */
window.KIT = (() => {
  // ── 프롬이 (20×20 픽셀). K 잉크 · W 흰색 · G 그늘 · P 볼 · L 라임
  const BASE = [
    '......KKKKKKKK......',
    '......KLKKKKKK......',
    '......KKLKKKKK......',
    '......KLKKLLLK......',
    '......KKKKKKKK......',
    '.........KK.........',
    '....KKKKKKKKKKKK....',
    '...KWWWWWWWWWWWWK...',
    '..KWWWWWWWWWWWWWGK..',
    '.KWWWWWWWWWWWWWWWGK.',
    '.KWWWKKWWWWWWKKWWGK.',
    '.KWWWKKWWWWWWKKWWGK.',
    '.KWPPWWWWWWWWWWPPGK.',
    '.KWWWWWWKWWKWWWWWGK.',
    '.KWWWWWWWKKWWWWWWGK.',
    '..KWWWWWWWWWWWWWGK..',
    '...KWWKKKKKKKKKKK...',
    '..KWWK..............',
    '.KWK................',
    '.KK.................',
  ];
  const swap = (rows, r, s) => rows.map((x, i) => (i in r ? r[i] : x));
  const FRAMES = {
    idle: BASE,
    blink: swap(BASE, { 10: '.KWWWWWWWWWWWWWWWGK.', 11: '.KWWWKKWWWWWWKKWWGK.' }),
    happy: swap(BASE, {
      10: '.KWWWKKWWWWWWKKWWGK.', 11: '.KWWKWWKWWWWKWWKWGK.',
      13: '.KWWWWWWKKKKWWWWWGK.', 14: '.KWWWWWWKPPKWWWWWGK.' }),
    oops: swap(BASE, {
      10: '.KWWKWWKWWWWKWWKWGK.', 11: '.KWWWKKWWWWWWKKWWGK.',
      13: '.KWWWWWWWKKWWWWWWGK.', 14: '.KWWWWWWKWWKWWWWWGK.' }),
  };
  // 머리 장식 바꾸기: 새싹(입문형) · 깃발(도전형)
  const HEAD = {
    sprout: ['....................', '......KKK..KKK......', '.....KLLLKKLLLK.....', '......KLLLLLLK......', '.........KK.........', '.........KK.........'],
    flag: ['.........KKKKKKK....', '.........KCCCCCK....', '.........KCCCCK.....', '.........KKKKK......', '.........K..........', '.........KK.........'],
  };
  FRAMES.sprout = swap(BASE, { ...HEAD.sprout });
  FRAMES.sprout_blink = swap(FRAMES.blink, { ...HEAD.sprout });
  FRAMES.flag = swap(FRAMES.happy, { ...HEAD.flag });
  FRAMES.flag_blink = swap(FRAMES.blink, { ...HEAD.flag });
  const EGG = [
    '....................', '....................', '....................', '....................',
    '........KKKK........', '......KKWWWWKK......', '.....KWWWWWWWGK.....', '....KWWWLWWWWWGK....',
    '....KWWLLLWWWWGK....', '...KWWWWLWWWWWWGK...', '...KWWWWWWWWLWWGK...', '...KWWWWWWWLLLWGK...',
    '...KWLWWWWWWLWWGK...', '...KLLLWWWWWWWWGK...', '...KWLWWWWWWWWWGK...', '....KWWWWWWWWWGK....',
    '.....KKWWWWWWGKK....', '.......KKKKKK.......', '....................', '....................',
  ];
  const COL = { K: '#0E1311', W: '#FFFFFF', G: '#D3D8CE', P: '#FFB8CB', L: '#CCFF00' };

  function sprite(name = 'idle', { cls = '', colors = {} } = {}) {
    return pix(name === 'egg' ? EGG : FRAMES[name] || BASE, { cls: `prom ${cls}`, colors });
  }
  // 임의 픽셀 그림: rows 문자열 배열 → SVG (C 코랄 · V 라일락 추가)
  function pix(rows, { cls = '', colors = {} } = {}) {
    const c = { ...COL, C: '#FF5C39', V: '#CFC4FF', ...colors }, w = rows[0].length, h = rows.length;
    let r = '';
    rows.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x]; let w = 1;
        while (row[x + w] === ch) w++;
        if (ch !== '.') r += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${c[ch]}"/>`;
        x += w;
      }
    });
    return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true" style="display:block">${r}</svg>`;
  }
  // 깜빡임: el 안의 프롬이를 가끔 blink 프레임으로
  function alive(el, base = 'idle') {
    if (!ENV.ANIMATE) return;
    const tick = () => {
      const f = el.dataset.face || base;
      el.innerHTML = sprite(FRAMES[`${f}_blink`] ? `${f}_blink` : 'blink');
      setTimeout(() => { el.innerHTML = sprite(el.dataset.face || base); }, 140);
      setTimeout(tick, 2200 + Math.random() * 2600);
    };
    setTimeout(tick, 1800);
  }

  // ── 매끈한 프롬이 (SNS 기획안 원본 SVG 기반) + 날씨 장식
  //    face: idle · happy · worry   /   weather: sun · rain · rainbow
  let gid = 0;
  function mascot({ face = 'idle', weather = '', cls = '', dark = false } = {}) {
    const g = `pg${++gid}`, ink = '#0E1311', tag = dark ? '#CCFF00' : ink, tagTxt = dark ? ink : '#CCFF00';
    const behind = {
      sun: `<g transform="translate(26 22)">${[0, 45, 90, 135, 180, 225, 270, 315].map(a =>
        `<line x1="0" y1="-34" x2="0" y2="-46" stroke="${ink}" stroke-width="5" stroke-linecap="round" transform="rotate(${a})"/>`).join('')}
        <circle r="26" fill="#CCFF00" stroke="${ink}" stroke-width="5"/></g>`,
      rainbow: [['#FF5C39', 98], ['#CCFF00', 84], ['#CFC4FF', 70]].map(([c, r]) =>
        `<path d="M${100 - r} 108 A${r} ${r} 0 0 1 ${100 + r} 108" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round"/>`).join(''),
    }[weather] || '';
    const front = {
      rain: `<g transform="translate(172 -30)"><path d="M-30 22 a18 18 0 0 1 8-30 a22 22 0 0 1 40-4 a16 16 0 0 1 18 30z" fill="#E6EBF0" stroke="${ink}" stroke-width="4.5" stroke-linejoin="round"/>
        ${[[-18, 34], [0, 40], [18, 34]].map(([x, y]) => `<path d="M${x} ${y} l-5 13" stroke="#6B5BD6" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>
        <path d="M156 64 q-8 12 0 17 q8 -5 0 -17z" fill="#9FD8FF" stroke="${ink}" stroke-width="2.5"/>`,
      rainbow: `${[[18, 40, 9], [182, 56, 7], [168, 6, 6]].map(([x, y, s]) =>
        `<path d="M${x} ${y - s * 1.6} L${x + s * .45} ${y - s * .45} L${x + s * 1.6} ${y} L${x + s * .45} ${y + s * .45} L${x} ${y + s * 1.6} L${x - s * .45} ${y + s * .45} L${x - s * 1.6} ${y} L${x - s * .45} ${y - s * .45}Z" fill="#fff" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>`).join('')}`,
    }[weather] || '';
    const eyes = face === 'happy'
      ? `<path d="M68 100 Q78 84 88 100" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><path d="M112 100 Q122 84 132 100" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`
      : `<ellipse cx="78" cy="96" rx="8.5" ry="12" fill="${ink}"/><ellipse cx="122" cy="96" rx="8.5" ry="12" fill="${ink}"/><circle cx="81" cy="91" r="3.2" fill="#fff"/><circle cx="125" cy="91" r="3.2" fill="#fff"/>
         ${face === 'worry' ? `<path d="M64 82 L88 74" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/><path d="M136 82 L112 74" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>` : ''}`;
    const mouth = face === 'happy'
      ? `<path d="M86 113 Q100 134 114 113 Z" fill="${ink}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="100" cy="123" rx="6" ry="3.5" fill="#FFB8CB"/>`
      : face === 'worry'
        ? `<path d="M90 121 Q95 116 100 121 Q105 126 110 121" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>`
        : `<path d="M89 116 Q100 127 111 116" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/>`;
    return `<svg class="mascot ${cls}" viewBox="-24 -44 248 244" aria-hidden="true" style="display:block;overflow:visible">
      <defs><radialGradient id="${g}" cx=".35" cy=".28" r=".85"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F1F2EC"/><stop offset="1" stop-color="#C9CEC4"/></radialGradient></defs>
      ${behind}
      <ellipse cx="100" cy="190" rx="58" ry="7" fill="${ink}" opacity=".14"/>
      <line x1="100" y1="44" x2="100" y2="24" stroke="${tag}" stroke-width="5" stroke-linecap="round"/>
      <rect x="76" y="4" width="48" height="24" rx="8" fill="${tag}"/>
      <text x="100" y="21.5" font-family="JetBrains Mono,monospace" font-size="14" font-weight="800" fill="${tagTxt}" text-anchor="middle">&gt;_</text>
      <path d="M60 140 L44 176 L96 148 Z" fill="url(#${g})" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
      <rect x="22" y="40" width="156" height="114" rx="52" fill="url(#${g})" stroke="${ink}" stroke-width="4"/>
      <path d="M58 146 L96 148" stroke="url(#${g})" stroke-width="6"/>
      <ellipse cx="68" cy="62" rx="28" ry="9" fill="#fff" opacity=".85"/>
      ${eyes}
      <ellipse cx="58" cy="116" rx="11" ry="6.5" fill="#FFB8CB" opacity=".85"/><ellipse cx="142" cy="116" rx="11" ry="6.5" fill="#FFB8CB" opacity=".85"/>
      ${mouth}${front}
    </svg>`;
  }

  // ── 2D 플랫 데브쌤: who 'm'(짙은 재킷·청록 바지) | 'f'(청록 재킷·짙은 바지)
  //    pose: look(살펴보고) · think(고민하고) · design(설계하고) · make(만들어요)
  function devssam({ who = 'm', pose = 'look', cls = '' } = {}) {
    const ink = '#0E1311', skin = '#FFD3B6', hair = '#6B3F2A', shirt = '#CFC4FF', shoe = '#F4EFE4';
    const jacket = who === 'm' ? '#3A3F44' : '#1E6B72', pants = who === 'm' ? '#1E6B72' : '#3A3F44';
    const hairBack = who === 'f' ? `<path d="M24 52 Q22 14 60 14 Q98 14 96 52 L99 96 Q86 104 80 84 L40 84 Q34 104 21 96 Z" fill="${hair}"/>` : '';
    const hairTop = who === 'm'
      ? `<path d="M29 54 Q24 14 62 14 Q98 16 92 52 Q86 34 66 34 Q52 28 40 40 Q34 46 29 54 Z" fill="${hair}"/><path d="M58 16 Q80 10 90 30 Q76 22 62 26 Z" fill="#7E4C33"/>`
      : `<path d="M28 56 Q24 14 60 14 Q96 14 92 56 Q84 30 60 32 Q40 30 28 56 Z" fill="${hair}"/><path d="M40 22 Q60 12 80 22 Q62 20 46 34 Z" fill="#7E4C33"/>`;
    const arm = (d, hx, hy, extra = '') => `<path d="${d}" fill="none" stroke="${jacket}" stroke-width="13" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="6.5" fill="${skin}"/>${extra}`;
    const R = {
      look: arm('M84 98 Q100 72 74 40', 72, 40),
      think: arm('M84 98 Q96 116 66 86', 64, 84),
      design: arm('M84 98 Q96 126 80 126', 79, 125, `<path d="M79 125 L70 110" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`),
      make: arm('M84 98 Q102 92 97 68', 97, 64, `<path d="M97 62 L97 50" stroke="${skin}" stroke-width="5" stroke-linecap="round"/>`),
    }[pose] || '';
    const mouth = pose === 'think' ? `<path d="M56 74 Q60 72 64 74" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>`
      : `<path d="M54 71 Q60 79 66 71 Z" fill="${ink}"/>`;
    const eyeY = pose === 'look' ? 58 : 56;
    return `<svg class="devssam ${cls}" viewBox="0 0 120 216" aria-hidden="true" style="display:block;overflow:visible">
      ${hairBack}
      <path d="M38 148 L36 200 L57 200 L59 150 Z" fill="${pants}"/><path d="M61 150 L63 200 L84 200 L82 148 Z" fill="${pants}"/>
      <ellipse cx="46" cy="204" rx="14" ry="6.5" fill="${shoe}"/><ellipse cx="74" cy="204" rx="14" ry="6.5" fill="${shoe}"/>
      <path d="M38 202 L44 202" stroke="#CCFF00" stroke-width="3" stroke-linecap="round"/><path d="M76 202 L82 202" stroke="#CCFF00" stroke-width="3" stroke-linecap="round"/>
      <path d="M34 94 Q60 82 86 94 L92 152 L28 152 Z" fill="${jacket}"/>
      <path d="M50 88 L60 116 L70 88 Z" fill="${shirt}"/>
      ${who === 'f' ? `<path d="M42 104 L42 116" stroke="#CCFF00" stroke-width="3" stroke-linecap="round"/>` : ''}
      <circle cx="31" cy="58" r="7" fill="${skin}"/><circle cx="89" cy="58" r="7" fill="${skin}"/>
      <circle cx="60" cy="54" r="30" fill="${skin}"/>
      ${hairTop}
      <path d="M44 ${eyeY - 12} L54 ${eyeY - 13}" stroke="${hair}" stroke-width="3" stroke-linecap="round"/><path d="M66 ${eyeY - 13} L76 ${eyeY - 12}" stroke="${hair}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="50" cy="${eyeY}" rx="5.5" ry="7" fill="${ink}"/><ellipse cx="70" cy="${eyeY}" rx="5.5" ry="7" fill="${ink}"/>
      <circle cx="51.8" cy="${eyeY - 2.5}" r="1.9" fill="#fff"/><circle cx="71.8" cy="${eyeY - 2.5}" r="1.9" fill="#fff"/>
      <ellipse cx="41" cy="68" rx="6" ry="3.5" fill="#FFB8CB"/><ellipse cx="79" cy="68" rx="6" ry="3.5" fill="#FFB8CB"/>
      ${mouth}
      <g transform="rotate(-10 72 124)"><rect x="54" y="110" width="38" height="28" rx="5" fill="#2A2F33"/>
        <rect x="59" y="115" width="12" height="7" rx="2" fill="${shirt}"/><circle cx="84" cy="118" r="3.5" fill="#CCFF00"/><rect x="59" y="126" width="22" height="4" rx="2" fill="#555B60"/></g>
      ${arm('M36 98 Q34 126 56 128', 57, 128)}
      ${R}
    </svg>`;
  }

  // ── 2D 플랫 프롬이: 그라데이션·그림자 없이 면과 선만
  //    face: happy · idle · wink · worry · star   body: 몸 색   line: 안테나 선 색(어두운 배경이면 흰색)
  //    acc: headset(1회 보이는 라디오) · bug(2회 디버깅) · cape(3회 구출 히어로)
  function flat({ face = 'happy', body = '#FFFFFF', line = '#0E1311', tag = '#CCFF00', cls = '', acc = '' } = {}) {
    const ink = '#0E1311';
    const eye = (x, kind) => kind === 'arc'
      ? `<path d="M${x - 11} ${100} Q${x} ${84} ${x + 11} ${100}" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>`
      : kind === 'star'
        ? `<path d="M${x} 80 L${x + 4} 90 L${x + 14} 94 L${x + 4} 98 L${x} 108 L${x - 4} 98 L${x - 14} 94 L${x - 4} 90Z" fill="${ink}"/>`
        : `<ellipse cx="${x}" cy="94" rx="9" ry="12" fill="${ink}"/>`;
    const eyes = face === 'happy' ? eye(76, 'arc') + eye(124, 'arc')
      : face === 'wink' ? eye(76, 'dot') + eye(124, 'arc')
      : face === 'star' ? eye(76, 'star') + eye(124, 'star')
      : eye(76, 'dot') + eye(124, 'dot');
    // 몸 뒤에 그리는 소품
    const back = {
      headset: `<path d="M22 104 Q22 22 100 22 Q178 22 178 104" fill="none" stroke="${line === ink ? ink : "#CFC4FF"}" stroke-width="9" stroke-linecap="round"/>`,
      cape: `<path d="M44 92 L8 176 Q100 196 192 176 L156 92 Z" fill="#FF5C39"/>`,
    }[acc] || '';
    // 몸 앞에 그리는 소품
    const front = {
      headset: `<rect x="4" y="84" width="26" height="40" rx="11" fill="#CCFF00" stroke="${ink}" stroke-width="5"/><rect x="170" y="84" width="26" height="40" rx="11" fill="#CCFF00" stroke="${ink}" stroke-width="5"/>
        <path d="M18 122 Q22 146 52 144" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="144" r="7" fill="${ink}"/>`,
      bug: `<g transform="translate(166 40) rotate(18)"><g stroke="${ink}" stroke-width="3.5" stroke-linecap="round"><line x1="-13" y1="-4" x2="-22" y2="-10"/><line x1="-13" y1="6" x2="-23" y2="8"/><line x1="13" y1="-4" x2="22" y2="-10"/><line x1="13" y1="6" x2="23" y2="8"/><line x1="-5" y1="-15" x2="-9" y2="-24"/><line x1="5" y1="-15" x2="9" y2="-24"/></g>
        <ellipse cx="0" cy="2" rx="14" ry="17" fill="#CFC4FF" stroke="${ink}" stroke-width="4"/><line x1="0" y1="-14" x2="0" y2="18" stroke="${ink}" stroke-width="3"/></g>`,
      cape: `<path d="M150 150 L157 164 L172 166 L161 176 L164 190 L150 183 L136 190 L139 176 L128 166 L143 164Z" fill="#CCFF00" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round"/>`,
    }[acc] || '';
    const brows = face === 'worry' ? `<path d="M62 78 L88 70" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><path d="M138 78 L112 70" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>` : '';
    const mouth = face === 'worry'
      ? `<path d="M88 124 Q94 118 100 124 Q106 130 112 124" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`
      : `<path d="M86 116 Q100 134 114 116 Z" fill="${ink}"/>`;
    return `<svg class="flat ${cls}" viewBox="0 0 200 190" aria-hidden="true" style="display:block;overflow:visible">
      ${back}
      <line x1="100" y1="46" x2="100" y2="28" stroke="${line}" stroke-width="7" stroke-linecap="round"/>
      <rect x="72" y="4" width="56" height="28" rx="9" fill="${tag}"/>
      <text x="100" y="24.5" font-family="JetBrains Mono,monospace" font-size="16" font-weight="800" fill="${ink}" text-anchor="middle">&gt;_</text>
      <path d="M58 136 L38 180 L100 146 Z" fill="${body}"/>
      <rect x="18" y="42" width="164" height="112" rx="52" fill="${body}"/>
      ${brows}${eyes}
      <ellipse cx="56" cy="118" rx="12" ry="7" fill="#FFB8CB"/><ellipse cx="144" cy="118" rx="12" ry="7" fill="#FFB8CB"/>
      ${mouth}${front}
    </svg>`;
  }

  // 장식용 캔버스 해상도 상한: 최대 1.5배, 가로 2400px 이하 (큰 화면에서 매 프레임 칠할 픽셀 수 제한)
  const fxDpr = w => Math.max(.5, Math.min(devicePixelRatio || 1, 1.5, 2400 / Math.max(1, w)));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  // 포스터 기준 너비: A4 세로는 794, 가로형은 data-w로 지정
  const baseW = poster => +(poster.dataset.w || 794);
  const unit = poster => poster.getBoundingClientRect().width / baseW(poster);

  function canvasOver(poster) {
    const cv = document.createElement('canvas'); cv.className = 'fx';
    poster.appendChild(cv);
    const r = poster.getBoundingClientRect(), dpr = fxDpr(r.width);
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    const cx = cv.getContext('2d'); cx.scale(dpr, dpr);
    return { cv, cx, W: r.width, H: r.height, P: r.width / baseW(poster) };
  }

  // ── 코드 소나기: 코드 조각이 위에서 쏟아졌다가 사라짐
  const SNIPPETS = ['const 자리 = shuffle(학생);', '출석.check() // 26/26 ✓', '>_', '{ }', '</>', 'if (숙제 === "안냄") 알림();',
    '급식.오늘()', 'while (쉬는시간) 놀기();', 'import 교실', 'git commit -m "첫 앱"', 'npm run 우리반', 'ERR! 다시 해 볼까요?',
    'fix ✓', 'console.log("안녕")', '프롬아 도와줘', 'random(모둠)', '학급.공지()', 'save();', '=> ♥', '10.27', '11.24', '12.15'];
  function codeRain(poster, { duration = 2400, colors = ['#0E1311'], bg = null, font = 'mono', size = 15, density = 1 } = {}) {
    if (!ENV.ANIMATE) return Promise.resolve();
    const { cv, cx, W, H, P } = canvasOver(poster);
    const fam = font === 'pixel' ? 'Galmuri11, monospace' : '"JetBrains Mono", monospace';
    const drops = Array.from({ length: Math.round(46 * density) }, () => ({
      x: Math.random() * W, y: -Math.random() * H * 1.2, v: (3 + Math.random() * 6) * P,
      s: SNIPPETS[Math.random() * SNIPPETS.length | 0], c: colors[Math.random() * colors.length | 0],
      z: (.7 + Math.random() * .8) * size * P }));
    const t0 = performance.now();
    return new Promise(done => {
      (function frame(t) {
        const k = (t - t0) / duration;
        cx.clearRect(0, 0, W, H);
        if (bg) { cx.globalAlpha = Math.min(1, (1 - k) * 2.2); cx.fillStyle = bg; cx.fillRect(0, 0, W, H); }
        drops.forEach(d => {
          d.y += d.v * (1 + k * 1.5);
          if (d.y > H + 40 && k < .7) d.y = -30;
          cx.globalAlpha = Math.max(0, Math.min(1, (1 - k) * 2.5));
          cx.fillStyle = d.c; cx.font = `700 ${d.z}px ${fam}`; cx.fillText(d.s, d.x - 40 * P, d.y);
        });
        if (k < 1) requestAnimationFrame(frame); else { cv.remove(); done(); }
      })(t0);
    });
  }

  // ── 픽셀 디졸브: 덮개 색 칸들이 무작위로 사라지며 화면이 드러남
  function pixelReveal(poster, { color = '#0E1311', cell = 28, duration = 900 } = {}) {
    if (!ENV.ANIMATE) return Promise.resolve();
    const { cv, cx, W, H, P } = canvasOver(poster);
    const c = cell * P, cols = Math.ceil(W / c), rows = Math.ceil(H / c);
    const cells = Array.from({ length: cols * rows }, (_, i) => [i % cols, i / cols | 0, Math.random()]);
    const t0 = performance.now();
    return new Promise(done => {
      (function frame(t) {
        const k = Math.min(1, (t - t0) / duration);
        cx.clearRect(0, 0, W, H); cx.fillStyle = color;
        cells.forEach(([x, y, r]) => { if (r > k) cx.fillRect(x * c, y * c, c + .5, c + .5); });
        if (k < 1) requestAnimationFrame(frame); else { cv.remove(); done(); }
      })(t0);
    });
  }

  // ── 타이핑
  async function type(el, text, ms = 38) {
    if (!ENV.ANIMATE) { el.textContent = text; return; }
    el.textContent = '';
    for (let i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await wait(ms); }
  }

  // ── 픽셀 컨페티: (x, y)에서 네모 조각이 튀어 오름 (단위: 포스터 좌표 u)
  function burst(poster, x, y, { n = 18, colors = ['#CCFF00', '#CFC4FF', '#FFB8CB', '#0E1311'], spread = 140 } = {}) {
    if (ENV.STATIC) return;
    const P = unit(poster);
    for (let i = 0; i < n; i++) {
      const b = document.createElement('i'), s = (5 + Math.random() * 7) * P;
      Object.assign(b.style, { position: 'absolute', left: `${x * P}px`, top: `${y * P}px`, width: `${s}px`, height: `${s}px`,
        background: colors[i % colors.length], zIndex: 998, pointerEvents: 'none' });
      poster.appendChild(b);
      const a = Math.random() * Math.PI * 2, d = (40 + Math.random() * spread) * P;
      b.animate([{ transform: 'translate(0,0)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d - 60 * P}px)`, opacity: 1, offset: .6 },
        { transform: `translate(${Math.cos(a) * d * 1.2}px, ${Math.sin(a) * d + 80 * P}px)`, opacity: 0 }],
        { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => b.remove();
    }
  }

  // ── 통통 등장: 요소들을 차례로 튀어나오게
  function pop(els, { delay = 0, stagger = 110, from = 'scale(.3)' } = {}) {
    if (!ENV.ANIMATE) return;
    [...els].forEach((el, i) => {
      const r = getComputedStyle(el).transform, base = r === 'none' ? '' : r;
      el.animate([{ transform: `${base} ${from}`, opacity: 0 }, { transform: `${base} scale(1.08)`, opacity: 1, offset: .7 }, { transform: base || 'none', opacity: 1 }],
        { duration: 520, delay: delay + i * stagger, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'backwards' });
    });
  }
  // 위에서 떨어져 통 튕기기
  function drop(els, { delay = 0, stagger = 90, height = 420 } = {}) {
    if (!ENV.ANIMATE) return;
    [...els].forEach((el, i) => {
      const r = getComputedStyle(el).transform, base = r === 'none' ? '' : r;
      el.animate([
        { transform: `${base} translateY(-${height}px)`, opacity: 0, easing: 'cubic-bezier(.5,0,1,.6)' },
        { transform: `${base} translateY(0)`, opacity: 1, offset: .55, easing: 'cubic-bezier(0,.4,.5,1)' },
        { transform: `${base} translateY(-24px)`, offset: .75, easing: 'cubic-bezier(.5,0,1,.6)' },
        { transform: base || 'none' }],
        { duration: 820, delay: delay + i * stagger, fill: 'backwards' });
    });
  }

  return { fxDpr, sprite, pix, mascot, flat, devssam, alive, wait, unit, codeRain, pixelReveal, type, burst, pop, drop, SNIPPETS };
})();
