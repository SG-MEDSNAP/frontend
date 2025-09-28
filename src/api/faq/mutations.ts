import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerFaq } from './apis';
import { faqKeys } from './keys';
import type { FaqRegisterRequest, FaqRegisterResponse } from './types';

// Faq mutation
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
