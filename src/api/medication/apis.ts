import { jsonAxios, formAxios } from '../http';
import type {
  ApiResponse,
  MedicationData,
  MedicationRegisterRequest,
} from './types';

export const registerMedication = async (
  data: MedicationRegisterRequest,
  image: string,
): Promise<MedicationData> => {
  console.log('[API] 약 등록 요청 데이터:', data);
  console.log('[API] 이미지 URI:', image);

  // 중복 제거된 doseDays 확인
  const uniqueDoseDays = [...new Set(data.doseDays)];
  console.log('[API] 원본 doseDays:', data.doseDays);
  console.log('[API] 중복 제거된 doseDays:', uniqueDoseDays);

  const formData = new FormData();
  const requestData = { ...data, doseDays: uniqueDoseDays };

  console.log('[API] FormData에 추가할 request:', requestData);
  formData.append('request', JSON.stringify(requestData));

  const imageData = {
    uri: image,
    type: 'image/jpeg',
    name: 'medication.jpg',
  };
  console.log('[API] 이미지 데이터:', imageData);

  // FormData 내용 확인 (React Native에서는 entries() 지원하지 않음)

  // 이미지 파일이 존재하는지 확인 (React Native에서)
  try {
    const RNFS = require('react-native-fs');
    const fileExists = await RNFS.exists(image);
    console.log('[API] 이미지 파일 존재 여부:', fileExists);
    if (!fileExists) {
      console.error('[API] 이미지 파일이 존재하지 않습니다:', image);
    }
  } catch (fsError) {
    console.log(
      '[API] react-native-fs를 사용할 수 없음, 파일 존재 여부 확인 건너뜀',
    );
  }

  formData.append('image', imageData as any);

  console.log('[API] POST /medications 요청 시작');
  try {
    const res = await formAxios.post<ApiResponse<MedicationData>>(
      `/medications`,
      formData,
    );
    console.log('[API] 약 등록 응답:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[API] 약 등록 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};

// DELETE /v1/medications/{id}
export const deleteMedication = async (medicationId: number): Promise<void> => {
  console.log('[API] 약 삭제 요청 ID:', medicationId);
  try {
    await jsonAxios.delete(`/medications/${medicationId}`);
    console.log('[API] 약 삭제 성공');
  } catch (error: any) {
    console.error('[API] 약 삭제 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};

// (Optional) GET list - shape to be aligned with backend later
export const fetchMedications = async (): Promise<MedicationData[]> => {
  console.log('[API] 약 목록 조회 요청 시작');
  try {
    const res =
      await jsonAxios.get<ApiResponse<MedicationData[]>>(`/medications`);
    console.log('[API] 약 목록 조회 응답:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[API] 약 목록 조회 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};
