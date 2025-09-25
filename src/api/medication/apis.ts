import { jsonAxios, formAxios } from '../http';
import type {
  ApiResponse,
  MedicationData,
  MedicationRegisterRequest,
} from './types';

// POST /v1/medications (multipart)
export const registerMedication = async (
  data: MedicationRegisterRequest,
  image: string,
): Promise<ApiResponse<MedicationData>> => {
  const formData = new FormData();
  const requestData = { ...data, caregiverPhone: data.caregiverPhone || '' };
  formData.append('request', JSON.stringify(requestData));
  formData.append('image', {
    uri: image,
    type: 'image/jpeg',
    name: 'medication.jpg',
  } as any);

  const res = await formAxios.post<ApiResponse<MedicationData>>(
    `/medications`,
    formData,
  );
  return res.data;
};

// DELETE /v1/medications/{id}
export const deleteMedication = async (medicationId: number): Promise<void> => {
  await jsonAxios.delete(`/medications/${medicationId}`);
};

// (Optional) GET list - shape to be aligned with backend later
export const fetchMedications = async (): Promise<MedicationData[]> => {
  const res =
    await jsonAxios.get<ApiResponse<MedicationData[]>>(`/medications`);
  return res.data.data;
};
