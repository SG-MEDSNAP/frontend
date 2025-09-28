import axios from 'axios';
import { API_BASE_URL } from '@env';

// Base API URL with versioning
const BASE_URL = `${API_BASE_URL}/api/v1`;

// JSON client
export const jsonAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 공통 인터셉터
jsonAxios.interceptors.response.use(
  (r) => (console.log('[API res]', r.status, r.config.url?.split('/').pop()), r),
  (e) => {
    const endpoint = e?.config?.url?.split('/').pop() || 'unknown';
    console.log('[API err]', endpoint, e?.response?.status, e?.response?.data);
    throw e;
  },
);

// Multipart/Form client
export const formAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// You can attach interceptors here if needed later
// jsonAxios.interceptors.response.use(...)
