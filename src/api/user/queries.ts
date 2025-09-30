import { useQuery } from '@tanstack/react-query';
import { fetchUser } from './apis';
import { userKeys } from './keys';
import type { UserData } from './types';

// 사용자 정보 조회 훅
export function useUserQuery() {
  const query = useQuery<UserData>({
    queryKey: userKeys.profile(),
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });

  return query;
}
