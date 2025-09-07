import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface MedicationCardProps {
  name: string;
  time: string;
  frequency: string;
  taken?: boolean;
  onTakePress?: () => void;
}

export default function MedicationCard({
  name,
  time,
  frequency,
  taken = false,
  onTakePress,
}: MedicationCardProps) {
  return (
    <View className="bg-white rounded-[16px] p-4 mb-3 shadow-sm border border-[#F0F0F0]">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-[18px] font-bold text-[#333] mb-1">{name}</Text>
          <Text className="text-[14px] text-[#666]">
            {time} • {frequency}
          </Text>
        </View>
        <Pressable
          onPress={onTakePress}
          className={[
            'w-[80px] h-[36px] rounded-[18px] items-center justify-center',
            taken ? 'bg-[#E8F5E8]' : 'bg-[#597AFF]',
          ].join(' ')}
        >
          <Text
            className={[
              'text-[14px] font-semibold',
              taken ? 'text-[#4CAF50]' : 'text-white',
            ].join(' ')}
          >
            {taken ? '복용완료' : '복약 알림 대기'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
