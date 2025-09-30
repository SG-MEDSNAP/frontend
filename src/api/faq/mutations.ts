import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerFaq, updateFaq, deleteFaq } from './apis';
import { faqKeys } from './keys';
import type {
  FaqRegisterRequest,
  FaqRegisterResponse,
  FaqUpdateRequest,
  FaqUpdateResponse,
} from './types';

// FAQ 등록 mutation
export function useRegisterFaqMutation() {
  const queryClient = useQueryClient();

  return useMutation<FaqRegisterResponse, Error, FaqRegisterRequest>({
    mutationFn: registerFaq,
    onSuccess: (data) => {
      console.log('FAQ 등록 성공:', data);
      // FAQ 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error) => {
      console.error('FAQ 등록 실패:', error);
    },
  });
}

// FAQ 수정 mutation
export function useUpdateFaqMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    FaqUpdateResponse,
    Error,
    { faqId: number; data: FaqUpdateRequest }
  >({
    mutationFn: ({ faqId, data }) => updateFaq(faqId, data),
    onSuccess: (data) => {
      console.log('FAQ 수정 성공:', data);
      // FAQ 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error) => {
      console.error('FAQ 수정 실패:', error);
    },
  });
}

// FAQ 삭제 mutation
export function useDeleteFaqMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteFaq,
    onSuccess: () => {
      console.log('FAQ 삭제 성공');
      // FAQ 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
    onError: (error) => {
      console.error('FAQ 삭제 실패:', error);
    },
  });
}
