import { useQuery } from '@tanstack/react-query';
import { getAccessToken, getRefreshToken, shouldRefreshToken } from './apis';
import { authKeys } from './keys';

// 현재 액세스 토큰 조회
export function useAccessToken() {
  return useQuery({
    queryKey: [...authKeys.tokens(), 'access'],
    queryFn: getAccessToken,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

// 현재 리프레시 토큰 조회
export function useRefreshTokenQuery() {
  return useQuery({
    queryKey: [...authKeys.tokens(), 'refresh'],
    queryFn: getRefreshToken,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

// 토큰 유효성 확인
export function useTokenValidation() {
  const { data: accessToken } = useAccessToken();

  return useQuery({
    queryKey: [...authKeys.tokens(), 'validation'],
    queryFn: () => {
      if (!accessToken) return false;
      return !shouldRefreshToken(accessToken);
    },
    enabled: !!accessToken,
    staleTime: 1000 * 30, // 30초
  });
}

// 인증 상태 확인
export function useAuthStatus() {
  const { data: accessToken } = useAccessToken();
  const { data: refreshToken } = useRefreshTokenQuery();

  return useQuery({
    queryKey: [...authKeys.user(), 'status'],
    queryFn: () => {
      return {
        isAuthenticated: !!(accessToken && refreshToken),
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      };
    },
    enabled: true,
    staleTime: 1000 * 60, // 1분
  });
}
