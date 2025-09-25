import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMedication, registerMedication } from './apis';
import { medicationKeys } from './keys';
import type { MedicationRegisterRequest, MedicationData } from './types';

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.lists() });
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

