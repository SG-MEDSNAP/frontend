import React, { useState } from 'react';
import { View, Text, Image, ScrollView, SafeAreaView } from 'react-native';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
// 카메라 접근
import { launchCameraAsync } from 'expo-image-picker';

export default function PhotoScreen() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  async function takeImageHandler() {
    const image = await launchCameraAsync({
      allowsEditing: true, // 사용자가 사진을 사용하기 전에 편집할 수 있게 허용
      aspect: [16, 9],
      quality: 0.5, // 이미지 품질 설정 (0 ~ 1)
    });
    console.log(image);
  }

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
            <Text className="mb-2 font-bold text-[#597AFF] text-[16px]/[24px]">
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

          {capturedImage && (
            <View className="mt-[44px]">
              <Text className="mb-2 font-bold text-[#597AFF] text-[16px]/[24px]">
                촬영된 사진
              </Text>
              <View className="w-full aspect-[328/230]">
                <Image
                  className="w-full h-full"
                  source={{ uri: capturedImage }}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View className="m-4">
        <Button title="촬영하기" onPress={takeImageHandler} />
      </View>
    </SafeAreaView>
  );
}
function laumchCameraAsync() {
  throw new Error('Function not implemented.');
}
