import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMedication, registerMedication } from './apis';
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

export function useDeleteMedicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMedication(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
  });
}
