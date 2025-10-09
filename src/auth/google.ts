import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { jwtDecode } from 'jwt-decode';

const IOS_CLIENT_ID =
  '507746381359-a9ttvvvt50lkua178guniv5g4buj4j8i.apps.googleusercontent.com';
const WEB_CLIENT_ID =
  '507746381359-02g4veqcth365nsu1h4u817adb945i7v.apps.googleusercontent.com';

export async function signInWithGoogle(): Promise<string> {
  GoogleSignin.configure({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID, // ← 서버 검증용 aud가 이 값으로 나옵니다
    scopes: ['openid', 'profile', 'email'],
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });

  // Android 안정성
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const res = await GoogleSignin.signIn();

  if (res.type !== 'success') {
    throw new Error('사용자가 구글 로그인을 취소했습니다.');
  }

  // ✅ v16: 토큰은 res.data.idToken
  let idToken = res.data?.idToken ?? null;

  // 보조 루트: 일부 기기에서 signIn 직후 idToken이 null일 때
  if (!idToken) {
    try {
      const tokens = await GoogleSignin.getTokens();
      idToken = tokens?.idToken ?? null;
    } catch {}
  }

  if (!idToken) {
    throw new Error('Google idToken 없음 (webClientId/스코프/재로그인 확인)');
  }

  // (선택) 토큰 클레임 확인 — 서버 aud 매칭 점검용
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
