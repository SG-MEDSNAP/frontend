import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import TodaySchedule from '../components/TodaySchedule';
import QuickActions from '../components/QuickActions';

type MainScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

interface Props {
  navigation: MainScreenNavigationProp;
}

interface Medication {
  id: string;
  name: string;
  time: string;
  frequency: string;
  taken: boolean;
}

export default function MainScreen({ navigation }: Props) {
  // 샘플 데이터
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '혈압약',
      time: '오전 8:00',
      frequency: '매일',
      taken: false,
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

  const handleTakeMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med)),
    );
  };

  const handleRegisterPress = () => {
    navigation.navigate('MedicationRegister');
  };

  const handleHistoryPress = () => {
    // TODO: 복용 기록 화면으로 이동
    console.log('복용 기록 화면으로 이동');
  };

  const handleReportPress = () => {
    // TODO: 리포트 화면으로 이동
    console.log('리포트 화면으로 이동');
  };

  const handleSettingsPress = () => {
    // TODO: 설정 화면으로 이동
    console.log('설정 화면으로 이동');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View className="bg-white px-5 pt-4 pb-6">
          <Text className="text-[28px] font-bold text-[#333] mb-2">
            MEDSNAP
          </Text>
          <Text className="text-[16px] text-[#666]">
            안녕하세요! 오늘도 건강한 하루 보내세요 ✨
          </Text>
        </View>

        {/* 메인 콘텐츠 */}
        <View className="px-5 pt-6">
          <TodaySchedule
            medications={medications}
            onTakeMedication={handleTakeMedication}
          />

          <QuickActions
            onRegisterPress={handleRegisterPress}
            onHistoryPress={handleHistoryPress}
            onReportPress={handleReportPress}
            onSettingsPress={handleSettingsPress}
          />

          {/* 하단 여백 */}
          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
