import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { useNavigation } from '@react-navigation/native';
import MyMedicationCard from '../components/MyMedicationCard';
import { useUserQuery } from '../api/user';
import { useMedicationsQuery, medicationKeys } from '../api/medication';
import { useQueryClient } from '@tanstack/react-query';
import HeaderLogo from '../../assets/images/header_logo.svg';

export default function MyPageScreen() {
  const navigation: any = useNavigation();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useUserQuery();
  const { data: medications, isLoading: medicationsLoading } =
    useMedicationsQuery();

  // provider를 한글로 변환하는 함수
  const getProviderKoreanName = (provider: string) => {
    switch (provider) {
      case 'KAKAO':
        return '카카오';
      case 'NAVER':
        return '네이버';
      case 'GOOGLE':
        return '구글';
      case 'APPLE':
        return '애플';
      default:
        return provider;
    }
  };

  // doseTimes를 시간 문자열로 변환하는 함수
  const formatDoseTimes = (doseTimes: string[]): string => {
    return doseTimes.join(' | ');
  };

  // doseDays를 요일 문자열로 변환하는 함수
  const formatDoseDays = (doseDays: string[]): string => {
    if (doseDays.includes('DAILY')) {
      return '매일';
    }

    const dayMap: { [key: string]: string } = {
      MON: '월',
      TUE: '화',
      WED: '수',
      THU: '목',
      FRI: '금',
      SAT: '토',
      SUN: '일',
    };

    const koreanDays = doseDays.map((day) => dayMap[day] || day);
    return koreanDays.join(', ');
  };

  // preNotify에 따른 알람 문자열 생성
  const getAlarmText = (preNotify: boolean): string => {
    return preNotify ? '지정 시간 | 10분전' : '지정시간';
  };

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
              {isLoading ? (
                <>
                  <Text className="h8 text-primary-500">로딩 중...</Text>
                  <Text className="h3 text-white mt-2">로딩 중...</Text>
                </>
              ) : error ? (
                <>
                  <Text className="h8 text-primary-500">오류 발생</Text>
                  <Text className="h3 text-white mt-2">
                    사용자 정보를 불러올 수 없습니다
                  </Text>
                </>
              ) : (
                <>
                  <Text className="h8 text-primary-500">
                    {user?.provider
                      ? `${getProviderKoreanName(user.provider)} 로그인`
                      : '로그인'}
                  </Text>
                  <Text className="h3 text-white mt-2">
                    {user?.name ? `${user.name}님` : '사용자'}
                  </Text>
                </>
              )}
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
          {medicationsLoading ? (
            <View className="px-4 py-8">
              <Text className="text-center text-gray-500">
                약 목록을 불러오는 중...
              </Text>
            </View>
          ) : medications && medications.length > 0 ? (
            medications.map((medication) => (
              <MyMedicationCard
                key={medication.id}
                id={medication.id}
                name={medication.name}
                times={formatDoseTimes(medication.doseTimes)}
                days={formatDoseDays(medication.doseDays)}
                alarm={getAlarmText(medication.preNotify)}
                onEdit={() => navigation.navigate('Settings')}
                onDelete={() => {
                  // 삭제는 MyMedicationCard 내부의 mutation에서 처리됨
                }}
              />
            ))
          ) : (
            <View className="px-4 py-8">
              <Text className="text-center text-gray-500">
                등록된 약이 없습니다
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
