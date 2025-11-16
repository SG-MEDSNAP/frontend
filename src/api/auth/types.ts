export type Provider = 'GOOGLE' | 'APPLE' | 'KAKAO' | 'NAVER';

export type AppleUserPayload = {
  name: {
    firstName: string;
    lastName: string;
  };
};

export interface LoginRequest {
  idToken: string;
  provider: Provider;
  appleUserPayload?: AppleUserPayload;
}

export interface SignupRequest {
  idToken: string;
  provider: Provider;
  name: string;
  birthday: string;
  phone: string;
  caregiverPhone?: string;
  isPushConsent: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    provider: Provider;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
