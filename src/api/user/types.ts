// User API 관련 타입 정의

export type UserRole = 'PATIENT' | 'CAREGIVER' | 'DOCTOR';
export type Provider = 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE';

// 사용자 데이터 타입
export interface UserData {
  id: number;
  role: UserRole;
  name: string;
  provider: Provider;
  birthday: string;
  phone: string;
  isPushConsent: boolean;
}

// 사용자 정보 조회 API 응답 타입
export interface UserApiResponse {
  code: string;
  httpStatus: number;
  message: string;
  data: UserData;
  error: null | any;
}

// 사용자 정보 수정 요청 타입
export interface UserUpdateRequest {
  name?: string;
  phone?: string;
  birthday?: string;
  caregiverPhone?: string;
  isPushConsent?: boolean;
}

// 사용자 정보 수정 응답 타입
export interface UserUpdateResponse {
  code: string;
  httpStatus: number;
  message: string;
  data: UserData;
  error: null | any;
}

// 마이페이지 수정 요청 타입
export interface MyPageUpdateRequest {
  name: string;
  birthday: string;
  phone: string;
  isPushConsent: boolean;
}

// 마이페이지 수정 응답 데이터 타입
export interface MyPageUpdateData {
  id: number;
  name: string;
  birthday: string;
  phone: string;
  isPushConsent: boolean;
}

// 마이페이지 수정 응답 타입
export interface MyPageUpdateResponse {
  code: string;
  httpStatus: number;
  message: string;
  data: MyPageUpdateData;
  error: null | any;
}
