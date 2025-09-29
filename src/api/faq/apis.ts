import { jsonAxios } from '../http';
import type {
  FaqApiResponse,
  FaqData,
  FaqRegisterRequest,
  FaqRegisterResponse,
} from './types';

// GET /api/v1/faqs - FAQ 목록 조회
export const fetchFaqs = async (): Promise<FaqData[]> => {
  try {
    const res = await jsonAxios.get<FaqApiResponse>('/faqs');
    console.log('GET /api/v1/faqs:', res.data);
    return res.data.data;
  } catch (error) {
    console.error('GET /api/v1/faqs:', error);
    throw error;
  }
};

// POST /api/v1/faqs - FAQ 등록
export const registerFaq = async (
  data: FaqRegisterRequest,
): Promise<FaqRegisterResponse> => {
  try {
    const res = await jsonAxios.post<FaqRegisterResponse>('/faqs', data);
    console.log('POST /api/v1/faqs:', res.data);
    return res.data;
  } catch (error) {
    console.error('POST /api/v1/faqs:', error);
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
