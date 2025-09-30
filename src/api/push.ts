import { jsonAxios } from './http';
import { Platform } from 'react-native';

export type PushTokenPlatform = 'IOS' | 'ANDROID';

export interface RegisterPushTokenRequest {
  token: string;
  platform: PushTokenPlatform;
}

export interface RegisterPushTokenResponse {
  success: boolean;
  message?: string;
}

/**
 * 푸시 토큰을 서버에 등록합니다.
 * @param token - Expo 푸시 토큰 (ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx] 형태)
 * @param platform - 플랫폼 ('IOS' 또는 'ANDROID')
 */
export async function registerPushToken(
  token: string,
  platform?: PushTokenPlatform,
): Promise<RegisterPushTokenResponse> {
  try {
    // platform이 명시되지 않은 경우 현재 플랫폼을 자동으로 감지
    const currentPlatform =
      platform || (Platform.OS === 'ios' ? 'IOS' : 'ANDROID');

    const requestBody: RegisterPushTokenRequest = {
      token,
      platform: currentPlatform,
    };

    console.log('[PUSH] 푸시 토큰 등록 요청:', requestBody);

    const response = await jsonAxios.post('/push-tokens', requestBody);

    console.log('[PUSH] 푸시 토큰 등록 성공:', response.data);

    return {
      success: true,
      message:
        response.data?.message || '푸시 토큰이 성공적으로 등록되었습니다.',
    };
  } catch (error: any) {
    console.error('[PUSH] 푸시 토큰 등록 실패:', error);

    const errorMessage =
      error?.response?.data?.message || '푸시 토큰 등록에 실패했습니다.';

    return {
      success: false,
      message: errorMessage,
    };
  }
}

/**
 * 등록된 푸시 토큰을 삭제합니다.
 * @param token - 삭제할 Expo 푸시 토큰
 */
export async function deletePushToken(
  token: string,
): Promise<RegisterPushTokenResponse> {
  try {
    console.log('[PUSH] 푸시 토큰 삭제 요청:', { token });

    const response = await jsonAxios.delete('/push-tokens', {
      data: { token },
    });

    console.log('[PUSH] 푸시 토큰 삭제 성공:', response.data);

    return {
      success: true,
      message:
        response.data?.message || '푸시 토큰이 성공적으로 삭제되었습니다.',
    };
  } catch (error: any) {
    console.error('[PUSH] 푸시 토큰 삭제 실패:', error);

    const errorMessage =
      error?.response?.data?.message || '푸시 토큰 삭제에 실패했습니다.';

    return {
      success: false,
      message: errorMessage,
    };
  }
}
