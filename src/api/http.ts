import axios from 'axios';
import { API_BASE_URL } from '@env';

// Base API URL with versioning
const BASE_URL = `${API_BASE_URL}/v1`;
console.log('BASE_URL : ', BASE_URL);

// JSON client
export const jsonAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Multipart/Form client
export const formAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

// You can attach interceptors here if needed later
// jsonAxios.interceptors.response.use(...)
