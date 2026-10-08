/* ───────── 포스터 공통 내용 (시안 B·C가 함께 씀) ─────────
   null 인 값은 '추후 공지'로 표시되고, showPending 이 true면 코랄 '미정' 표시가 붙습니다. */
window.POSTER = {
  cta: { url: 'https://sendev.kr', label: 'sendev.kr' },
  host: '서울특별시교육청',
  team: '교사개발자 문화조성분과',
  showPending: true,                       // 최종본에서는 false
  sessions: [
    { date: '2026-10-27', step: '시작', key: 'init', sticker: '>_<br>init', rot: -8,
      short: '「교사개발자 FM」 첫 방송', title: '「교사개발자 FM」 첫 방송<br>만들기 전과 후',
      format: '온라인 생방송', place: '교육청 스튜디오 송출',
      main: '생활지도·수업·행정 교사 게스트 3명의 DJ 인터뷰',
      join: '「나는 어떤 교사 개발자?」 유형 테스트 · 보이는 라디오',
      time: '19:00–21:00', apply: null, pending: false,
      // 시안 L 상세 페이지용 — 2026.10 운영 계획(안) 기준, 확정 전
      detail: {
        name: '서로의 경험을 잇는 날', when: '10월의 마지막 화요일', wx: '맑음', place: '온라인',
        theme: '교사 개발자의 첫걸음: 경험을 나누고 서로 연결하기',
        line: '개발 경험이 있어도, 없어도 괜찮아요. 각자의 교실 이야기와 자주 쓰는 도구를 나눠요.',
        flow: ['환영 영상과 오프닝', '자기소개와 개발 경험 나눔 (개발 경험 없음 / 생활지도·수업·행정 사례)', '자주 쓰는 개발 도구와 실용 팁 소개', '도움이 된 경험에 하트 투표', '원하는 분끼리 연락처 나누기'],
        timetable: [['19:00', '오프닝·환영 영상', '취지와 진행 순서 안내'], ['19:05', '자기소개·경험 작성', '이름·소속·관심사·개발 경험'],
          ['19:15', '사용 도구 소개 작성', '도구 이름·장점·활용 사례·팁'], ['19:25', '경험 나눔 발표', '개발 경험이 없는 분부터 생활지도·수업·행정 사례 순'],
          ['19:50', '사용 도구 소개 발표', '언제 쓰면 좋은지, 장단점, 팁'], ['20:10', '하트 투표·칭찬', '도움이 된 게시물에 하트'],
          ['20:25', '즉석 고민 경매', '교실 고민을 골라 구현 아이디어 나누기'], ['20:45', '연락처 나누기', '원하는 분만 자율 공유'], ['20:55', '마무리', '한 줄 소감, 다음 만남 안내']],
        how: '집에서 편하게 접속해요. 발표는 자원자 중심이라 듣기만 해도 괜찮아요.',
      } },
    { date: '2026-11-24', step: '실패', key: 'error', sticker: 'ERR<br>!', rot: 7,
      short: '실패의 날 × 외국인 개발자', title: '실패의 날<br>× 외국인 개발자 커뮤니티',
      format: '오프라인 + 실시간 송출', place: '장소 추후 공지',
      main: '외국인 개발자 발표 · 교사 개발자 발표 2명',
      join: '외국인·교사 개발자가 섞여 앉는 네트워킹',
      time: '19:00–21:00', apply: null, pending: true,
      detail: {
        name: '실패의 날 × 외국인 개발자 커뮤니티', when: '11월의 마지막 화요일', wx: '소나기', place: '서울시교육청 스튜디오 · 실시간 송출',
        theme: '실패와 디버깅: 두 개발자 커뮤니티가 만나는 밤',
        line: '한국에서 일하는 외국인 개발자들과 실패담, 디버깅 이야기를 나눠요. 현장은 대화, 온라인은 시청과 질문.',
        flow: ['두 커뮤니티 소개', '외국인 개발자 커뮤니티 강연과 질의응답 (실시간 번역 자막)', '외국인·교사 개발자가 섞여 앉는 소통 시간', '제3회 예고와 단체 사진'],
        timetable: [['18:10', '저녁 식사·등록', '현장 참여자 서명, 명찰'], ['19:00', '오프닝', '「교사 개발자의 날」과 두 커뮤니티 소개'],
          ['19:10', '1차시 강연', '외국인 개발자 커뮤니티 강연, 번역 자막'], ['20:00', '쉬는 시간', '두 커뮤니티가 섞이도록 자리 이동'],
          ['20:10', '2차시 소통', '실패담 테이블 대화 등 (세부안 조정 중)'], ['20:55', '닫는 말', '소감, 제3회 예고, 단체 사진']],
        how: '현장 참여는 신청자 대상(저녁 식사 제공), 온라인은 실시간 송출로 누구나 시청할 수 있어요.',
      } },
    { date: '2026-12-15', step: '구출', key: 'fix', sticker: 'fix<br>✓', rot: -5,
      short: '「구해줘요, 교사 개발자!」', title: '「구해줘요, 교사 개발자!」<br>1년 마무리',
      format: '온라인 생방송', place: '스튜디오 송출 예정',
      main: '미리 받은 사연을 교사 개발자가 해결하고 견적 공개',
      join: '사연은 미리 제출, 당일은 시청·반응',
      time: '18:00–20:00', apply: null, pending: true,
      detail: {
        name: '구해줘요, 교사 개발자!', when: '12월은 연말 특집', wx: '무지개', place: '온라인',
        theme: '교사 구출 대작전: 교실 고민 사연에 즉석 견적과 해결 팁을',
        line: '교실의 고민을 사연으로 올리면 교사 개발자가 쉬운 말로 즉석 견적과 해결 팁을 드려요. 1년을 마무리하는 라이브 토크쇼.',
        flow: ['행정 · 수업 · 순수 상상, 세 라운드의 사연 접수', '공감을 많이 받은 사연에 교사 개발자의 즉석 견적', '라운드별 우승 사연 선정', '오늘 입양된 소원 정리와 내년 예고'],
        timetable: [['18:00', '오프닝', '의뢰인·개발자 역할 안내, 개발 용어 금지 룰'], ['18:10', '1라운드 · 행정', '나를 가장 야근하게 만든 업무는?'],
          ['18:35', '2라운드 · 수업', '수업에 이런 기능이 있었다면'], ['19:00', '3라운드 · 순수 상상', '머릿속에만 있던 아이디어'],
          ['19:25', '우승 사연 선정', '라운드별 1개씩'], ['19:45', '마무리', '입양된 소원 정리, 소감, 클로징']],
        how: '사연은 익명으로 올리고, 당일에는 채팅과 이모지로 반응하면 돼요. 준비물은 없어요.',
      } },
  ],
};

