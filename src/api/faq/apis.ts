// import { jsonAxios } from '../http';
import axios from 'axios';
import { API_BASE_URL } from '@env';

// Base API URL with versioning
const BASE_URL = `${API_BASE_URL}/v1`;
import type { FaqApiResponse, FaqData } from './types';

// GET /v1/faqs - FAQ 목록 조회
export const fetchFaqs = async (): Promise<FaqData[]> => {
  console.log('FAQ API 호출 시작');
  // console.log(jsonAxios.getUri());
  try {
    // const res = await jsonAxios.get<FaqApiResponse>('/faqs');
    const res = await axios.get<FaqApiResponse>(`${BASE_URL}/faqs`);
    console.log('FAQ API 응답 성공:', res.data);
    return res.data.data;
  } catch (error) {
    console.error('FAQ API 호출 실패:', error);
    throw error;
  }
};

// GET /v1/faqs/{id} - 특정 FAQ 조회
// export const fetchFaqById = async (id: number): Promise<FaqData> => {
//   const res = await jsonAxios.get<
//     Omit<FaqApiResponse, 'data'> & { data: FaqData }
//   >(`/faqs/${id}`);
//   return res.data.data;
// };
