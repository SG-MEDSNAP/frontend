import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../App';

// Components
import Button from '../components/Button';
import TodayTimeLine from '../components/TodayTimeLine';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
// 'Home'

interface Props {
  navigation: HomeScreenNavigationProp;
}

interface Medication {
  id: string;
  name: string;
  time: string;
  frequency: string;
  taken: boolean;
}

export default function HomeScreen({ navigation }: Props) {
  // 샘플 데이터
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '혈압약',
      time: '오전 8:00',
      frequency: '매일',
      taken: true,
    },
    {
      id: '2',
      name: '당뇨약',
      time: '오후 1:00',
      frequency: '매일',
      taken: true,
    },
    {
      id: '3',
      name: '비타민',
      time: '오후 6:00',
      frequency: '주 3회',
      taken: false,
    },
  ]);

  // const handleTakeMedication = (id: string) => {
  //   setMedications((prev) =>
  //     prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med)),
  //   );
  // };

  const handleRegisterPress = () => {
    navigation.navigate('PhotoRegister');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* 헤더 */}
      <View className="flex-row items-center px-4 bg-white h-[60px]">
        <HeaderLogo />
      </View>

      {/* 메인  영역 */}
      <View className="flex-col bg-[#F2F4FF]">
        {/* 안내 */}
        {/* 360*937 기준  h-[337px] */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        >
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
          {/* 타임 라인 */}
          <View className="grow mx-4">
            <View className="mb-4">
              <Text className="text-[24px] font-bold text-[#333]">
                타임라인
              </Text>
            </View>
            <TodayTimeLine medications={medications} />
          </View>

          {/* 하단 여백 */}
          {/* <View className="h-6" /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
