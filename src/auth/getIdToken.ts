import { Provider } from '../api/auth';
import {
  login as kakaoLogin,
  loginWithKakaoAccount,
  isKakaoTalkLoginAvailable,
} from '@react-native-seoul/kakao-login';
import { signInWithNaver } from './naver';
import { signInWithGoogle } from './google';
import { signInWithApple } from './apple';
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
      return await signInWithApple();
    default:
      throw new Error(`지원하지 않는 소셜 로그인: ${provider}`);
  }
}

async function getKakaoIdToken(): Promise<string> {
  console.log('[KAKAO] 카카오 로그인 시작');

  // 임시: 카카오톡 앱 로그인 문제로 인해 웹뷰 로그인만 사용
  // TODO: 카카오톡 앱 로그인 URL Scheme 문제 해결 후 다시 활성화
  console.log('[KAKAO] 카카오톡 앱 로그인 비활성화 (임시) → 웹뷰 로그인 사용');

  try {
    // 계정 로그인(웹뷰) 시도
    console.log('[KAKAO] 카카오 계정 로그인 시도');
    const r2 = await loginWithKakaoAccount();
    if (!r2?.idToken) {
      console.error('[KAKAO] 카카오 계정 로그인 - idToken 없음');
      throw new Error(
        'Kakao idToken 없음 (콘솔 OIDC ON + 동의항목에 openid 추가 필요)',
      );
    }
    console.log('[KAKAO] 카카오 계정 로그인 성공');
    debugClaims(r2.idToken);
    return r2.idToken;
  } catch (err) {
    console.error('[KAKAO] 카카오 계정 로그인 실패:', err);
    throw err;
  }
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
