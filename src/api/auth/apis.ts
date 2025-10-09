import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import { jwtDecode } from 'jwt-decode';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  RefreshTokenRequest,
  LogoutRequest,
  TokenPair,
} from './types';

// 토큰 저장/조회 함수들
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

// JWT 토큰에서 사용자 정보 추출
export interface UserInfo {
  role: string;
  userId: string;
  exp: number;
}

// 토큰에서 사용자 정보 추출 함수
export function getUserInfoFromToken(accessToken: string): UserInfo | null {
  try {
    const decoded = jwtDecode(accessToken) as any;
    return {
      role: decoded.role || 'USER',
      userId: decoded.sub || decoded.userId || '',
      exp: decoded.exp || 0,
    };
  } catch (e) {
    console.warn('[TOKEN] JWT 디코딩 실패:', e);
    return null;
  }
}

// 현재 사용자의 Role 확인 함수
export async function getUserRole(): Promise<string | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const userInfo = getUserInfoFromToken(accessToken);
    return userInfo?.role || null;
  } catch (e) {
    console.warn('[TOKEN] 사용자 Role 조회 실패:', e);
    return null;
  }
}

// Admin 권한 체크 함수
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'ADMIN';
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

// 로그인 API
export async function loginWithIdToken({
  idToken,
  provider,
}: LoginRequest): Promise<AuthResponse | null> {
  try {
    console.log('[AUTH/login] 요청 바디:', {
      provider,
      idToken: idToken ? `${idToken.substring(0, 50)}...` : 'null',
    });

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

// 회원가입 API
export async function signupWithIdToken(
  input: SignupRequest,
): Promise<AuthResponse> {
  const {
    idToken,
    provider,
    name,
    birthday,
    phone,
    caregiverPhone,
    isPushConsent,
  } = input;

  // caregiverPhone이 undefined이거나 빈 문자열이면 필드 자체를 제거
  const requestBody: any = {
    idToken,
    provider,
    name,
    birthday,
    phone,
    isPushConsent,
  };

  if (caregiverPhone && caregiverPhone.trim() !== '') {
    requestBody.caregiverPhone = caregiverPhone.trim();
  }

  console.log('[AUTH/signup] 요청 바디:', requestBody);

  const authAxios = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
  });

  const res = await authAxios.post('/auth/signup', requestBody);
  const { accessToken, refreshToken } = res.data.data;
  await saveTokens(accessToken, refreshToken);

  return res.data.data;
}

// 토큰 재발급 API
export async function refreshToken(): Promise<TokenPair> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다. 다시 로그인해주세요.');
  }

  console.log('[AUTH/refresh] 토큰 재발급 요청');

  const refreshAxios = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: { 'Content-Type': 'application/json' },
  });

  const res = await refreshAxios.post('/auth/refresh', { refreshToken });

  console.log('[AUTH/refresh] 응답 구조:', res.data);

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    res.data.data || res.data;

  await saveTokens(newAccessToken, newRefreshToken);
  console.log('[AUTH/refresh] 토큰 재발급 완료');

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// 로그아웃 API
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
    await clearTokens();
  }
}

// 토큰 삭제 함수
async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  console.log('[AUTH] 로컬 토큰 삭제 완료');
}
