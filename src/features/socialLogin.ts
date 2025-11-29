import { useMutation } from '@tanstack/react-query';
import { loginWithIdToken, Provider, AppleUserPayload } from '../api/auth';
import {
  getIdTokenFor,
  getCachedAppleResult,
  clearAppleCache,
} from '../auth/getIdToken';

export async function socialLoginOrSignupKickoff(provider: Provider) {
  // 1) idToken 확보
  const idToken = await getIdTokenFor(provider); // 에러 나면 throw

  // 2) 로그인 시도
  try {
    console.log(`[SOCIAL_LOGIN] 백엔드 API 호출 시작 - Provider: ${provider}`);
    let appleUserPayload: AppleUserPayload | undefined = undefined;

    // Apple 로그인 시 결과에서 fullName 가져오기 (getIdTokenFor에서 이미 호출됨)
    if (provider === 'APPLE') {
      const appleResult = getCachedAppleResult();
      if (appleResult) {
        console.log('[SOCIAL_LOGIN] Apple 로그인 응답값:', {
          idToken: appleResult.idToken
            ? `${appleResult.idToken.substring(0, 50)}...`
            : 'null',
          fullName: appleResult.fullName,
          givenName: appleResult.fullName?.givenName,
          familyName: appleResult.fullName?.familyName,
        });

        const givenName = appleResult.fullName?.givenName?.trim() || '';
        const familyName = appleResult.fullName?.familyName?.trim() || '';
        // 응답 매핑: givenName -> firstName, familyName -> lastName (없으면 빈 문자열)
        appleUserPayload = {
          name: {
            firstName: givenName,
            lastName: familyName,
          },
        };
        console.log(
          '[SOCIAL_LOGIN] appleUserPayload 생성됨:',
          appleUserPayload,
        );
        // 캐시 정리
        clearAppleCache();
      }
    }

    const loginRequest: {
      idToken: string;
      provider: Provider;
      appleUserPayload?: AppleUserPayload;
    } = { idToken, provider };

    if (appleUserPayload) {
      loginRequest.appleUserPayload = appleUserPayload;
    }

    const login = await loginWithIdToken(loginRequest);
    console.log(`[SOCIAL_LOGIN] 백엔드 API 응답:`, login);
    if (login?.success && login.data) {
      console.log('[SOCIAL_LOGIN] 로그인 성공 - 홈 화면으로 이동');
      return { next: 'HOME' as const, idToken }; // 로그인 완료
    }
    // loginWithIdToken이 404/409에서 { success: false, nameHint? } 리턴
    const nameHint = login?.nameHint;
    console.log(
      '[SOCIAL_LOGIN] 로그인 실패 (404/409) - 회원가입 화면으로 이동',
      nameHint ? `(nameHint: ${nameHint})` : '',
    );
    return {
      next: 'SIGNUP' as const,
      idToken,
      provider,
      nameHint: nameHint || undefined,
    }; // 회원가입 화면으로
  } catch (e) {
    interface AxiosErrorResponse {
      status?: number;
      data?: unknown;
    }

    interface AxiosError extends Error {
      code?: string;
      response?: AxiosErrorResponse;
      config?: {
        url?: string;
      };
    }

    const error = e as AxiosError;
    console.error(`[SOCIAL_LOGIN] 백엔드 API 에러:`, {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      data: error?.response?.data,
      config: error?.config?.url,
    });

    // 401: 토큰 검증 실패(issuer/audience/만료 등)
    if (error?.response?.status === 401) {
      throw new Error('소셜 토큰 검증에 실패했어요. 다시 로그인해 주세요.');
    }
    throw e;
  }
}

// TanStack Query mutation hook for social login
export function useSocialLoginMutation() {
  return useMutation({
    mutationFn: async (provider: Provider) => {
      console.log(`[SOCIAL_LOGIN] ${provider} 로그인 시작`);
      try {
        const result = await Promise.race([
          socialLoginOrSignupKickoff(provider),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('로그인 타임아웃 (60초)')),
              60000,
            ),
          ),
        ]);
        console.log(`[SOCIAL_LOGIN] ${provider} 로그인 완료:`, result);
        return result;
      } catch (error) {
        console.error(`[SOCIAL_LOGIN] ${provider} 로그인 에러:`, error);
        throw error;
      }
    },
    onError: (error: unknown) => {
      console.error('[SOCIAL_LOGIN] 로그인 실패:', error);
      // 에러 토스트 표시 로직 추가 가능
    },
  });
}
