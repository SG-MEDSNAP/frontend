import { Provider } from '../api/auth';
import {
  login as kakaoLogin,
  loginWithKakaoAccount,
} from '@react-native-seoul/kakao-login';
import { signInWithNaver } from './naver';
import { signInWithGoogle } from './google';
import { jwtDecode } from 'jwt-decode';

export async function getIdTokenFor(provider: Provider): Promise<string> {
  switch (provider) {
    case 'KAKAO':
      return await getKakaoIdToken();
    case 'NAVER':
      return await signInWithNaver();
    case 'GOOGLE':
      return await signInWithGoogle();
    case 'APPLE':
      throw new Error('Apple 로그인은 아직 구현되지 않았습니다.');
    default:
      throw new Error(`지원하지 않는 소셜 로그인: ${provider}`);
  }
}

async function getKakaoIdToken(): Promise<string> {
  // 1) 카카오톡 앱 로그인 시도 (파라미터 없음)
  try {
    const r = await kakaoLogin();
    if (r?.idToken) {
      debugClaims(r.idToken);
      return r.idToken;
    }
  } catch (err) {
    console.log('[KAKAO] 톡 로그인 실패 → 계정 로그인으로 fallback:', err);
  }

  // 2) 계정 로그인(웹뷰) 시도 (파라미터 없음)
  const r2 = await loginWithKakaoAccount();
  if (!r2?.idToken) {
    throw new Error(
      'Kakao idToken 없음 (콘솔 OIDC ON + 동의항목에 openid 추가 필요)',
    );
  }
  debugClaims(r2.idToken);
  return r2.idToken;
}

function debugClaims(idToken: string) {
  try {
    const c = jwtDecode<any>(idToken);
    console.log('[KAKAO claims]', {
      iss: c?.iss, // => https://kauth.kakao.com
      aud: c?.aud, // => (카카오 앱의) REST API 키
      exp: c?.exp,
      sub: c?.sub,
    });
  } catch (e) {
    console.log('[KAKAO claims] decode 실패', e);
  }
}
