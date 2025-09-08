import React from 'react';
import { View, Text } from 'react-native';
import MedicationCard from './MedicationCard';

interface Medication {
  id: string;
  name: string;
  time: string;
  taken: boolean;
}

interface TodayScheduleProps {
  medications: Medication[];
}

export default function TodayTimeLine({ medications }: TodayScheduleProps) {
  return (
    <View className="mt-1">
      {medications.length > 0 ? (
        medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            name={medication.name}
            time={medication.time}
            taken={medication.taken}
          />
        ))
      ) : (
        <View className="bg-[#F8F9FA] rounded-[16px] p-6 items-center">
          <Text className="text-[16px] text-[#666] text-center">
            등록된 약물이 없습니다.{'\n'}새로운 약물을 등록해보세요.
          </Text>
        </View>
      )}
    </View>
  );
}
