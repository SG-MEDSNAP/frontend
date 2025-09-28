import axios from 'axios';
import { API_BASE_URL } from '@env';
import { getAccessToken, shouldRefreshToken, refreshToken } from './auth';

// Base API URL with versioning
const BASE_URL = `${API_BASE_URL}/api/v1`;

// JSON client
export const jsonAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request 인터셉터: 토큰 미리 재발급
jsonAxios.interceptors.request.use(
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

    return config;
  },
  (error) => Promise.reject(error)
);

// Response 인터셉터: 401 에러 시 토큰 재발급 후 재시도
jsonAxios.interceptors.response.use(
  (r) => (console.log('[API res]', r.status, r.config.url?.split('/').pop()), r),
  async (e) => {
    const endpoint = e?.config?.url?.split('/').pop() || 'unknown';
    
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
    
    console.log('[API err]', endpoint, e?.response?.status, e?.response?.data);
    throw e;
  }
);

// Multipart/Form client
export const formAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// You can attach interceptors here if needed later
// jsonAxios.interceptors.response.use(...)
