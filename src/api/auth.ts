import * as SecureStore from 'expo-secure-store';
import { jsonAxios } from './http';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { jwtDecode } from 'jwt-decode';

export type Provider = 'GOOGLE' | 'APPLE' | 'KAKAO' | 'NAVER';

async function saveTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync('accessToken', accessToken);
  await SecureStore.setItemAsync('refreshToken', refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('accessToken');
}

export async function getRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('refreshToken');
}

// 토큰 만료 체크 함수
export function shouldRefreshToken(accessToken: string): boolean {
  try {
    const { exp }: { exp: number } = jwtDecode(accessToken);
    const now = Math.floor(Date.now() / 1000);
    return exp - now <= 90; // 만료 90초 전에 갱신
  } catch (e) {
    console.warn('[TOKEN] JWT 디코딩 실패:', e);
    return true; // 디코딩 실패 시 재발급 시도
  }
}

export async function loginWithIdToken(idToken: string, provider: Provider) {
  try {
    // 로그인 호출 직전
    console.log('[AUTH/login] 요청 바디:', { provider });

    const authAxios = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await authAxios.post('/auth/login', { idToken, provider });
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
  const res = await jsonAxios.post('/auth/signup', input);

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
}

// 토큰 재발급 함수 (순환 참조 방지를 위해 별도 axios 인스턴스 사용)
export async function refreshToken(): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다. 다시 로그인해주세요.');
  }

  console.log('[AUTH/refresh] 토큰 재발급 요청');

  // 순환 참조 방지를 위해 별도 axios 인스턴스 사용
  const refreshAxios = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
  });

  const res = await refreshAxios.post('/auth/refresh', { refreshToken });

  // 응답 구조 확인을 위한 로그
  console.log('[AUTH/refresh] 응답 구조:', res.data);

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    res.data.data || res.data; // data.data 또는 data 구조 모두 지원

  await saveTokens(newAccessToken, newRefreshToken);
  console.log('[AUTH/refresh] 토큰 재발급 완료');

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// 로그아웃 함수
export async function logout(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearTokens();
    return;
  }

  try {
    console.log('[AUTH/logout] 로그아웃 요청');

    const logoutAxios = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: { 'Content-Type': 'application/json' },
    });

    await logoutAxios.post('/auth/logout', { refreshToken });
    console.log('[AUTH/logout] 서버 로그아웃 성공');
  } catch (e) {
    console.warn('[AUTH/logout] 서버 로그아웃 실패, 로컬 토큰 삭제:', e);
  } finally {
    // 서버 로그아웃 성공/실패와 관계없이 로컬 토큰 삭제
    await clearTokens();
  }
}

async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  console.log('[AUTH] 로컬 토큰 삭제 완료');
}
