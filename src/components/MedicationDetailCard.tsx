import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Button from './Button';
import { useCamera } from '../hooks/useCamera';
import { MedicationRecordStatus } from '../api/medication/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/styles/designSystem';

export interface MedicationDetailCardProps {
  recordId?: number;
  medicationName: string;
  alarmTime: string;
  status: MedicationRecordStatus;
  imageUrl?: string;
  firstAlarmAt?: string;
  secondAlarmAt?: string;
  caregiverNotifiedAt?: string;
  checkedAt?: string;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelectionToggle: () => void;
  onImageView: (imageUrl: string) => void;
}

interface StatusItemProps {
  label: string;
  completed: boolean;
  showViewButton?: boolean;
  onViewPress?: () => void;
}

function StatusItem({
  label,
  completed,
  showViewButton,
  onViewPress,
}: StatusItemProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px]/[26px] font-medium text-[#232323]">
          {label}
        </Text>
        <View className="flex-row items-center gap-3">
          {showViewButton && (
            <TouchableOpacity onPress={onViewPress}>
              <Text className="text-[18px]/[26px] font-medium text-[#232323] underline">
                보기
              </Text>
            </TouchableOpacity>
          )}
          <Text className="text-[16px]/[22px] font-medium text-[#597AFF]">
            {completed ? '완료' : '미완료'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function MedicationDetailCard({
  recordId,
  medicationName,
  alarmTime,
  status,
  imageUrl,
  firstAlarmAt,
  secondAlarmAt,
  caregiverNotifiedAt,
  isSelectionMode,
  isSelected,
  onSelectionToggle,
  onImageView,
}: MedicationDetailCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { pickedImage, setPickedImage, takeImage } = useCamera({
    simulatorMessage: '카메라를 사용할 수 없어 복용 확인을 건너뜁니다.',
    errorMessage: '복용 확인 촬영 중 문제가 발생했습니다.',
  });

  const getStatusColor = (status: MedicationRecordStatus) => {
    switch (status) {
      case 'TAKEN':
        return '#597AFF'; // 복약 완료
      case 'PENDING':
        return '#F89900'; // 복약 대기
      case 'SKIPPED':
        return '#FF0000'; // 복약 미 실행 (빨간색)
      default:
        return '#666666';
    }
  };

  const getStatusText = (status: MedicationRecordStatus) => {
    switch (status) {
      case 'TAKEN':
        return '복약 완료';
      case 'PENDING':
        return '복약 알림 대기';
      case 'SKIPPED':
        return '복약 미 실행';
      default:
        return status;
    }
  };

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
    <View className="mb-8">
      {/* Header with selection */}
      <View className="bg-white rounded-2xl p-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-[20px]/[28px] font-bold text-[#232323] mb-1">
              {medicationName}
            </Text>
            <Text className="text-[16px]/[16px] text-[#232323] font-bold">
              {alarmTime}
            </Text>
            <Text
              className="text-[16px]/[22px] font-medium mt-1"
              style={{ color: getStatusColor(status) }}
            >
              {getStatusText(status)}
            </Text>
          </View>

          {/* Selection Circle */}
          <TouchableOpacity
            onPress={onSelectionToggle}
            className="w-8 h-8 rounded-full border-2 border-gray-300 items-center justify-center"
            style={{
              backgroundColor: isSelected ? colors.primary[500] : 'white',
              borderColor: isSelected ? colors.primary[500] : '#D1D5DB',
            }}
          >
            {isSelected && (
              <Text className="text-white text-sm font-bold">✓</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Status Items */}

        <StatusItem label="앱 알림 1차" completed={!!firstAlarmAt} />
        <StatusItem label="앱 알림 2차" completed={!!secondAlarmAt} />
        <StatusItem
          label="사진 촬영"
          completed={!!imageUrl}
          showViewButton={!!imageUrl}
          onViewPress={() => imageUrl && onImageView(imageUrl)}
        />
        <StatusItem label="보호자 알림" completed={!!caregiverNotifiedAt} />

        {/* 촬영하기 버튼 - PENDING 상태일 때만 표시 */}
        {status === 'PENDING' && (
          <View className="mt-4">
            <Button title="촬영하기" type="primary" onPress={handleTakeImage} />
          </View>
        )}
      </View>
    </View>
  );
}
