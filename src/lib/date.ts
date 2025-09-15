// src/lib/date.ts

// 2자리 패드
export const pad2 = (n: number) => String(n).padStart(2, '0');

// '오전/오후 + 12시제' → 'HH:MM' (24시)
export function to24h(period: '오전' | '오후', h12: number, m: number) {
  let H = h12 % 12;
  if (period === '오후') H += 12;
  return `${pad2(H)}:${pad2(m)}`;
}

// 'HH:MM' → 화면용 한국어 라벨(오전/오후 12:34)
export function toKoreanTimeLabelFromHHMM(hhmm: string) {
  const [H, M] = hhmm.split(':').map(Number);
  const isAM = H < 12;
  const h12 = ((H + 11) % 12) + 1;
  return `${isAM ? '오전' : '오후'} ${pad2(h12)}:${pad2(M)}`;
}

// 'HH:MM' → 알림용(24시 표기: 08시 05분)
export function to24hKoreanLabel(hhmm: string) {
  const [H, M] = hhmm.split(':').map(Number);
  return `${pad2(H)}시 ${pad2(M)}분`;
}
