import { jsonAxios, formAxios } from '../http';
import type {
  ApiResponse,
  MedicationData,
  MedicationRegisterRequest,
  MedicationRecordsResponse,
  MedicationRecordDates,
  DeleteAlarmsRequest,
  MedicationRecordItem,
  VerifyMedicationResponse,
} from './types';

// 설정 파일에서 샘플 데이터 사용 플래그 가져오기
import { USE_SAMPLE_DATA } from './config';

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
  console.log('[API] 이미지가 FormData에 추가되었습니다');

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

// GET /v1/medications - 약 목록 조회
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

// GET /v1/medications/{id} - 특정 약 정보 조회
export const fetchMedication = async (
  medicationId: number,
): Promise<MedicationData> => {
  console.log('[API] 약 정보 조회 요청 ID:', medicationId);
  try {
    const res = await jsonAxios.get<ApiResponse<MedicationData>>(
      `/medications/${medicationId}`,
    );
    console.log('[API] 약 정보 조회 응답:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[API] 약 정보 조회 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};

// PUT /v1/medications/{id} - 약 정보 수정
export const updateMedication = async (
  medicationId: number,
  data: MedicationRegisterRequest,
  image?: string,
): Promise<MedicationData> => {
  console.log('[API] 약 수정 요청 ID:', medicationId);
  console.log('[API] 약 수정 요청 데이터:', data);
  if (image) {
    console.log('[API] 수정할 이미지 URI:', image);
  }

  const formData = new FormData();
  const requestData = { ...data };

  console.log('[API] FormData에 추가할 request:', requestData);
  formData.append('request', JSON.stringify(requestData));

  // 이미지가 제공된 경우에만 추가
  if (image) {
    const imageData = {
      uri: image,
      type: 'image/jpeg',
      name: 'medication.jpg',
    };
    console.log('[API] 수정할 이미지 데이터:', imageData);
    formData.append('image', imageData as any);
  }

  console.log('[API] PUT /medications/' + medicationId + ' 요청 시작');
  try {
    const res = await formAxios.put<ApiResponse<MedicationData>>(
      `/medications/${medicationId}`,
      formData,
    );
    console.log('[API] 약 수정 응답:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[API] 약 수정 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};

// GET /v1/medication-records - 특정 날짜의 복약 목록 조회
export const fetchMedicationRecords = async (
  date: string,
): Promise<MedicationRecordsResponse> => {
  console.log('[API] 복약 기록 조회 요청 날짜:', date);

  // 샘플 데이터 사용 (아무 날짜나 가능)
  if (USE_SAMPLE_DATA) {
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 300));
    return {
      date: date, // 요청한 날짜 사용
      items: [
        {
          recordId: 101,
          alarmTime: '09:00',
          medicationId: 1,
          medicationName: '타이레놀',
          status: 'TAKEN',
          imageUrl: 'https://s3.amazonaws.com/bucket/medication_photo_101.jpg',
          checkedAt: '2025-10-01T09:15:00',
          firstAlarmAt: '2025-10-01T09:00:00',
          secondAlarmAt: '2025-10-01T09:10:00',
          caregiverNotifiedAt: '2025-10-01T09:20:00',
        },
        {
          recordId: 102,
          alarmTime: '13:00',
          medicationId: 2,
          medicationName: '혈압약',
          status: 'TAKEN',
          imageUrl: 'https://s3.amazonaws.com/bucket/medication_photo_102.jpg',
          checkedAt: '2025-10-01T13:05:00',
          firstAlarmAt: '2025-10-01T13:00:00',
          secondAlarmAt: '2025-10-01T13:10:00',
          caregiverNotifiedAt: '2025-10-01T13:15:00',
        },
        {
          recordId: 103,
          alarmTime: '21:00',
          medicationId: 1,
          medicationName: '타이레놀',
          status: 'PENDING',
        },
        {
          recordId: 104,
          alarmTime: '08:00',
          medicationId: 3,
          medicationName: '비타민',
          status: 'SKIPPED',
          firstAlarmAt: '2025-10-01T08:00:00',
          secondAlarmAt: '2025-10-01T08:10:00',
        },
      ],
    };
  }

  try {
    const res = await jsonAxios.get<ApiResponse<MedicationRecordsResponse>>(
      `/medication-records`,
      {
        params: { date },
      },
    );
    console.log('[API] 복약 기록 조회 응답:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[API] 복약 기록 조회 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};

// GET /v1/medication-records/dates - 달력 점 표시용 날짜 목록 조회
export const fetchMedicationRecordDates = async (
  year: number,
  month: number,
): Promise<MedicationRecordDates> => {
  console.log('[API] 복약 기록 날짜 목록 조회 요청:', { year, month });

  // 샘플 데이터 사용 (아무 년월이나 가능)
  if (USE_SAMPLE_DATA) {
    await new Promise((resolve) => setTimeout(() => resolve(undefined), 200));
    // 현재 년월에 맞게 날짜 생성
    const daysWithData = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    // 홀수일에 데이터 있는 것으로 표시 (예시)
    for (let day = 1; day <= daysInMonth; day++) {
      if (day % 2 === 1) {
        // 홀수일만 선택
        const dayStr = day < 10 ? `0${day}` : `${day}`;
        daysWithData.push(
          `${year}-${month < 10 ? '0' + month : month}-${dayStr}`,
        );
      }
    }

    return daysWithData;
  }

  try {
    const res = await jsonAxios.get<ApiResponse<MedicationRecordDates>>(
      `/medication-records/dates`,
      {
        params: { year, month },
      },
    );
    console.log('[API] 복약 기록 날짜 목록 조회 응답:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[API] 복약 기록 날짜 목록 조회 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};

// DELETE /v1/medications/{medicationId}/alarms - 약물 알림 삭제
export const deleteMedicationAlarms = async (
  medicationId: number,
  data: DeleteAlarmsRequest,
): Promise<void> => {
  console.log('[API] 약물 알림 삭제 요청 ID:', medicationId);
  console.log('[API] 삭제할 알림 IDs:', data.alarmIds);
  try {
    await jsonAxios.delete(`/medications/${medicationId}/alarms`, {
      data,
    });
    console.log('[API] 약물 알림 삭제 성공');
  } catch (error: any) {
    console.error('[API] 약물 알림 삭제 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};

// POST /medication-records/{recordId}/verify - 복약 인증
export const verifyMedicationRecord = async (
  recordId: number,
  imageUri: string,
): Promise<MedicationRecordItem> => {
  console.log('[API] 복약 인증 요청 시작', { recordId, imageUri });

  // 샘플 데이터 모드인 경우
  if (USE_SAMPLE_DATA) {
    console.log('[API] 샘플 데이터 모드로 실행 중입니다');
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 800);
    }); // 분석 중인 것처럼 딜레이 추가

    // 샘플 데이터 응답
    return {
      recordId: recordId,
      alarmTime: '09:00',
      medicationId: 1,
      medicationName: '타이레놀',
      status: 'TAKEN', // 항상 성공 상태로 반환
      imageUrl: imageUri,
      checkedAt: new Date().toISOString(),
      firstAlarmAt: '2025-10-01T09:00:00',
      secondAlarmAt: '2025-10-01T09:10:00',
    };
  }

  const formData = new FormData();

  const imageData = {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'medication_verify.jpg',
  };

  formData.append('image', imageData as any);

  try {
    // 이미지 파일이 존재하는지 확인
    try {
      const RNFS = require('react-native-fs');
      const fileExists = await RNFS.exists(imageUri);
      console.log('[API] 인증 이미지 파일 존재 여부:', fileExists);
      if (!fileExists) {
        console.error('[API] 인증 이미지 파일이 존재하지 않습니다:', imageUri);
      }
    } catch (fsError) {
      console.log('[API] 파일 존재 여부 확인 건너뜀');
    }

    const res = await formAxios.post<ApiResponse<MedicationRecordItem>>(
      `/medication-records/${recordId}/verify`,
      formData,
    );

    console.log('[API] 복약 인증 응답:', res.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[API] 복약 인증 에러:', error);
    console.error('[API] 에러 응답:', error.response?.data);
    console.error('[API] 에러 상태:', error.response?.status);
    throw error;
  }
};
