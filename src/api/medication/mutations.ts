import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteMedication,
  registerMedication,
  updateMedication,
  deleteMedicationAlarms,
  verifyMedicationRecord,
} from './apis';
import { medicationKeys } from './keys';
import type {
  MedicationRegisterRequest,
  MedicationData,
  ApiResponse,
  DeleteAlarmsRequest,
  MedicationRecordItem,
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
      qc.invalidateQueries({ queryKey: medicationKeys.all }); // 모든 medication 관련 쿼리 무효화
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
      // 모든 medication 관련 쿼리 무효화
      qc.invalidateQueries({ queryKey: medicationKeys.all });
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
      qc.invalidateQueries({ queryKey: medicationKeys.all }); // 모든 medication 관련 쿼리 무효화
    },
  });
}

export function useDeleteMedicationAlarmsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      medicationId,
      alarmIds,
    }: {
      medicationId: number;
      alarmIds: number[];
    }) => deleteMedicationAlarms(medicationId, { alarmIds }),
    onSuccess: (data, variables) => {
      // 해당 약물의 상세 정보와 약물 목록을 무효화
      qc.invalidateQueries({
        queryKey: medicationKeys.detail(variables.medicationId),
      });
      qc.invalidateQueries({ queryKey: medicationKeys.lists() });
      // 복약 기록도 무효화 (알림이 삭제되면 복약 기록에 영향을 줄 수 있음)
      qc.invalidateQueries({ queryKey: medicationKeys.all });
      console.log('[API] 약물 알림 삭제 성공, 쿼리 무효화 완료');
    },
    onError: (error) => {
      console.error('[API] 약물 알림 삭제 실패:', error);
    },
  });
}

// 복약 인증을 위한 mutation 함수
export function useVerifyMedicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordId,
      imageUri,
    }: {
      recordId: number;
      imageUri: string;
    }) => verifyMedicationRecord(recordId, imageUri),
    onSuccess: (data: MedicationRecordItem, variables) => {
      // 복약 기록 쿼리를 무효화 (상태가 변경되었으므로 다시 가져와야 함)
      qc.invalidateQueries({
        queryKey: medicationKeys.verify(variables.recordId),
      });

      // 해당 날짜의 복약 기록 무효화 (상태가 변경되었으므로)
      if (data.checkedAt) {
        const date = data.checkedAt.split('T')[0]; // YYYY-MM-DD 형식으로 변환
        qc.invalidateQueries({
          queryKey: medicationKeys.records(date),
        });
      }

      console.log('[API] 복약 인증 성공:', data);
    },
    onError: (error) => {
      console.error('[API] 복약 인증 실패:', error);
    },
  });
}
