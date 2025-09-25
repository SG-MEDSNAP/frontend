import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { useNavigation } from '@react-navigation/native';
import MyMedicationCard from '../components/MyMedicationCard';
import { deleteMedication } from '../api/medication/medication';
import HeaderLogo from '../../assets/images/header_logo.svg';

export default function MyPageScreen() {
  const navigation: any = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-primary-50" edges={['top']}>
      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        <View className="flex-row items-center px-4 bg-white h-[60px]">
          <HeaderLogo />
        </View>

        {/* Header Card */}
        <View className="bg-primary-950 w-full">
          <View className="px-4 py-7 flex-row items-center justify-between">
            <View>
              <Text className="h8 text-primary-500">카카오 로그인</Text>
              <Text className="h3 text-white mt-2">홍길동님</Text>
            </View>
            <Icon
              name="settings"
              size={28}
              color="#FFFFFF"
              strokeWidth={2}
              onPress={() => navigation.navigate('Settings')}
            />
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
            onEdit={() => navigation.navigate('Settings')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