/* 공통 계산: ?static(PNG 모드), ?focus=N(강조 회차) */
(() => {
  const q = new URLSearchParams(location.search || location.hash.slice(1));
  const S = POSTER.sessions;
  const parse = d => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd); };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let fi = Number(q.get('focus')) - 1;
  if (!(fi >= 0 && fi < S.length)) { fi = S.findIndex(s => parse(s.date) >= today); if (fi < 0) fi = S.length - 1; }
  const DOW = ['일', '월', '화', '수', '목', '금', '토'];
  S.forEach(s => { const d = parse(s.date); s.mmdd = s.date.slice(5).replace('-', '.'); s.dow = DOW[d.getDay()]; s.mo = d.getMonth() + 1; s.dd = d.getDate(); });
  const days = Math.round((parse(S[fi].date) - today) / 864e5);
  window.ENV = {
    STATIC: q.has('static'),
    ANIMATE: !q.has('static') && !matchMedia('(prefers-reduced-motion: reduce)').matches,
    fi, F: S[fi],
    dday: days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : 'ON AIR',
    pendTag: POSTER.showPending ? '<span class="pending">미정</span>' : '',
  };
  if (ENV.STATIC) document.documentElement.classList.add('static');
  if (q.has('embed')) document.documentElement.classList.add('embed');
})();
