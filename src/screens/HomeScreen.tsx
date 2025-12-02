import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';

import { RootStackParamList } from '../../App';

// Components
import Button from '../components/Button';
import TodayTimeLine from '../components/TodayTimeLine';

// API
import { useMedicationRecordsQuery } from '../api/medication/queries';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';

// [App Store Guideline 4.5.4]
// 푸시 알림 권한은 앱 실행 시 자동 요청하지 않음
// 사용자가 복약 리마인더를 활성화할 때만 요청함

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  // 오늘 날짜 포맷팅
  const today = format(new Date(), 'yyyy-MM-dd');

  // 약물 복용 기록 조회 (오늘 날짜)
  const { data, isLoading, error } = useMedicationRecordsQuery(today);

  // const handleTakeMedication = (id: string) => {
  //   setMedications((prev) =>
  //     prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med)),
  //   );
  // };

  const handleRegisterPress = () => {
    navigation.navigate('PhotoRegister');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6 bg-[#F2F4FF]"
      >
        {/* 헤더 */}
        <View className="flex-row items-center px-4 bg-white h-[60px]">
          <HeaderLogo />
        </View>

        {/* 메인 영역 */}
        <View className="flex-col bg-[#F2F4FF]">
          {/* 안내 섹션 */}
          <View className="grow mx-4">
            <View className="mt-12">
              <Text className="text-[34px]/[46px] font-bold text-[#404040]">
                고령자를 위한
              </Text>
              <Text className="text-[34px]/[46px] font-bold text-[#404040]">
                복약 알림 서비스
              </Text>
              <Text className="text-[18px] mt-[15px] font-normal text-[#404040]">
                처방 받은 약을 등록해보세요
              </Text>
            </View>
            <View className="mt-4 flex-row justify-between items-center">
              <Button
                className="w-[136px]"
                title="약 등록하기"
                type="primary"
                size="sm"
                onPress={handleRegisterPress}
              />
              <Image
                className="w-[150px] h-[140px]"
                source={require('../../assets/images/medication.png')}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* 타임라인 섹션 */}
          <View className="grow mx-4">
            <View className="mb-4">
              <Text className="text-[24px] font-bold text-[#333]">
                타임라인
              </Text>
            </View>
            {isLoading ? (
              <View className="p-4 items-center">
                <Text>데이터를 불러오는 중입니다...</Text>
              </View>
            ) : error ? (
              <View className="p-4 items-center">
                <Text>데이터를 불러오는데 실패했습니다.</Text>
              </View>
            ) : (
              <TodayTimeLine medications={data?.items || []} />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
