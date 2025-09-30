import { useQuery } from '@tanstack/react-query';
import { fetchMedications, fetchMedication } from './apis';
import { medicationKeys } from './keys';
import type { MedicationData } from './types';

export function useMedicationsQuery() {
  return useQuery<MedicationData[]>({
    queryKey: medicationKeys.lists(),
    queryFn: fetchMedications,
  });
}

export function useMedicationQuery(medicationId: number) {
  return useQuery<MedicationData>({
    queryKey: medicationKeys.detail(medicationId),
    queryFn: () => fetchMedication(medicationId),
    enabled: !!medicationId,
  });
}
