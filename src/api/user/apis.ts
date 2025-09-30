import { jsonAxios } from '../http';
import type {
  UserApiResponse,
  UserData,
  UserUpdateRequest,
  UserUpdateResponse,
  MyPageUpdateRequest,
  MyPageUpdateResponse,
} from './types';

// GET /api/v1/users - 사용자 정보 조회
export const fetchUser = async (): Promise<UserData> => {
  try {
    const res = await jsonAxios.get<UserApiResponse>('/users');
    console.log('GET /api/v1/users:', res.data);
    return res.data.data;
  } catch (error) {
    console.error('GET /api/v1/users:', error);
    throw error;
  }
};

// PUT /api/v1/users - 사용자 정보 수정
export const updateUser = async (
  data: UserUpdateRequest,
): Promise<UserUpdateResponse> => {
  try {
    const res = await jsonAxios.put<UserUpdateResponse>('/users', data);
    console.log('PUT /api/v1/users:', res.data);
    return res.data;
  } catch (error) {
    console.error('PUT /api/v1/users:', error);
    throw error;
  }
};

// DELETE /api/v1/users - 사용자 탈퇴
export const deleteUser = async (): Promise<void> => {
  try {
    const res = await jsonAxios.delete('/users');
    console.log('DELETE /api/v1/users:', res.data);
  } catch (error) {
    console.error('DELETE /api/v1/users:', error);
    throw error;
  }
};

// PUT /api/v1/users/mypage - 마이페이지 수정
export const updateMyPage = async (
  data: MyPageUpdateRequest,
): Promise<MyPageUpdateResponse['data']> => {
  try {
    const res = await jsonAxios.put<MyPageUpdateResponse>(
      '/users/mypage',
      data,
    );
    console.log('PUT /api/v1/users/mypage:', res.data);
    return res.data.data;
  } catch (error) {
    console.error('PUT /api/v1/users/mypage:', error);
    throw error;
  }
};
