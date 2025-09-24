import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  name: string;
  times: string; 
  caregiver: string; 
  days: string; 
  alarm: string; 
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function MyMedicationCard({
  name,
  times,
  caregiver,
  days,
  alarm,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between px-4 mb-2">
        <View className="flex-row items-center">
          <View className="w-[8px] h-[8px] rounded-full bg-primary-500 mr-2" />
          <Text className="h5 text-[#1F2937]">{name}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={onEdit}>
            <Text className="h8 text-gray-500">수정</Text>
          </TouchableOpacity>
          <Text className="h8 text-gray-500">|</Text>
          <TouchableOpacity onPress={onDelete}>
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

        {/* 보호자 문자 수신 */}
        <View className="mb-4">
          <Text className="h8 text-gray-500 mb-1">보호자 문자 수신</Text>
          <Text className="body-lg text-gray-900">{caregiver}</Text>
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
