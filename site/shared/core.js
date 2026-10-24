/* 시안 O·P 공통 동작: 세로/가로 자동 전환 · 점 격자 · 상세 페이지 · 초대장 봉투 · 코드 방울
   <head>에서 data.js → kit.js → core.js 순서로 불러오고, 본문 끝에서 CORE.init({...})를 호출합니다. */
window.CORE = (() => {
  const q = new URLSearchParams(location.search || location.hash.slice(1));
  const isWide = () => (q.get('layout') ? q.get('layout') === 'wide' : innerWidth / innerHeight > 1.15);
  const syncLayout = () => {
    document.documentElement.classList.toggle('wide', isWide());
    const p = document.getElementById('poster');
    if (p) p.dataset.w = isWide() ? 1200 : 794;
  };
  // ?layout=wide|tall 이 없으면 화면 비율로 고름 (head에서 바로 적용해 깜빡임 없음)
  syncLayout();
  addEventListener('resize', syncLayout);

  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function init(o) {
    const { STATIC, ANIMATE } = ENV, S = POSTER.sessions;
    const poster = $('#poster');
    syncLayout();

    // ── 점 격자: 커서 근처 점이 커지고 진해짐
    const dots = o.dots || {};
    const cv = document.createElement('canvas'); cv.className = 'dots'; poster.prepend(cv);
    const cx = cv.getContext('2d');
    let mouse = null, W = 0, H = 0, raf = 0, dpr = 1;
    const base = document.createElement('canvas'), bx = base.getContext('2d');
    // 점 하나 그리기 (k: 커서와 가까운 정도 0~1)
    const dot = (c, x, y, k, P) => {
      let r = (dots.r || 1.3) * P, a = (dots.alpha ?? .13) * (dots.fade ? dots.fade(x / W, y / H) : 1);
      r += (dots.grow || 2.8) * P * k * k; a += (dots.hot ?? .5) * k * k;
      if (a <= .005) return;
      c.globalAlpha = Math.min(1, a); c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    };
    // 기본 점은 한 번만 그려 두고, 마우스가 움직이면 커서 근처 점만 덧그림
    function drawBase() {
      const P = KIT.unit(poster), g = (dots.gap || 24) * P;
      bx.setTransform(1, 0, 0, 1, 0, 0); bx.clearRect(0, 0, base.width, base.height); bx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bx.fillStyle = dots.color || '#0E1311';
      for (let y = g / 2; y < H; y += g) for (let x = g / 2; x < W; x += g) dot(bx, x, y, 0, P);
    }
    function drawDots() {
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(base, 0, 0); cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!mouse) return;
      const P = KIT.unit(poster), g = (dots.gap || 24) * P, reach = (dots.reach || 140) * P;
      cx.fillStyle = dots.color || '#0E1311';
      const x0 = Math.max(g / 2, g / 2 + Math.ceil((mouse.x - reach - g / 2) / g) * g), y0 = Math.max(g / 2, g / 2 + Math.ceil((mouse.y - reach - g / 2) / g) * g);
      for (let y = y0; y < Math.min(H, mouse.y + reach); y += g) for (let x = x0; x < Math.min(W, mouse.x + reach); x += g) {
        const k = Math.max(0, 1 - Math.hypot(x - mouse.x, y - mouse.y) / reach);
        if (k > 0) dot(cx, x, y, k, P);
      }
    }
    function sizeDots() {
      const r = poster.getBoundingClientRect(); dpr = KIT.fxDpr(r.width);
      W = r.width; H = r.height;
      cv.width = base.width = Math.round(W * dpr); cv.height = base.height = Math.round(H * dpr);
      drawBase(); drawDots();
    }
    sizeDots(); addEventListener('resize', () => { syncLayout(); requestAnimationFrame(sizeDots); });
    if (!STATIC) {
      poster.addEventListener('pointermove', e => {
        if (e.target.closest('.story,.intro,.page,button')) return;
        const r = poster.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
        cancelAnimationFrame(raf); raf = requestAnimationFrame(drawDots);
      });
      poster.addEventListener('pointerleave', () => { mouse = null; drawDots(); });
      poster.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') { mouse = null; drawDots(); } });
    }

    // ── 상세 페이지 · 초대장 마크업 주입
    const L = o.letter || {};
    poster.insertAdjacentHTML('beforeend', `
      <section class="page" role="dialog" aria-modal="true" aria-labelledby="pgTitle">
        <div class="pg-hd"><div class="lb"></div><h2 id="pgTitle"></h2><div class="meta"></div><div class="ic"></div></div>
        <button class="pg-x" type="button" aria-label="닫기">✕</button>
        <div class="pg-bd"></div>
      </section>
      <div class="intro" aria-label="초대장 열기">
        <div class="k">NEW MESSAGE · 1</div>
        <h2>${o.intro !== 'letter' ? '교사 개발자의 날에<br>접속하시겠어요?' : '교사 개발자의 날<br>초대장이 도착했어요'}</h2>
        ${o.intro !== 'letter' ? `<div class="mon env" role="button" tabindex="0" aria-label="모니터 켜기">
          <div class="bezel"><div class="screen"><span class="off">POWER ▶ CLICK</span><div class="mterm"></div><span class="scan"></span></div><span class="brand">&gt;_ TEACHER DEV</span><span class="led"></span></div>
          <div class="neck"></div><div class="stand"></div><div class="peek"></div>
        </div>` : `<div class="env" role="button" tabindex="0" aria-label="봉투 열기">
          <div class="back"></div>
          <div class="letter"><small>${L.small || 'INVITATION · 2026'}</small><strong>${L.strong || '교사 개발자의 날에<br>초대합니다'}</strong><span>${L.span || '매달 한 번 화요일 저녁, 교실의 문제를 코드로 바꾸는 선생님들의 모임'}</span></div>
          <div class="front"></div>
          <div class="addr"><div><b>TO.</b>선생님</div><div><b>FROM.</b>교사 개발자의 날</div></div>
          <div class="stamp">SEOUL<br>2026</div>
          <div class="flap"></div>
          <div class="seal">&gt;_</div>
          <div class="peek"></div>
        </div>`}
        <div class="cta">▶ ${o.intro !== 'letter' ? '모니터를 눌러 켜 보세요' : '봉투를 눌러 열어 보세요'}</div>
        <button class="skip" type="button">건너뛰기</button>
      </div>`);

    // ── 상세 페이지: 카드에서 펼쳐짐
    const page = $('.page', poster);
    let lastCard = null;
    function openPage(i, card) {
      const s = S[i], d = s.detail;
      $('.lb', page).textContent = `${i + 1}회 · ${['경험', '실패', '구출'][i] || ''}`;
      $('h2', page).textContent = d.name;
      $('.meta', page).innerHTML = `<span>${s.mo}월 ${s.dd}일 ${s.dow}요일</span><span>${s.time}</span><span>${d.place}</span>`;
      $('.ic', page).innerHTML = o.face ? o.face(i) : '';
      // o.timetable: 분 단위 시간표 표시 여부 (false면 핵심만)
      $('.pg-bd', page).classList.toggle('no-tt', !o.timetable); page.classList.toggle('short', !o.timetable);
      $('.pg-bd', page).innerHTML = `
        <div class="full"><p class="theme">${d.theme}</p><p class="line">${d.line}</p></div>
        <div class="${o.timetable ? '' : 'full'}"><h5>이런 걸 해요</h5><ol class="flow">${d.flow.map(x => Array.isArray(x) ? `<li><span><b>${x[0]}</b><em>${x[1]}</em></span></li>` : `<li>${x}</li>`).join('')}</ol>
          ${d.for ? `<p class="for"><b>이런 분께 추천</b>${d.for}</p>` : ''}</div>
        ${o.timetable ? `<div class="tt-wrap"><h5>시간표</h5><table class="tt"><tbody>${d.timetable.map(([t, a, b]) => `<tr><td>${t}</td><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table></div>` : ''}
        <div class="how ${o.timetable ? '' : 'full'}"><b>참여 방법</b> · ${d.how}</div>
        <p class="note full">${o.timetable ? '시간표는 운영 계획(안)이라 바뀔 수 있어요. ' : ''}신청과 최신 안내는 sendev.kr에서 확인해 주세요.</p>`;
      $('.pg-bd', page).scrollTop = 0;
      page.classList.add('on');
      lastCard = card;
      if (ANIMATE && card) {
        const pr = page.getBoundingClientRect(), cr = card.getBoundingClientRect();
        page.animate([
          { transform: `translate(${cr.left - pr.left}px, ${cr.top - pr.top}px) scale(${cr.width / pr.width}, ${cr.height / pr.height})`, opacity: .6 },
          { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,.9,.25,1)' });
      }
      $('.pg-x', page).focus({ preventScroll: true });
    }
    function closePage() {
      if (!page.classList.contains('on')) return;
      const done = () => { page.classList.remove('on'); lastCard?.focus({ preventScroll: true }); };
      if (ANIMATE) page.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 180 }).onfinish = done; else done();
    }
    $$(o.cards || '[data-i]', poster).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); openPage(+b.dataset.i, b); }));
    $('.pg-x', page).addEventListener('click', e => { e.stopPropagation(); closePage(); });
    page.addEventListener('click', e => e.stopPropagation());
    addEventListener('keydown', e => { if (e.key === 'Escape') closePage(); });

    // ── 빈 곳을 누르면 코드가 쏟아짐
    const DRIP = o.drip || ['#0E1311', '#6B5BD6', '#0E1311'];
    if (!STATIC) poster.addEventListener('click', e => {
      if (e.target.closest('a,button,.page,.intro')) return;
      const r = poster.getBoundingClientRect(), y0 = e.clientY - r.top, P = KIT.unit(poster);
      for (let n = 0; n < 3; n++) {
        const d = document.createElement('span'); d.className = 'drip';
        d.textContent = KIT.SNIPPETS[Math.random() * KIT.SNIPPETS.length | 0];
        d.style.color = DRIP[n % DRIP.length];
        d.style.left = `${e.clientX - r.left + (n - 1) * 40 * P}px`; d.style.top = `${y0}px`; poster.appendChild(d);
        d.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: `translateY(${(o.floor ? o.floor() : r.height) - y0}px) rotate(${Math.random() * 40 - 20}deg)`, opacity: .1 }],
          { duration: 900 + n * 180, delay: n * 70, easing: 'cubic-bezier(.5,0,1,.8)' }).onfinish = () => d.remove();
      }
    });

    // ── 코드 분수: 봉투 입구에서
    const FOUNT = o.fountain || ['#0E1311', '#0E1311', '#6B5BD6', '#FFFFFF'];
    function fountain(px, py, { duration = 2400, spawn = 900 } = {}) {
      const r = poster.getBoundingClientRect(), dpr = KIT.fxDpr(r.width), P = KIT.unit(poster);
      const fc = document.createElement('canvas'); fc.className = 'fx'; fc.style.zIndex = 1001; poster.appendChild(fc);
      fc.width = r.width * dpr; fc.height = r.height * dpr;
      const c = fc.getContext('2d'); c.scale(dpr, dpr);
      const parts = [], t0 = performance.now();
      (function frame(t) {
        const el = t - t0;
        if (el < spawn) for (let n = 0; n < 3; n++) parts.push({
          x: px + (Math.random() < .5 ? -1 : 1) * (120 + Math.random() * 80) * P, y: py, vx: (Math.random() - .5) * 22 * P, vy: -(12 + Math.random() * 16) * P,
          s: KIT.SNIPPETS[Math.random() * KIT.SNIPPETS.length | 0], c: FOUNT[Math.random() * FOUNT.length | 0],
          z: (12 + Math.random() * 10) * P, a: (Math.random() - .5) * .6, va: (Math.random() - .5) * .05 });
        c.clearRect(0, 0, r.width, r.height);
        const fade = Math.max(0, Math.min(1, (duration - el) / 500));
        for (const p of parts) {
          p.vy += .42 * P; p.x += p.vx; p.y += p.vy; p.a += p.va;
          c.save(); c.globalAlpha = fade; c.translate(p.x, p.y); c.rotate(p.a);
          c.fillStyle = p.c; c.font = '700 ' + p.z + 'px "JetBrains Mono", monospace'; c.fillText(p.s, 0, 0); c.restore();
        }
        if (el < duration) requestAnimationFrame(frame); else fc.remove();
      })(t0);
    }

    // ── 초대장
    const intro = $('.intro', poster), env = $('.env', intro);
    $('.peek', intro).innerHTML = KIT.mascot({ face: 'happy', dark: !!o.dark });
    let opening = false;
    const reveal = () => { if (ANIMATE && o.reveal) o.reveal(); };
    // 노트북 화면 터미널
    const term = $('.mterm', intro);
    async function typeTerm() {
      const LINES = [['<b>$</b> ', 'connect teacher-dev-day --2026'], ['<i>✓</i> ', '11.3 · 11.24 · 12.15 화요일 저녁'], ['<i>✓</i> ', '참가 조건: 교실을 바꾸고 싶은 마음']];
      term.innerHTML = '';
      for (const [pre, t] of LINES) {
        const line = document.createElement('div'), s = document.createElement('span');
        line.innerHTML = pre; line.append(s); term.append(line);
        for (let k = 1; k <= t.length; k++) { s.textContent = t.slice(0, k); await KIT.wait(22); }
        await KIT.wait(120);
      }
      term.insertAdjacentHTML('beforeend', '<span class="big">교사 개발자의 날에<br><em>접속했습니다.</em></span>');
    }
    async function openEnvelope() {
      if (opening) return; opening = true;
      intro.classList.add('opened');
      setTimeout(() => intro.classList.add('flipped'), 280);
      if (term) { const sc = $('.scan', intro); if (ANIMATE && sc) sc.animate([{ transform: 'scaleY(.004) scaleX(0)', opacity: 1 }, { transform: 'scaleY(.004) scaleX(1)', opacity: 1, offset: .35 }, { transform: 'scaleY(1) scaleX(1)', opacity: .9, offset: .7 }, { transform: 'scaleY(1) scaleX(1)', opacity: 0 }], { duration: 650, easing: 'ease-out' }); await KIT.wait(700); await typeTerm(); await KIT.wait(300); } else await KIT.wait(450);
      const pr = poster.getBoundingClientRect(), er = env.getBoundingClientRect(), P = KIT.unit(poster);
      const mx = er.left - pr.left + er.width / 2, my = er.top - pr.top + (term ? 60 : 20) * P;
      KIT.burst(poster, mx / P, my / P + 20, { n: 26, colors: o.burst || ['#0E1311', '#CFC4FF', '#FFFFFF', '#FF5C39'] });
      fountain(mx, my);
      await KIT.wait(2500);
      const fade = intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
      fade.onfinish = () => { intro.classList.remove('on'); fade.cancel(); };
      reveal();
    }
    let storyRun = 0;
    function story() {
      const my = ++storyRun;
      $$('.storyfx,.story', poster).forEach(el => el.remove());
      // 계속 내리는 코드 소나기
      const r = poster.getBoundingClientRect(), dpr = KIT.fxDpr(r.width), P = KIT.unit(poster);
      const cv = document.createElement('canvas'); cv.className = 'storyfx'; poster.appendChild(cv);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      const c = cv.getContext('2d'); c.scale(dpr, dpr);
      const COLS = o.rainColors || ['#CCFF00', '#CFC4FF', '#FFFFFF', '#4FC3FF'];
      const drop = () => ({ x: Math.random() * r.width, y: -Math.random() * r.height, v: (2.5 + Math.random() * 5) * P,
        s: KIT.SNIPPETS[Math.random() * KIT.SNIPPETS.length | 0], c: COLS[Math.random() * COLS.length | 0], z: (11 + Math.random() * 10) * P });
      const drops = Array.from({ length: 110 }, drop);
      let alive = true, fade = 1;
      (function frame() {
        if (my !== storyRun) { cv.remove(); return; }
        c.globalAlpha = 1; c.fillStyle = o.rainBg || '#0E1311'; c.fillRect(0, 0, r.width, r.height);
        for (const d of drops) {
          d.y += d.v;
          if (d.y > r.height + 30) { if (alive) Object.assign(d, drop(), { y: -20 }); }
          c.globalAlpha = .9; c.fillStyle = d.c; c.font = `700 ${d.z}px "JetBrains Mono", monospace`; c.fillText(d.s, d.x - 30 * P, d.y);
        }
        cv.style.opacity = fade;
        if (fade > 0) requestAnimationFrame(frame); else cv.remove();
      })();

      const L = o.story || {};
      poster.insertAdjacentHTML('beforeend', `<div class="story" role="dialog" aria-label="초대 메시지">
        <div class="q"><span class="qt"></span><span class="cur"></span></div>
        <div class="big sl1">${L.l1 || '고민이 있다면,'}</div>
        <div class="big sl2">${L.l2 || '<em>함께</em>하시겠습니까?'}</div>
        <div class="tape2">${L.tape || '누구나 == 개발자'}</div>
        <div class="inv">${L.inv || '모든 교사 개발자를 초대합니다.'}</div>
        <button class="enter" type="button">입장하기 ▶</button>
        <button class="skip2" type="button">건너뛰기</button></div>`);
      const st = $('.story', poster);
      st.addEventListener('click', e => e.stopPropagation());
      const show = (el, from = 'translateY(24px)', dur = 520) => el.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: getComputedStyle(el).transform === 'none' ? 'none' : getComputedStyle(el).transform }],
        { duration: dur, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'forwards' });
      const enter = () => {
        if (my !== storyRun) return;
        alive = false;
        st.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(1.06)' }], { duration: 220, fill: 'forwards' }).onfinish = () => st.remove();
        const t0 = performance.now();
        (function f(t) { fade = Math.max(0, 1 - (t - t0) / 380); if (fade > 0) requestAnimationFrame(f); })(t0);
        setTimeout(reveal, 40);
      };
      $('.enter', st).addEventListener('click', enter);
      $('.skip2', st).addEventListener('click', enter);
      (async () => {
        const qt = $('.qt', st), Q = L.q || '> 교실에 고민이 있나요?';
        await KIT.wait(900);
        for (let k = 1; k <= Q.length; k++) { if (my !== storyRun) return; qt.textContent = Q.slice(0, k); await KIT.wait(55); }
        await KIT.wait(450); show($('.sl1', st));
        await KIT.wait(650); show($('.sl2', st));
        await KIT.wait(800); const tp = $('.tape2', st);
        tp.animate([{ opacity: 0, transform: 'rotate(-30deg) scale(2.4)' }, { opacity: 1, transform: 'rotate(-4deg) scale(1)' }], { duration: 420, easing: 'cubic-bezier(.3,1.3,.5,1)', fill: 'forwards' });
        await KIT.wait(550); show($('.inv', st));
        await KIT.wait(500); show($('.enter', st), 'scale(.6)'); $('.enter', st).focus({ preventScroll: true });
      })();
    }
    function showIntro() {
      if (!ANIMATE) return;
      // intro: 'story' — 코드 소나기 위로 메시지가 한 줄씩, 마지막에 [입장하기]
      if (o.intro === 'story') { closePage(); intro.classList.remove('on'); story(); return; }
      // intro: 'rain' — 클릭 없이 코드가 쏟아지고, 쏟아지는 도중 포스터가 바로 나타남 (약 1.5초)
      if (o.intro === 'rain') {
        closePage(); intro.classList.remove('on');
        KIT.codeRain(poster, { duration: 1500, density: 2.4, size: 17, bg: o.rainBg || '#0E1311', colors: o.rainColors || ['#CCFF00', '#CFC4FF', '#FFFFFF', '#4FC3FF'] });
        setTimeout(reveal, 380);
        return;
      }
      opening = false; closePage();
      if (term) term.innerHTML = '';
      intro.classList.remove('opened', 'flipped'); intro.classList.add('on');
    }
    env.addEventListener('click', e => { e.stopPropagation(); openEnvelope(); });
    env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); } });
    $('.skip', intro).addEventListener('click', e => { e.stopPropagation(); intro.classList.remove('on'); reveal(); });
    intro.addEventListener('click', e => e.stopPropagation());
    showIntro();
    $('#replay')?.addEventListener('click', showIntro);

    return { openPage, closePage, showIntro };
  }

  return { init, isWide };
})();
