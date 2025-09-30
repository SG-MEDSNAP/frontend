import { useQuery } from '@tanstack/react-query';
import {
  fetchMedications,
  fetchMedication,
  fetchMedicationRecords,
  fetchMedicationRecordDates,
} from './apis';
import { medicationKeys } from './keys';
import type {
  MedicationData,
  MedicationRecordsResponse,
  MedicationRecordDates,
} from './types';

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

// 특정 날짜의 복약 기록 조회
export function useMedicationRecordsQuery(date: string) {
  return useQuery<MedicationRecordsResponse>({
    queryKey: medicationKeys.records(date),
    queryFn: () => fetchMedicationRecords(date),
    enabled: !!date,
  });
}

// 달력 점 표시용 날짜 목록 조회
export function useMedicationRecordDatesQuery(year: number, month: number) {
  return useQuery<MedicationRecordDates>({
    queryKey: medicationKeys.recordDates(year, month),
    queryFn: () => fetchMedicationRecordDates(year, month),
    enabled: !!year && !!month,
  });
}
