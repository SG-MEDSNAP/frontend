import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeleteMedicationMutation } from '../api/medication';

type Props = {
  name: string;
  times: string;
  days: string;
  alarm: string;
  id?: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function MyMedicationCard({
  name,
  times,
  days,
  alarm,
  onEdit,
  onDelete,
  id,
}: Props) {
  const navigation: any = useNavigation();
  const deleteMedicationMutation = useDeleteMedicationMutation();

  const handleDelete = async () => {
    if (!id) {
      Alert.alert('삭제 실패', '삭제할 약 ID가 없습니다.');
      return;
    }

    deleteMedicationMutation.mutate(id, {
      onSuccess: () => {
        Alert.alert('삭제 완료', '약 정보가 삭제되었습니다.');
        if (onDelete) onDelete();
      },
      onError: (error: any) => {
        Alert.alert('삭제 실패', error?.message ?? '다시 시도해주세요.');
      },
    });
  };
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between px-4 mb-2">
        <View className="flex-row items-center">
          <View className="w-[8px] h-[8px] rounded-full bg-primary-500 mr-2" />
          <Text className="h5 text-[#1F2937]">{name}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => navigation.navigate('EditMedication')}
          >
            <Text className="h8 text-gray-500">수정</Text>
          </TouchableOpacity>
          <Text className="h8 text-gray-500">|</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('삭제 확인', '약 정보를 삭제하시겠어요?', [
                { text: '취소', style: 'cancel' },
                { text: '삭제', style: 'destructive', onPress: handleDelete },
              ])
            }
          >
            <Text className="h8 text-gray-500">삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card body */}
      <View className="bg-white rounded-2xl p-4 mx-4">
        {/* 시간 */}
        <View className="mb-4">
          <Text className="h8 text-gray-500 mb-1">시간</Text>
          <Text className="body-lg text-gray-900">{times}</Text>
        </View>

        {/* 요일 */}
        <View className="mb-4">
          <Text className="h8 text-gray-500 mb-1">요일</Text>
          <Text className="body-lg text-gray-900">{days}</Text>
        </View>

        {/* 알림 */}
        <View>
          <Text className="h8 text-gray-500 mb-1">알림</Text>
          <Text className="body-lg text-gray-900">{alarm}</Text>
        </View>
      </View>
    </View>
  );
}
