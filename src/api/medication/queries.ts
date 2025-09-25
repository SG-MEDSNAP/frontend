import { useQuery } from '@tanstack/react-query';
import { fetchMedications } from './apis';
import { medicationKeys } from './keys';
import type { MedicationData } from './types';

export function useMedicationsQuery() {
  return useQuery<MedicationData[]>({
    queryKey: medicationKeys.lists(),
    queryFn: fetchMedications,
  });
}

