import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { jwtDecode } from 'jwt-decode';

const IOS_CLIENT_ID =
  '507746381359-a9ttvvvt50lkua178guniv5g4buj4j8i.apps.googleusercontent.com';
const WEB_CLIENT_ID =
  '507746381359-02g4veqcth365nsu1h4u817adb945i7v.apps.googleusercontent.com';

export async function signInWithGoogle(): Promise<string> {
  GoogleSignin.configure({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID, // ← idToken 받으려면 꼭 필요
    scopes: ['openid', 'profile', 'email'],
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });

  // ⬇️ Android 안정성 - Google Play 서비스 체크
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const res = await GoogleSignin.signIn();

  if (res.type !== 'success') {
    throw new Error('사용자가 구글 로그인을 취소했습니다.');
  }

  // 최신 타입: 토큰은 res.data 안에 있어요
  let idToken = res.data?.idToken ?? null;

  // 일부 환경 보조 루트
  if (!idToken) {
    try {
      const tokens = await GoogleSignin.getTokens();
      idToken = tokens?.idToken ?? null;
    } catch {}
  }

  if (!idToken) {
    throw new Error('Google idToken 없음 (webClientId/스코프/재로그인 확인)');
  }

  // (선택) 토큰 클레임 확인
  try {
    const c: any = jwtDecode(idToken);
    console.log('[GOOGLE claims]', {
      iss: c?.iss,
      aud: c?.aud,
      exp: c?.exp,
      sub: c?.sub,
    });
  } catch {}

  return idToken;
}
