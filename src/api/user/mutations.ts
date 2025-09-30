import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, deleteUser, updateMyPage } from './apis';
import { userKeys } from './keys';
import type { UserUpdateRequest, MyPageUpdateRequest } from './types';

// 사용자 정보 수정 mutation
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdateRequest) => updateUser(data),
    onSuccess: () => {
      // 사용자 정보 수정 성공 시 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('[USER] 사용자 정보 수정 실패:', error);
    },
  });
}

// 사용자 탈퇴 mutation
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // 사용자 탈퇴 성공 시 모든 관련 쿼리들 제거
      queryClient.removeQueries({ queryKey: userKeys.all });
      // 다른 도메인의 쿼리들도 무효화 (사용자별 데이터)
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('[USER] 사용자 탈퇴 실패:', error);
    },
  });
}

// 마이페이지 수정 mutation
export function useUpdateMyPageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MyPageUpdateRequest) => updateMyPage(data),
    onSuccess: () => {
      // 마이페이지 수정 성공 시 사용자 정보 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('[USER] 마이페이지 수정 실패:', error);
    },
  });
}
