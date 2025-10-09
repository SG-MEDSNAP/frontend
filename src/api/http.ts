import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { getAccessToken, shouldRefreshToken, refreshToken } from './auth';

// Base API URL with versioning
// 빌드 시점에 process.env.API_BASE_URL이 실제 값으로 치환됨 (babel-plugin-transform-inline-environment-variables)
const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.API_BASE_URL) {
    return process.env.API_BASE_URL as string;
  }
  // 기본값 (개발 환경)
  return 'https://hiedu.site';
};

const API_BASE_URL = getApiBaseUrl();
const BASE_URL = `${API_BASE_URL}/api/v1`;

// JSON client
export const jsonAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30초 타임아웃
});

console.log('[HTTP] Axios 초기화 완료:', {
  baseURL: BASE_URL,
  API_BASE_URL,
});

// Request 인터셉터: 토큰 미리 재발급
jsonAxios.interceptors.request.use(
  async (config) => {
    console.log('[HTTP] 요청 시작:', {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
    });

    // refresh 엔드포인트는 토큰 체크 제외
    if (config.url?.includes('/auth/refresh')) {
      return config;
    }

    const accessToken = await getAccessToken();
    if (accessToken) {
      // 토큰이 곧 만료되면 미리 재발급
      if (shouldRefreshToken(accessToken)) {
        try {
          console.log('[TOKEN] 만료 예정 - 미리 재발급 시도');
          const newTokens = await refreshToken();
          config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        } catch (e) {
          console.warn('[TOKEN] 미리 재발급 실패, 기존 토큰 사용:', e);
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    console.error('[HTTP] 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  },
);

// Response 인터셉터: 401 에러 시 토큰 재발급 후 재시도
jsonAxios.interceptors.response.use(
  (r) => {
    console.log('[HTTP] 응답 성공:', {
      status: r.status,
      url: r.config.url,
      data: r.data,
    });
    return r;
  },
  async (e) => {
    const endpoint = e?.config?.url?.split('/').pop() || 'unknown';

    console.error('[HTTP] 응답 에러:', {
      endpoint,
      message: e?.message,
      code: e?.code,
      status: e?.response?.status,
      data: e?.response?.data,
      url: e?.config?.url,
      baseURL: e?.config?.baseURL,
    });

    // 401 에러이고 refresh 엔드포인트가 아닌 경우 재발급 시도
    if (e?.response?.status === 401 && !endpoint.includes('refresh')) {
      try {
        console.log('[TOKEN] 401 에러 - 토큰 재발급 후 재시도');
        const newTokens = await refreshToken();

        // 원래 요청에 새 토큰으로 재시도
        e.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return jsonAxios(e.config);
      } catch (refreshError) {
        console.error('[TOKEN] 재발급 실패, 로그인 필요:', refreshError);
        // 재발급 실패 시 로그인 화면으로 이동하거나 에러 처리
        // TODO: 로그인 화면으로 네비게이션 추가 필요
      }
    }

    throw e;
  },
);

// Multipart/Form client
export const formAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// formAxios에도 동일한 요청 인터셉터 적용
formAxios.interceptors.request.use(
  async (config) => {
    // refresh 엔드포인트는 토큰 체크 제외
    if (config.url?.includes('/auth/refresh')) {
      return config;
    }

    const accessToken = await getAccessToken();
    if (accessToken) {
      // 토큰이 곧 만료되면 미리 재발급
      if (shouldRefreshToken(accessToken)) {
        try {
          console.log('[TOKEN] 만료 예정 - 미리 재발급 시도');
          const newTokens = await refreshToken();
          config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        } catch (e) {
          console.warn('[TOKEN] 미리 재발급 실패, 기존 토큰 사용:', e);
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // multipart/form-data 요청 헤더 로그
    if (config.url?.includes('/medications')) {
      console.log('[FORM-API] 요청 URL:', config.url);
      console.log('[FORM-API] 요청 헤더:', config.headers);
      console.log('[FORM-API] Content-Type:', config.headers['Content-Type']);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// formAxios에도 동일한 응답 인터셉터 적용
formAxios.interceptors.response.use(
  (r) => (
    console.log('[API res]', r.status, r.config.url?.split('/').pop()),
    r
  ),
  async (e) => {
    const endpoint = e?.config?.url?.split('/').pop() || 'unknown';

    // 401 에러이고 refresh 엔드포인트가 아닌 경우 재발급 시도
    if (e?.response?.status === 401 && !endpoint.includes('refresh')) {
      try {
        console.log('[TOKEN] 401 에러 - 토큰 재발급 후 재시도');
        const newTokens = await refreshToken();

        // 원래 요청에 새 토큰으로 재시도
        e.config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return formAxios(e.config);
      } catch (refreshError) {
        console.error('[TOKEN] 재발급 실패, 로그인 필요:', refreshError);
        // 재발급 실패 시 로그인 화면으로 이동하거나 에러 처리
        // TODO: 로그인 화면으로 네비게이션 추가 필요
      }
    }

    console.log('[API err]', endpoint, e?.response?.status, e?.response?.data);
    throw e;
  },
);
