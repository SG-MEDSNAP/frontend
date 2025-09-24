import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import MyMedicationCard from '../components/MyMedicationCard';

export default function MyPageScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary-50" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        {/* Header Card */}
        <View className="bg-primary-950 w-full">
          <View className="px-4 py-7 flex-row items-center justify-between">
            <View>
              <Text className="h8 text-primary-500">카카오 로그인</Text>
              <Text className="h3 text-white mt-2">홍길동님</Text>
            </View>
            <Icon name="settings" size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
        </View>

        {/* Cards Area */}
        <View className="mt-4">
          <MyMedicationCard
            name="혈압약"
            times="오전 09:00 | 오후 01:00 | 오후 08:00"
            caregiver="010-0000-0000"
            days="매일"
            alarm="지정 시간 | 10분전"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
