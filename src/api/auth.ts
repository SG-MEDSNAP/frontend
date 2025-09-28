import * as SecureStore from 'expo-secure-store';
import { jsonAxios } from './http';

export type Provider = 'GOOGLE' | 'APPLE' | 'KAKAO' | 'NAVER';

async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
}

export async function loginWithIdToken(idToken: string, provider: Provider) {
  try {
    // 로그인 호출 직전
    console.log('[AUTH/login] 요청 바디:', { provider });

    const res = await jsonAxios.post('/auth/login', { idToken, provider });
    if (res.status >= 200 && res.status < 300) {
      const { accessToken, refreshToken } = res.data.data;
      await saveTokens(accessToken, refreshToken);
      return res.data.data;
    }
    return null;
  } catch (e: any) {
    // 404: 미가입, 409: 이미 가입됨 → 회원가입으로 전환
    if (e?.response?.status === 404 || e?.response?.status === 409) {
      return null;
    }
    // 401: 토큰 검증 실패, 기타 에러는 그대로 throw
    throw e;
  }
}

export async function signupWithIdToken(input: {
  idToken: string;
  provider: Provider;
  name: string;
  birthday: string;
  phone: string;
  caregiverPhone?: string;
  isPushConsent: boolean;
}) {
  // caregiverPhone이 undefined이거나 빈 문자열이면 필드 자체를 제거
  const requestBody: any = {
    idToken: input.idToken,
    provider: input.provider,
    name: input.name,
    birthday: input.birthday,
    phone: input.phone,
    isPushConsent: input.isPushConsent,
  };

  if (input.caregiverPhone && input.caregiverPhone.trim() !== '') {
    requestBody.caregiverPhone = input.caregiverPhone.trim();
  }

  console.log('[AUTH/signup] 요청 바디:', requestBody);

  const res = await jsonAxios.post('/auth/signup', requestBody);
  const { accessToken, refreshToken } = res.data.data;
  await saveTokens(accessToken, refreshToken);
  return res.data.data;
}
