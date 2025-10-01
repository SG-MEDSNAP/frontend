import React from 'react';
import { View, Text } from 'react-native';
import MedicationCard from './MedicationCard';
import { MedicationRecordItem } from '../api/medication/types';

interface TodayTimeLineProps {
  medications: MedicationRecordItem[];
}

export default function TodayTimeLine({ medications }: TodayTimeLineProps) {
  return (
    <View className="mt-1">
      {medications.length > 0 ? (
        medications.map((medication) => (
          <MedicationCard
            key={
              medication.recordId?.toString() ||
              (medication.medicationId && medication.medicationId.toString()) ||
              Math.random().toString()
            }
            name={medication.medicationName}
            time={medication.alarmTime}
            status={medication.status}
            recordId={medication.recordId}
          />
        ))
      ) : (
        <View className="flex-1 p-6 items-center">
          <Text className="text-[16px] text-[#666] text-center">
            등록된 약이 없습니다.{'\n'}새로운 약을 등록해보세요.
          </Text>
        </View>
      )}
    </View>
  );
}
