// src/lib/notifications.ts
import * as Notifications from 'expo-notifications';
import { to24hKoreanLabel } from '../lib/date';

/** 한글 요일 → iOS/Android 공통 weekday 숫자(1=일, ..., 7=토) */
const KOR_DAY_TO_WEEKDAY: Record<string, number> = {
  '일': 1, '월': 2, '화': 3, '수': 4, '목': 5, '금': 6, '토': 7,
};

function toWeekday(dayKr: string) {
  const w = KOR_DAY_TO_WEEKDAY[dayKr];
  if (!w) throw new Error(`지원하지 않는 요일: ${dayKr}`);
  return w;
}

function parseHHmm(t: string) {
  const [h, m] = t.split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) throw new Error(`시간 형식 오류: ${t}`);
  return { hour: h, minute: m };
}

/** 기준 시각의 10분 전을 구함. 0시 0~9분인 경우 전날로 넘어감(prevDay=true). */
function minus10m(hour: number, minute: number) {
  let h = hour;
  let m = minute - 10;
  let prevDay = false;
  if (m < 0) {
    m += 60;
    h = (h - 1 + 24) % 24;
    if (hour === 0 && minute < 10) prevDay = true;
  }
  return { hour: h, minute: m, prevDay };
}
function prevWeekday(weekday: number) {
  return weekday === 1 ? 7 : weekday - 1;
}

export async function scheduleWeeklyNotifications({
  selectedDays,
  times,
  tenMinutesBefore,
  drugName,
}: {
  selectedDays: string[];      // ['월','수','금'] 등
  times: string[];             // ['09:00','21:30']
  tenMinutesBefore?: boolean;  // 10분 전 알림 추가
  drugName?: string;           // 문구에 삽입
}): Promise<string[]> {
  const identifiers: string[] = [];

  for (const day of selectedDays) {
    const weekday = toWeekday(day);

    for (const hhmm of times) {
      const { hour, minute } = parseHHmm(hhmm);
      const mainLabel = to24hKoreanLabel(hhmm); // "08시 00분"

      // 🔔 메인 알림 (해당 요일/시각)
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${mainLabel} ${drugName ?? ''} 복용 시간이에요`.trim(),
          body: `${drugName ?? '약'}을(를) 복용해 주세요.`,
          data: { hhmm, weekday, type: 'main' },
          sound: true,
          // channelId: 'default', // (선택) 안드로이드에서 특정 채널 강제 시
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          weekday,
          hour,
          minute,
          repeats: true,
        },
      });
      identifiers.push(id);

      // ⏰ 10분 전 알림 옵션
      if (tenMinutesBefore) {
        const before = minus10m(hour, minute);
        const beforeWeekday = before.prevDay ? prevWeekday(weekday) : weekday;
        const beforeH = String(before.hour).padStart(2, '0');
        const beforeM = String(before.minute).padStart(2, '0');
        const beforeHHmm = `${beforeH}:${beforeM}`;
        const beforeLabel = to24hKoreanLabel(beforeHHmm); // "07시 50분"

        const id10 = await Notifications.scheduleNotificationAsync({
          content: {
            title: `[10분 전] ${beforeLabel} ${drugName ?? ''} 복용 알림`.trim(),
            body: `10분 뒤 ${mainLabel}에 ${drugName ?? '약'} 복용 예정입니다.`,
            data: { hhmm, weekday: beforeWeekday, type: 'before10' },
            sound: true,
            // channelId: 'default',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            weekday: beforeWeekday,
            hour: before.hour,
            minute: before.minute,
            repeats: true,
          },
        });
        identifiers.push(id10);
      }
    }
  }

  return identifiers;
}
