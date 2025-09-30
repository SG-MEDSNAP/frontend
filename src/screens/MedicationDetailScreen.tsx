// src/screens/MedicationDetailScreen.tsx

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';
import { colors } from '@/styles/designSystem';

// API hooks
import { useMedicationRecordsQuery } from '@/api/medication';

// Components
import CustomModal from '@/components/CustomModal';

type MedicationDetailRouteProp = RouteProp<
  RootStackParamList,
  'MedicationDetail'
>;

interface StatusItemProps {
  label: string;
  completed: boolean;
  showViewButton?: boolean;
  onViewPress?: () => void;
}

function StatusItem({
  label,
  completed,
  showViewButton,
  onViewPress,
}: StatusItemProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px]/[26px] font-medium text-[#232323]">
          {label}
        </Text>
        <View className="flex-row items-center gap-3">
          {showViewButton && (
            <TouchableOpacity onPress={onViewPress}>
              <Text className="text-[18px]/[26px] font-medium text-[#232323] underline">
                보기
              </Text>
            </TouchableOpacity>
          )}
          {!label.includes('촬영') && (
            <Text className="text-[18px]/[26px] font-medium text-[#232323]">
              {completed ? '  완료' : '  미완료'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function MedicationDetailScreen() {
  const route = useRoute<MedicationDetailRouteProp>();
  const { date } = route.params;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // 해당 날짜의 복약 기록 조회
  const { data: medicationRecords, isLoading } =
    useMedicationRecordsQuery(date);

  const formatDateHeader = (dateString: string) => {
    const parts = dateString.split('-').map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];
    const dayOfWeek = weekdays[date.getDay()];
    return `${month}월 ${day}일 ${dayOfWeek}`;
  };

  const handleImageView = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F4F7FF]">
        <View className="flex-row items-center px-4 bg-white h-[60px]">
          <HeaderLogo />
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-[16px] text-gray-500">
            복약 상세 정보를 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FF]">
      <View className="flex-1 px-4">
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="h-2 w-2 bg-primary-500 rounded-full"></View>
            <Text className="text-[24px]/[34px] font-bold text-[#232323]">
              {formatDateHeader(date)}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {medicationRecords?.items && medicationRecords.items.length > 0 ? (
            medicationRecords.items.map((item, index) => (
              <View key={item.recordId || index} className="mb-8">
                {/* Medication Name and Time */}

                {/* Status Items */}
                <View className="bg-white rounded-2xl p-6 mb-4">
                  <View className="mb-6 flex-row items-center">
                    {/* <View className="mb-6 flex-row items-center"></View> */}
                    <View className="bg-[#F6F6F6]  w-[92px] h-[30px] rounded-lg items-center justify-center mr-2">
                      <Text className="text-[16px]/[16px] text-[#232323] font-bold">
                        {item.alarmTime}
                      </Text>
                    </View>
                    <View className="flex-col"></View>
                    <View className="flex-row items-center">
                      <Text className="text-[18px] font-bold text-[#333]">
                        {item.medicationName}
                      </Text>
                      <Text
                        className={[
                          'ml-[5px] text-[17px]/[26px] font-bold',
                          item.status === 'TAKEN'
                            ? 'text-[#597AFF]'
                            : 'text-[#FF5C45]',
                        ].join(' ')}
                      >
                        {item.status === 'TAKEN'
                          ? '복용완료'
                          : '복약 알림 대기'}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row">
                    <View className="w-[100px]"></View>
                    <View className="flex-col">
                      <StatusItem
                        label="앱 알림 1차"
                        completed={!!item.firstAlarmAt}
                      />
                      <StatusItem
                        label="앱 알림 2차"
                        completed={!!item.secondAlarmAt}
                      />
                      <StatusItem
                        label={`사진 촬영 ${item.imageUrl ? '완료  ' : '미실행'}`}
                        completed={!!item.imageUrl}
                        showViewButton={!!item.imageUrl}
                        onViewPress={() =>
                          item.imageUrl && handleImageView(item.imageUrl)
                        }
                      />
                      <StatusItem
                        label="보호자 알림"
                        completed={!!item.caregiverNotifiedAt}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-2xl p-6 items-center">
              <Text className="text-[16px] text-[#666] text-center">
                해당 날짜에 등록된 복약 정보가 없습니다.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      {/* Image Modal */}
      <CustomModal
        visible={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        onConfirm={() => setImageModalVisible(false)}
        confirmText="확인"
        disableBackdropClose={false}
        line1="복약 인증 사진"
      >
        {selectedImage && (
          <View className="items-center py-4">
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 256, height: 256 }}
              className="rounded-2xl"
              resizeMode="cover"
            />
          </View>
        )}
      </CustomModal>
    </SafeAreaView>
  );
}
