import { useQuery } from '@tanstack/react-query';
import { fetchFaqs } from './apis';
import { faqKeys } from './keys';
import type { FaqData } from './types';

// FAQ 목록 조회 훅
export function useFaqsQuery() {
  const query = useQuery<FaqData[]>({
    queryKey: faqKeys.lists(),
    queryFn: fetchFaqs,
  });

  return query;
}

// 특정 FAQ 조회 훅 (아직 안만듦)
// export function useFaqQuery(id: number) {
//   return useQuery<FaqData>({
//     queryKey: faqKeys.detail(id),
//     queryFn: () => fetchFaqById(id),
//     enabled: !!id, // id가 있을 때만 쿼리 실행
//   });
// }
