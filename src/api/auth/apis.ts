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

interface LoginRequestBody {
  idToken: string;
  provider: string;
  appleUserPayload?: {
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

// API 응답 공통 구조
interface ApiResponse<T = unknown> {
  code: string;
  httpStatus: number;
  message: string;
  data: T;
  error: unknown | null;
}

// 상태 코드별 응답 타입
interface LoginSuccessData {
  accessToken: string;
  refreshToken: string;
}

interface Login404Data {
  nameHint?: string; // 404 응답 시 회원가입 화면에서 이름 힌트로 사용
}

interface LoginErrorData {
  code: string;
  httpStatus: number;
  message: string;
  data: unknown | null;
  error: unknown | null;
}

interface AxiosErrorResponse {
  status?: number;
  data?: LoginErrorData;
}

interface AxiosError extends Error {
  response?: AxiosErrorResponse;
  config?: {
    url?: string;
  };
}

// 로그인 API 반환 타입 (404일 때 nameHint 포함)
export interface LoginResult {
  success: boolean;
  data?: AuthResponse;
  nameHint?: string; // 404 응답 시 포함
}

// 로그인 API
export async function loginWithIdToken({
  idToken,
  provider,
  appleUserPayload,
}: LoginRequest): Promise<LoginResult | null> {
  try {
    // 요청 본문 구성 (appleUserPayload가 있으면 포함, 없으면 필드 자체를 추가하지 않음)
    const requestBody: LoginRequestBody = {
      idToken,
      provider,
    };

    // appleUserPayload가 있을 때만 포함
    if (appleUserPayload) {
      requestBody.appleUserPayload = appleUserPayload;
    }

    console.log('[AUTH/login] 요청 바디:', {
      provider,
      idToken: idToken ? `${idToken.substring(0, 50)}...` : 'null',
      ...(appleUserPayload && { appleUserPayload }),
    });

    const authAxios = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await authAxios.post<ApiResponse<LoginSuccessData>>(
      '/auth/login',
      requestBody,
    );
    console.log('[AUTH/login] 응답 상태 코드:', res.status);
    console.log('[AUTH/login] 응답 데이터:', JSON.stringify(res.data, null, 2));

    if (res.status >= 200 && res.status < 300) {
      // 200: 로그인 성공
      const response = res.data as ApiResponse<LoginSuccessData>;
      console.log('[AUTH/login] 200 - 로그인 성공');
      console.log('[AUTH/login] 200 응답 상세:', {
        status: res.status,
        code: response.code,
        message: response.message,
        httpStatus: response.httpStatus,
        data: {
          accessToken: response.data.accessToken
            ? `${response.data.accessToken.substring(0, 50)}...`
            : null,
          refreshToken: response.data.refreshToken
            ? `${response.data.refreshToken.substring(0, 50)}...`
            : null,
        },
      });
      const { accessToken, refreshToken } = response.data;
      await saveTokens(accessToken, refreshToken);
      return {
        success: true,
        data: response.data,
      };
    }
    return null;
  } catch (e) {
    const error = e as AxiosError;
    const status = error?.response?.status;
    const errorData = error?.response?.data;

    // 에러 응답 로그 출력
    console.error('[AUTH/login] 에러 응답 상태 코드:', status);
    console.error(
      '[AUTH/login] 에러 응답 데이터:',
      JSON.stringify(errorData, null, 2),
    );

    // 400: 입력값 검증 실패
    if (status === 400) {
      console.error('[AUTH/login] 400 - 입력값 검증 실패');
      console.error('[AUTH/login] 400 응답 상세:', {
        status,
        code: errorData?.code,
        message: errorData?.message,
        httpStatus: errorData?.httpStatus,
        data: errorData?.data,
        error: errorData?.error,
      });
      throw e;
    }

    // 401: 유효하지 않은 아이디 토큰
    if (status === 401) {
      console.error('[AUTH/login] 401 - 유효하지 않은 아이디 토큰');
      console.error('[AUTH/login] 401 응답 상세:', {
        status,
        code: errorData?.code, // "A001"
        message: errorData?.message, // "유효하지 않은 아이디 토큰입니다."
        httpStatus: errorData?.httpStatus, // 401
        data: errorData?.data, // null
        error: errorData?.error, // null
      });
      throw e;
    }

    // 404: 가입되지 않은 소셜 계정 (회원가입 필요)
    if (status === 404) {
      const response404 = errorData as ApiResponse<Login404Data>;
      const nameHint = response404?.data?.nameHint;
      console.log('[AUTH/login] 404 - 가입되지 않은 소셜 계정 (회원가입 필요)');
      console.log('[AUTH/login] 404 응답 상세:', {
        status,
        code: response404?.code, // "A002"
        message: response404?.message, // "가입되지 않은 소셜 계정입니다."
        httpStatus: response404?.httpStatus, // 404
        data: response404?.data, // { nameHint: "홍길동" } (선택적)
        error: response404?.error, // null
        nameHint, // 추출된 이름 힌트
      });
      return {
        success: false,
        nameHint: nameHint || undefined,
      };
    }

    // 409: 이미 가입된 계정 (기타 충돌)
    if (status === 409) {
      console.log('[AUTH/login] 409 - 이미 가입된 계정');
      console.log('[AUTH/login] 409 응답 상세:', {
        status,
        code: errorData?.code,
        message: errorData?.message,
        httpStatus: errorData?.httpStatus,
        data: errorData?.data,
        error: errorData?.error,
      });
      return {
        success: false,
      };
    }

    // 기타 에러는 그대로 throw
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
  interface SignupRequestBody {
    idToken: string;
    provider: string;
    name: string;
    birthday: string;
    phone: string;
    isPushConsent: boolean;
    caregiverPhone?: string;
  }

  const requestBody: SignupRequestBody = {
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
