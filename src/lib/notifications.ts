// src/lib/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { to24hKoreanLabel } from '../lib/date';
import { registerPushToken } from '../api/push';

/** 한글 요일 → iOS/Android 공통 weekday 숫자(1=일, ..., 7=토) */
const KOR_DAY_TO_WEEKDAY: Record<string, number> = {
  일: 1,
  월: 2,
  화: 3,
  수: 4,
  목: 5,
  금: 6,
  토: 7,
};

function toWeekday(dayKr: string) {
  const w = KOR_DAY_TO_WEEKDAY[dayKr];
  if (!w) throw new Error(`지원하지 않는 요일: ${dayKr}`);
  return w;
}

function parseHHmm(t: string) {
  const [h, m] = t.split(':').map((v) => parseInt(v, 10));
  if (Number.isNaN(h) || Number.isNaN(m))
    throw new Error(`시간 형식 오류: ${t}`);
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
  selectedDays: string[]; // ['월','수','금'] 등
  times: string[]; // ['09:00','21:30']
  tenMinutesBefore?: boolean; // 10분 전 알림 추가
  drugName?: string; // 문구에 삽입
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
            title:
              `[10분 전] ${beforeLabel} ${drugName ?? ''} 복용 알림`.trim(),
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

/**
 * 푸시 알림 권한을 요청하고 Expo 푸시 토큰을 받아옵니다.
 * @returns Expo 푸시 토큰 문자열 또는 null (실패 시)
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token: string | null = null;

  if (Platform.OS === 'android') {
    // Android의 경우 알림 채널 설정
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // if (Device.isDevice) {
  //   // 실제 기기에서만 푸시 토큰 요청
  //   const { status: existingStatus } =
  //     await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;

  //   if (existingStatus !== 'granted') {
  //     // 권한이 없으면 권한 요청
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }

  //   if (finalStatus !== 'granted') {
  //     console.warn('[PUSH] 푸시 알림 권한이 거부되었습니다.');
  //     return null;
  //   }

  //   try {
  //     // Expo 푸시 토큰 발급
  //     const tokenData = await Notifications.getExpoPushTokenAsync({
  //       projectId: '3a4a7be3-b851-4bbb-b09d-a35226da2075', // app.json의 projectId와 동일
  //     });

  //     token = tokenData.data;
  //     console.log('[PUSH] Expo 푸시 토큰 발급 성공:', token);
  //   } catch (error) {
  //     console.error('[PUSH] Expo 푸시 토큰 발급 실패:', error);
  //     return null;
  //   }
  // } else {
  //   console.warn('[PUSH] 시뮬레이터에서는 푸시 토큰을 발급받을 수 없습니다.');
  // }
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    // 권한이 없으면 권한 요청
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[PUSH] 푸시 알림 권한이 거부되었습니다.');
    return null;
  }

  try {
    // Expo 푸시 토큰 발급
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '3a4a7be3-b851-4bbb-b09d-a35226da2075', // app.json의 projectId와 동일
    });

    token = tokenData.data;
    console.log('[PUSH] Expo 푸시 토큰 발급 성공:', token);
  } catch (error) {
    console.error('[PUSH] Expo 푸시 토큰 발급 실패:', error);
    return null;
  }

  return token;
}

// 푸시 알림 처리 설정
export function configurePushNotifications() {
  // 알림이 도착했을 때의 기본 동작 설정
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
/**
 * 알림 수신 리스너 설정
 */
export function setupNotificationListeners() {
  // 포그라운드에서 알림 수신 처리
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('[PUSH] 포그라운드 알림 수신:', notification);

      // 알림 데이터 처리
      const data = notification.request.content.data;
      if (data) {
        console.log('[PUSH] 알림 데이터:', data);
        // 필요시 특정 로직 처리 (예: 상태 업데이트)
      }
    },
  );

  // 알림 탭 처리 (사용자가 알림을 탭했을 때)
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('[PUSH] 알림 탭됨:', response);

      const data = response.notification.request.content.data;

      // 알림 데이터에 따라 특정 화면으로 이동
      handleNotificationNavigation(data);
    });

  return {
    foregroundSubscription,
    responseSubscription,
  };
}

/**
 * 알림 데이터에 따른 네비게이션 처리
 */
function handleNotificationNavigation(data: any) {
  console.log('[PUSH] 네비게이션 처리:', data);

  // 알림 타입에 따른 화면 이동
  if (data?.type === 'medication_reminder') {
    // 복약 알림 - 홈 화면으로 이동
    console.log('[PUSH] 복약 알림 - 홈 화면으로 이동');
    // TODO: 네비게이션 구현 필요
  } else if (data?.type === 'medication_check') {
    // 복약 확인 - 복약 현황 화면으로 이동
    console.log('[PUSH] 복약 확인 - 복약 현황 화면으로 이동');
    // TODO: 네비게이션 구현 필요
  } else {
    // 기본 - 홈 화면으로 이동
    console.log('[PUSH] 기본 알림 - 홈 화면으로 이동');
    // TODO: 네비게이션 구현 필요
  }
}

/**
 * 알림 리스너 정리
 */
export function cleanupNotificationListeners(subscriptions: {
  foregroundSubscription: any;
  responseSubscription: any;
}) {
  subscriptions.foregroundSubscription?.remove();
  subscriptions.responseSubscription?.remove();
  console.log('[PUSH] 알림 리스너 정리 완료');
}

/**
 * 푸시 토큰을 받아서 서버에 등록하는 통합 함수
 * @returns 성공 여부
 */
export async function setupPushNotifications(): Promise<boolean> {
  try {
    console.log('[PUSH] 푸시 알림 설정 시작');

    // 푸시 알림 설정
    configurePushNotifications();

    // 알림 리스너 설정
    setupNotificationListeners();

    // 푸시 토큰 받기
    const token = await registerForPushNotificationsAsync();

    if (!token) {
      console.warn('[PUSH] 푸시 토큰을 받을 수 없습니다.');
      return false;
    }

    // 서버에 토큰 등록
    const result = await registerPushToken(token);

    if (result.success) {
      console.log('[PUSH] 푸시 토큰이 성공적으로 서버에 등록되었습니다.');
      return true;
    } else {
      console.error('[PUSH] 서버 토큰 등록 실패:', result.message);
      return false;
    }
  } catch (error) {
    console.error('[PUSH] 푸시 알림 설정 중 오류 발생:', error);
    return false;
  }
}
