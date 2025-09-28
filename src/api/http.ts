import axios from 'axios';
import { API_BASE_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

// Base API URL with versioning
const BASE_URL = `${API_BASE_URL}/api/v1`;

// JSON client
export const jsonAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터 - Authorization 헤더 자동 추가
jsonAxios.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.log('토큰 조회 실패:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 공통 인터셉터
jsonAxios.interceptors.response.use(
  (r) => (console.log('[AUTH/login res]', r.status, r.config.url, r.data), r),
  (e) => {
    console.log('[AUTH/login err]', e?.response?.status, e?.response?.data);
    throw e;
  },
);

// Multipart/Form client
export const formAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// formAxios에도 동일한 요청 인터셉터 적용
formAxios.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.log('토큰 조회 실패:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
