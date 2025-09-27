import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { jwtDecode } from 'jwt-decode';

const IOS_CLIENT_ID =
  '507746381359-a9ttvvvt50lkua178guniv5g4buj4j8i.apps.googleusercontent.com';
const ANDROID_CLIENT_ID =
  '507746381359-d09u9mphhqkn1ukpht0cegerk2gvoihh.apps.googleusercontent.com';
const WEB_CLIENT_ID =
  '507746381359-02g4veqcth365nsu1h4u817adb945i7v.apps.googleusercontent.com';

export async function signInWithGoogle(): Promise<string> {
  GoogleSignin.configure({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID, // ★ 이게 없으면 idToken이 비는 경우가 많음
    scopes: ['openid', 'profile', 'email'],
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });

  // 캐시 초기화(선택)
  // await GoogleSignin.signOut().catch(()=>{});
  // await GoogleSignin.revokeAccess().catch(()=>{});

  const user = await GoogleSignin.signIn();
  let idToken = user?.idToken;

  // 일부 환경에서 signIn()이 idToken을 안 줄 때 보조 루트
  if (!idToken) {
    const tokens = await GoogleSignin.getTokens().catch(() => null);
    idToken = tokens?.idToken || null;
  }

  if (!idToken)
    throw new Error('Google idToken 없음 (webClientId/스코프/재로그인 확인)');

  // (선택) 클레임 확인
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
