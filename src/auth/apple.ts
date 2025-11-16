import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';

const BUNDLE_ID = 'com.qkrb8019.medsnap';

// Apple 로그인 및 사용자 정보 반환 (fullName 포함)
export interface AppleLoginResult {
  idToken: string;
  fullName?: {
    givenName: string | null;
    familyName: string | null;
  } | null;
}

// Apple 로그인 메인 함수 (idToken과 fullName 모두 반환)
export async function signInWithAppleAndGetUserInfo(): Promise<AppleLoginResult> {
  try {
    // Apple 로그인 가능 여부 확인
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple 로그인을 사용할 수 없습니다. (iOS 13+ 필요)');
    }

    // Apple 로그인 요청
    const response = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    console.log('user', response.user);
    console.log('결과', response);

    const { identityToken, user, fullName, email } = response;

    if (!identityToken) {
      throw new Error('Apple idToken 없음 (identityToken 확인)');
    }

    // 자격 증명 상태 확인 (재인증/취소된 계정 대응) - 선택적
    try {
      const credentialState =
        await AppleAuthentication.getCredentialStateAsync(user);
      if (
        credentialState !==
        AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED
      ) {
        console.warn(
          '[APPLE] 인증 상태가 AUTHORIZED가 아닙니다:',
          credentialState,
        );
        // 상태가 AUTHORIZED가 아니어도 identityToken이 있으면 계속 진행
      }
    } catch (credentialError) {
      console.warn(
        '[APPLE] 자격 증명 상태 확인 실패, identityToken으로 계속 진행:',
        credentialError,
      );
      // 자격 증명 상태 확인 실패해도 identityToken이 있으면 계속 진행
    }

    // (선택) 클레임 확인
    try {
      const claims: any = jwtDecode(identityToken);
      console.log('[APPLE claims]', {
        iss: claims?.iss, // https://appleid.apple.com
        aud: claims?.aud, // Bundle ID와 일치해야 함
        exp: claims?.exp, // 만료 시간
        sub: claims?.sub, // Apple user ID
        email: claims?.email, // 이메일 (첫 로그인에만)
        email_verified: claims?.email_verified,
      });

      // Bundle ID 검증
      if (claims?.aud !== BUNDLE_ID) {
        console.warn('[APPLE] Bundle ID 불일치:', {
          expected: BUNDLE_ID,
          actual: claims?.aud,
        });
      }
    } catch (e) {
      console.log('[APPLE claims] decode 실패', e);
    }

    // 첫 로그인 시 받은 정보 로그 (개발용)
    console.log('[APPLE] signInWithAppleAndGetUserInfo 응답값:', {
      idToken: identityToken ? `${identityToken.substring(0, 50)}...` : 'null',
      user, // Apple user ID
      fullName: fullName,
      givenName: fullName?.givenName,
      familyName: fullName?.familyName,
      email,
      fullNameString: fullName
        ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
        : null,
    });

    return {
      idToken: identityToken,
      fullName: fullName || null,
    };
  } catch (e) {
    const error = e as { code?: string; message?: string };
    if (error.code === 'ERR_REQUEST_CANCELED') {
      throw new Error('Apple 로그인이 취소되었습니다.');
    }
    if (error.code === 'ERR_REQUEST_NOT_HANDLED') {
      throw new Error('Apple 로그인을 처리할 수 없습니다.');
    }
    if (error.code === 'ERR_REQUEST_NOT_INTERACTIVE') {
      throw new Error('Apple 로그인 상호작용을 할 수 없습니다.');
    }
    throw new Error(
      `Apple 로그인 실패: ${error?.message || '알 수 없는 오류'}`,
    );
  }
}
