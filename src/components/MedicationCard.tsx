import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Button from './Button';

interface MedicationCardProps {
  name: string;
  time: string;
  taken?: boolean;
}

export default function MedicationCard({
  name,
  time,
  taken = false,
}: MedicationCardProps) {
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
            taken ? 'text-[#597AFF]' : 'text-[#F89900]',
          ].join(' ')}
        >
          {taken ? '복용완료' : '복약 알림 대기'}
        </Text>
      </View>
      {!taken && (
        <View className="mt-5">
          <Button title="촬영하기" />
        </View>
      )}
    </View>
  );
}
