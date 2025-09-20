import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { useMedicationStore } from '../store/medicationStore';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { medications } = useMedicationStore();

  const handleRegisterPress = () => {
    // 사진 등록 화면으로 이동
    navigation.navigate('PhotoRegister');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-between">
          {/* 메인 콘텐츠 */}
          <View className="grow mx-4">
            <View className="mt-12">
              <Text className="text-[34px]/[46px] font-bold text-[#404040]">
                고령자를 위한
              </Text>
              <Text className="text-[34px]/[46px] font-bold text-[#404040]">
                복약 알림 서비스
              </Text>
              <Text className="text-[18px]/[18px] mt-[15px] font-normal text-[#404040]">
                처방 받은 약을 등록해보세요
              </Text>
            </View>
            <View className="mt-8 flex-row justify-between items-center">
              <Button
                className="w-[136px]"
                title="약 등록하기"
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
        </View>

        {/* 등록된 약물 목록 */}
        <View className="grow mx-4 mt-8">
          <View className="mb-4">
            <Text className="text-[24px] font-bold text-[#333]">
              등록된 약물
            </Text>
          </View>

          {medications.length === 0 ? (
            <View className="bg-[#F8F9FA] rounded-lg p-4">
              <Text className="text-[16px] text-[#666] text-center">
                등록된 약물이 없습니다
              </Text>
              <Text className="text-[14px] text-[#999] text-center mt-1">
                약을 등록하면 복약 현황을 확인할 수 있어요
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {medications.map((medication) => (
                <View
                  key={medication.id}
                  className="bg-white border border-[#E5E5E5] rounded-lg p-4"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-[18px] font-bold text-[#333] mb-1">
                        {medication.name}
                      </Text>
                      <Text className="text-[14px] text-[#666] mb-2">
                        복용 시간: {medication.doseTimes.join(', ')}
                      </Text>
                      <Text className="text-[12px] text-[#999]">
                        {medication.doseDays.includes('DAILY' as any)
                          ? '매일'
                          : medication.doseDays
                              .map((day) => {
                                const dayMap: Record<string, string> = {
                                  MON: '월',
                                  TUE: '화',
                                  WED: '수',
                                  THU: '목',
                                  FRI: '금',
                                  SAT: '토',
                                  SUN: '일',
                                };
                                return dayMap[day];
                              })
                              .join(', ')}
                      </Text>
                    </View>
                    {medication.imageUrl && (
                      <Image
                        source={{ uri: medication.imageUrl }}
                        className="w-12 h-12 rounded-lg ml-3"
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 하단 여백 */}
          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
