import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  type ImagePickerAsset,
  CameraType,
} from 'expo-image-picker';

interface UseCameraOptions {
  simulatorMessage?: string;
  errorMessage?: string;
}

export function useCamera(options?: UseCameraOptions) {
  const [pickedImage, setPickedImage] = useState<ImagePickerAsset | null>(null);

  // 기본 메시지들
  const defaultSimulatorMessage =
    '카메라를 사용할 수 없어 바로 약 등록 화면으로 이동합니다.';
  const defaultErrorMessage = '사진 촬영 중 문제가 발생했습니다.';

  // iOS/Android 공통 카메라 권한 훅
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  // 카메라 권한 확인/요청
  const verifyPermissions = async () => {
    if (cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert(
        '카메라 접근 권한이 없습니다.',
        '이 앱을 사용하려면 설정 > 개인정보 보호 > 카메라에서 접근을 허용해주세요.',
      );
      return false;
    }

    return true; // 이미 허용됨
  };

  // 카메라 촬영
  const takeImage = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return null;

    try {
      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        cameraType: CameraType.back,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        setPickedImage(image);
        return image;
      }
      return null;
    } catch (error) {
      console.log('Error taking image:', error);

      if (
        error instanceof Error &&
        error.message?.includes('Camera not available')
      ) {
        Alert.alert(
          '시뮬레이터 모드',
          options?.simulatorMessage || defaultSimulatorMessage,
        );
      } else {
        Alert.alert('오류', '사진 촬영 중 문제가 발생했습니다.');
      }
      return null;
    }
  };

  return {
    pickedImage,
    setPickedImage,
    takeImage,
    verifyPermissions,
  };
}
