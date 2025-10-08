import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Button from './Button';
import { useCamera } from '../hooks/useCamera';
import { MedicationRecordStatus } from '../api/medication/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface MedicationCardProps {
  name: string;
  time: string;
  status: MedicationRecordStatus;
  recordId?: number;
}

export default function MedicationCard({
  name,
  time,
  status,
  recordId,
}: MedicationCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { pickedImage, setPickedImage, takeImage } = useCamera({
    simulatorMessage: '카메라를 사용할 수 없어 복용 확인을 건너뜁니다.',
    errorMessage: '복용 확인 촬영 중 문제가 발생했습니다.',
  });

  const handleTakeImage = async () => {
    // 샘플 모드가 아니면 기존 카메라 로직 실행
    const image = await takeImage();
    if (image) {
      console.log('촬영된 이미지:', image.uri);

      // recordId가 있는 경우에만 촬영 후 분석 화면으로 이동
      if (recordId) {
        // 촬영 이미지와 recordId를 파라미터로 VerifyResultScreen으로 이동
        navigation.navigate('VerifyIntakeResult', {
          imageUri: image.uri,
          recordId: recordId,
        });
      } else {
        console.warn('복약 기록 ID가 없어 인증을 진행할 수 없습니다.');
      }
    }
  };

  return (
    <View className="flex-col grow p-4 mb-4 bg-white rounded-2xl">
      <View className="flex-row items-center">
        <View className="bg-[#F6F6F6] w-[92px] h-[30px] rounded-lg items-center justify-center mr-2">
          <Text className="text-[16px]/[20px] text-[#5D5D5D] font-bold">
            {time}
          </Text>
        </View>
        <Text className="text-[18px] font-bold text-[#333]">{name}</Text>
        <Text
          className={[
            'ml-[5px] text-[17px]/[26px] font-bold',
            status === 'TAKEN'
              ? 'text-[#597AFF]'
              : status === 'SKIPPED'
                ? 'text-[#FF0000]'
                : 'text-[#F89900]',
          ].join(' ')}
        >
          {status === 'TAKEN'
            ? '복용완료'
            : status === 'SKIPPED'
              ? '복용 미실행'
              : '복약 알림 대기'}
        </Text>
      </View>
      {status === 'PENDING' && (
        <View className="mt-5">
          <Button title="촬영하기" type="primary" onPress={handleTakeImage} />
        </View>
      )}
    </View>
  );
}
