import { API_BASE_URL } from '@env';
import axios from 'axios';

// 복용 요일 타입
export type DoseDay =
  | 'MON'
  | 'TUE'
  | 'WED'
  | 'THU'
  | 'FRI'
  | 'SAT'
  | 'SUN'
  | 'DAILY';

// 요청 타입
export interface MedicationRegisterRequest {
  name: string;
  notifyCaregiver: boolean;
  preNotify: boolean;
  doseTimes: string[]; // "HH:mm" 형식
  doseDays: DoseDay[];
  caregiverPhone?: string;
}

// 응답 데이터 타입
export interface MedicationData {
  id: number;
  name: string;
  imageUrl: string;
  notifyCaregiver: boolean;
  preNotify: boolean;
  doseTimes: string[];
  doseDays: DoseDay[];
  caregiverPhone: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse {
  code: string;
  httpStatus: number;
  message: string;
  data: MedicationData;
  error: null | any;
}

export const registerMedication = async (
  data: MedicationRegisterRequest,
  image: string,
): Promise<ApiResponse> => {
  const formData = new FormData();

  // 기본값을 포함한 요청 데이터 생성
  const requestData = {
    ...data,
    caregiverPhone: data.caregiverPhone || '', // 보호자 전화번호가 없을 경우 빈 문자열
  };

  // JSON 데이터를 FormData에 추가
  formData.append('request', JSON.stringify(requestData));

  // 이미지 데이터 추가
  formData.append('image', {
    uri: image,
    type: 'image/jpeg',
    name: 'medication.jpg',
  } as any);

  try {
    const response = await axios.post<ApiResponse>(
      `${BASE_URL}/v1/medications`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
