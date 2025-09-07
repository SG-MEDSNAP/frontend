import React from 'react';
import { View, Text } from 'react-native';
import MedicationCard from './MedicationCard';

interface Medication {
  id: string;
  name: string;
  time: string;
  frequency: string;
  taken: boolean;
}

interface TodayScheduleProps {
  medications: Medication[];
  onTakeMedication: (id: string) => void;
}

export default function TodaySchedule({
  medications,
  onTakeMedication,
}: TodayScheduleProps) {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const completedCount = medications.filter((med) => med.taken).length;
  const totalCount = medications.length;

  return (
    <View className="mb-6">
      <View className="mb-4">
        <Text className="text-[16px] text-[#666] mb-1">{currentDate}</Text>
        <Text className="text-[24px] font-bold text-[#333]">
          오늘의 복용 일정
        </Text>
        <Text className="text-[14px] text-[#597AFF] mt-1">
          {completedCount}/{totalCount} 완료
        </Text>
      </View>

      {medications.length > 0 ? (
        medications.map((medication) => (
          <MedicationCard
            key={medication.id}
            name={medication.name}
            time={medication.time}
            frequency={medication.frequency}
            taken={medication.taken}
            onTakePress={() => onTakeMedication(medication.id)}
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
