import NaverLogin from '@react-native-seoul/naver-login';
import { jwtDecode } from 'jwt-decode';

const CLIENT_ID = 'G2Dui5LZ_lzXaQWiFQtv';
const CLIENT_SECRET = 'paDkQEzyNr';
const IOS_SCHEME = `naver${CLIENT_ID}`; // ==> naverG2Dui5LZ_lzXaQWiFQtv

export async function signInWithNaver(): Promise<string> {
  // ✅ iOS 초기화 (중요: serviceUrlSchemeIOS)
  NaverLogin.initialize({
    appName: 'medsnap',
    consumerKey: CLIENT_ID,
    consumerSecret: CLIENT_SECRET,
    serviceUrlSchemeIOS: IOS_SCHEME, // <- 이 값이 없으면 지금 경고가 뜸
  });

  // ✅ 로그인
  const res: any = await NaverLogin.login();
  const idToken = res?.successResponse?.idToken ?? res?.idToken;
  if (!idToken)
    throw new Error('Naver idToken 없음 (콘솔 OIDC / openid 스코프 확인)');

  // (선택) 클레임 확인
  try {
    const c: any = jwtDecode(idToken);
    console.log('[NAVER claims]', {
      iss: c?.iss,
      aud: c?.aud,
      exp: c?.exp,
      sub: c?.sub,
    });
  } catch {}

  return idToken;
}
