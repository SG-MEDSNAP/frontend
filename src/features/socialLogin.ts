import { useMutation } from '@tanstack/react-query';
import { loginWithIdToken, Provider } from '../api/auth';
import { getIdTokenFor } from '../auth/getIdToken';

export async function socialLoginOrSignupKickoff(provider: Provider) {
  // 1) idToken 확보
  const idToken = await getIdTokenFor(provider); // 에러 나면 throw

  // 2) 로그인 시도
  try {
    const login = await loginWithIdToken({ idToken, provider });
    if (login) return { next: 'HOME' as const }; // 로그인 완료
    // loginWithIdToken이 404/409에서 null 리턴하도록 이미 구현되어 있음
    return { next: 'SIGNUP' as const, idToken, provider }; // 회원가입 화면으로
  } catch (e: any) {
    // 401: 토큰 검증 실패(issuer/audience/만료 등)
    if (e?.response?.status === 401) {
      throw new Error('소셜 토큰 검증에 실패했어요. 다시 로그인해 주세요.');
    }
    throw e;
  }
}

// TanStack Query mutation hook for social login
export function useSocialLoginMutation() {
  return useMutation({
    mutationFn: async (provider: Provider) => {
      return await socialLoginOrSignupKickoff(provider);
    },
    onError: (error: any) => {
      console.error('[SOCIAL_LOGIN] 로그인 실패:', error);
      // 에러 토스트 표시 로직 추가 가능
    },
  });
}
