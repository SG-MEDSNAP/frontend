import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMedication, registerMedication, updateMedication } from './apis';
import { medicationKeys } from './keys';
import type {
  MedicationRegisterRequest,
  MedicationData,
  ApiResponse,
} from './types';

export function useRegisterMedicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      image,
    }: {
      payload: MedicationRegisterRequest;
      image: string;
    }) => registerMedication(payload, image),
    onSuccess: (data: MedicationData) => {
      qc.invalidateQueries({ queryKey: medicationKeys.lists() });
      console.log('Medication registered successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to register medication:', error);
    },
  });
}

export function useUpdateMedicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      medicationId,
      payload,
      image,
    }: {
      medicationId: number;
      payload: MedicationRegisterRequest;
      image?: string;
    }) => updateMedication(medicationId, payload, image),
    onSuccess: (data: MedicationData, variables) => {
      // 개별 약 정보와 약 목록 모두 무효화
      qc.invalidateQueries({
        queryKey: medicationKeys.detail(variables.medicationId),
      });
      qc.invalidateQueries({ queryKey: medicationKeys.lists() });
      console.log('Medication updated successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to update medication:', error);
    },
  });
}

export function useDeleteMedicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMedication(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
  });
}
