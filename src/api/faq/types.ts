// FAQ API 관련 타입 정의

export type FaqCategory = 'MEDICATION_STATUS' | 'NOTIFICATION' | 'TIMELINE';

// FAQ 데이터 타입
export interface FaqData {
  id: number;
  question: string;
  answer: string;
  category: FaqCategory;
  createdAt: string;
  updatedAt: string;
}

// FAQ API 응답 타입
export interface FaqApiResponse {
  code: string;
  httpStatus: number;
  message: string;
  data: FaqData[];
  error: null | any;
}
