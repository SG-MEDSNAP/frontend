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

// 카메라 접근
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
  ImagePickerResult,
} from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList>;

export default function PhotoScreen({ navigation }: Props) {
  const [pickedImage, setPickedImage] = useState<ImagePickerResult>();

  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions(); // iOS용

  async function verifyPermissions() {
    // 카메라 사용할 권한이 있는지 확인하는 함수
    // Prettier는 null일수도잇다고 ?붙이라고함
    if (cameraPermissionInformation?.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission(); // 권한 요청
      // 다이얼로그를 열고 사용자 응답을 기다린 다음, 프로미스를 반환하느 비동기함수이기에 await를 붙인다.
      // 권한을 부여하거나 거부

      return permissionResponse.granted; // 권한이 부여되었는지 여부 반환 (true/false인 프로미스 반환)
    }

    if (cameraPermissionInformation?.status === PermissionStatus.DENIED) {
      // 권한이 거부된 상태
      Alert.alert(
        // react-native의 Alert API
        '카메라 접근 권한이 없습니다.',
        '이 앱을 사용하려면, 앱 설정에서 카메라 접근 권한을 허용해주세요.',
      );
      return false;
    }

    return true; // 권한이 이미 허용된 상태
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions(); // 권한 확인

    if (!hasPermission) {
      return; // 권한이 없으면 함수 종료
    }

    try {
      const image = await launchCameraAsync({
        allowsEditing: true, // 사용자가 사진을 사용하기 전에 편집할 수 있게 허용
        aspect: [16, 9],
        quality: 0.5, // 이미지 품질 설정 (0 ~ 1)
      });

      // 사진을 찍고 나서 취소하지 않았을 때만 상태 업데이트
      // 카메라까지는 갔는데 찍지않고 뒤로가기 하면 image를 업데이트하지 않는다.
      if (!image.canceled) {
        setPickedImage(image);
        console.log(image.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking image:', error);
      Alert.alert('오류', '사진 촬영 중 문제가 발생했습니다.');
    }
  }
  // 이미지가 없을 때를 위한 fallback 텍스트. 상수(const)로 선언하면 안됨
  let imagePreview = <Text>아직 사진이 촬영되지 않았습니다.</Text>;

  if (pickedImage) {
    imagePreview = (
      <Image
        className="w-full h-full rounded-2xl"
        source={{ uri: pickedImage.assets[0].uri }}
      />
    );
  }

  const handleNextPress = () => {
    navigation.navigate('MedicationRegister');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFF]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-4">
          <View className="mt-[42px]">
            <Text className="text-[30px]/[40px] font-bold text-[#404040] ">
              처방 받은 약을
              {'\n'}촬영해주세요
            </Text>
            <Text className="text-[16px]/[24px] mt-[15px] font-normal text-[#404040]">
              정확한 분석을 위해 제공된 약통에 약을 담아
              {'\n'}예시와 같이 사진을 찍어주세요
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
