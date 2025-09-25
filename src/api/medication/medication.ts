import { API_BASE_URL } from '@env';
import axios from 'axios';
import {
  ApiResponse,
  MedicationData,
  MedicationRegisterRequest,
} from './types';

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
      `${API_BASE_URL}/v1/medications`,
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

// 약 삭제 API
export const deleteMedication = async (medicationId: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/v1/medications/${medicationId}`);
  } catch (error) {
    throw error;
  }
};
