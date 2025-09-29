import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  loginWithIdToken,
  signupWithIdToken,
  logout,
  refreshToken,
} from './apis';
import { authKeys } from './keys';
import type { LoginRequest, SignupRequest } from './types';

// 로그인 mutation
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithIdToken,
    onSuccess: (data) => {
      if (data) {
        // 로그인 성공 시 관련 쿼리들 무효화
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
        queryClient.invalidateQueries({ queryKey: authKeys.tokens() });
      }
    },
    onError: (error) => {
      console.error('[AUTH] 로그인 실패:', error);
    },
  });
}

// 회원가입 mutation
export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signupWithIdToken,
    onSuccess: (data) => {
      // 회원가입 성공 시 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      queryClient.invalidateQueries({ queryKey: authKeys.tokens() });
    },
    onError: (error) => {
      console.error('[AUTH] 회원가입 실패:', error);
    },
  });
}

// 로그아웃 mutation
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 로그아웃 성공 시 모든 인증 관련 쿼리들 제거
      queryClient.removeQueries({ queryKey: authKeys.all });
      // 다른 도메인의 쿼리들도 무효화 (사용자별 데이터)
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.error('[AUTH] 로그아웃 실패:', error);
      // 로그아웃 실패해도 로컬 토큰은 삭제되므로 쿼리들 정리
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.invalidateQueries();
    },
  });
}

// 토큰 재발급 mutation
export function useRefreshTokenMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => {
      // 토큰 재발급 성공 시 토큰 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: authKeys.tokens() });
    },
    onError: (error) => {
      console.error('[AUTH] 토큰 재발급 실패:', error);
      // 토큰 재발급 실패 시 로그아웃 처리
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
