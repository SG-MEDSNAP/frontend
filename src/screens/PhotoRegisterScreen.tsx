// src/screens/PhotoRegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';

// Expo 이미지 피커 (카메라)
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  type ImagePickerAsset,
} from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoRegister'>;

export default function PhotoRegisterScreen({ navigation }: Props) {
  const [pickedImage, setPickedImage] = useState<ImagePickerAsset | null>(null);

  // iOS/Android 공통 카메라 권한 훅
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  // 카메라 권한 확인/요청
  async function verifyPermissions() {
    if (
      cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
      Alert.alert(
        '카메라 접근 권한이 없습니다.',
        '이 앱을 사용하려면 설정 > 개인정보 보호 > 카메라에서 접근을 허용해주세요.'
      );
      return false;
    }

    return true; // 이미 허용됨
  }

  // 카메라 촬영
  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    try {
      const result = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        cameraType: 'back',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPickedImage(result.assets[0]);
        // 필요하면 여기서 서버 업로드/분석 API 호출 가능
        // console.log(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking image:', error);
      Alert.alert('오류', '사진 촬영 중 문제가 발생했습니다.');
    }
  }

  // 다음 단계(약 등록 폼)로 이동
  const handleNextPress = () => {
    navigation.navigate('MedicationRegister'); // 스택에 정의된 화면 이름과 일치해야 해요
  };

  // 프리뷰 JSX
  const imagePreview = pickedImage ? (
    <Image
      className="w-full h-full rounded-2xl"
      source={{ uri: pickedImage.uri }}
    />
  ) : (
    <Text>아직 사진이 촬영되지 않았습니다.</Text>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFF]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-4">
          <View className="mt-[42px]">
            <Text className="text-[30px]/[40px] font-bold text-[#404040] ">
              처방 받은 약을{'\n'}촬영해주세요
            </Text>
            <Text className="text-[16px]/[24px] mt-[15px] font-normal text-[#404040]">
              정확한 분석을 위해 제공된 약통에 약을 담아{'\n'}
              예시와 같이 사진을 찍어주세요
            </Text>
          </View>

          <View className="mt-[44px]">
            <Text className="mb-[10px] font-bold text-[#597AFF] text-[16px]/[24px]">
              예시) 약통이 잘리지 않은 정면 사진
            </Text>
            <View className="w-full aspect-[328/230]">
              <Image
                className="w-full h-full"
                source={require('../../assets/images/SampleImage1.png')}
                resizeMode="contain"
              />
            </View>
          </View>

          {pickedImage && (
            <View className="mt-[44px]">
              <Text className="mb-[10px] font-bold text-black text-[18px]/[24px]">
                촬영된 사진
              </Text>
              <View className="w-full aspect-[328/230]">{imagePreview}</View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="m-4">
        {!pickedImage ? (
          <Button title="촬영하기" onPress={takeImageHandler} />
        ) : (
          <View className="flex-row gap-4">
            <Button
              className="flex-grow basis-0 flex-[8]"
              type="secondary"
              title="다시 촬영하기"
              onPress={takeImageHandler}
            />
            <Button
              className="flex-grow basis-0 flex-[5]"
              title="다음"
              onPress={handleNextPress}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
