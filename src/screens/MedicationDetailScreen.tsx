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
import {
  useMedicationRecordsQuery,
  useDeleteMedicationAlarmsMutation,
} from '@/api/medication';

// Components
import CustomModal from '@/components/CustomModal';
import MedicationDetailCard from '@/components/MedicationDetailCard';

type MedicationDetailRouteProp = RouteProp<
  RootStackParamList,
  'MedicationDetail'
>;

export default function MedicationDetailScreen() {
  const route = useRoute<MedicationDetailRouteProp>();
  const { date } = route.params;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // 선택 관련 상태
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<number>>(
    new Set(),
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // API hooks
  const { data: medicationRecords, isLoading } =
    useMedicationRecordsQuery(date);
  const deleteAlarmsMutation = useDeleteMedicationAlarmsMutation();

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

  // 선택 토글 핸들러
  const handleSelectionToggle = (recordId?: number) => {
    if (!recordId) return;

    const newSelected = new Set(selectedRecordIds);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecordIds(newSelected);
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (selectedRecordIds.size === 0) return;
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    // 선택된 recordId들을 alarmId로 사용 (실제로는 서버 스펙에 맞게 조정 필요)
    const alarmIds = Array.from(selectedRecordIds);

    // 첫 번째 약물의 medicationId를 사용 (실제로는 각각 다를 수 있음)
    const firstMedicationId = medicationRecords?.items?.[0]?.medicationId;

    if (firstMedicationId) {
      deleteAlarmsMutation.mutate(
        { medicationId: firstMedicationId, alarmIds },
        {
          onSuccess: () => {
            setDeleteModalVisible(false);
            setSelectedRecordIds(new Set()); // 선택 초기화
            console.log('알림 삭제 성공');
          },
          onError: (error) => {
            console.error('알림 삭제 실패:', error);
            setDeleteModalVisible(false);
          },
        },
      );
    }
  };

  const isSelectionMode = selectedRecordIds.size > 0;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F4F7FF]">
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
        {/* Date Header */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 bg-primary-500 rounded-full"></View>
              <Text className="text-[24px]/[34px] font-bold text-[#232323]">
                {formatDateHeader(date)}
              </Text>
            </View>

            {/* Delete Button */}
            {isSelectionMode && (
              <TouchableOpacity
                onPress={handleDelete}
                disabled={deleteAlarmsMutation.isPending}
              >
                <Text className="text-[18px]/[26px] font-bold text-[#232323]">
                  {deleteAlarmsMutation.isPending ? '삭제 중...' : '삭제'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {medicationRecords?.items && medicationRecords.items.length > 0 ? (
            medicationRecords.items.map((item, index) => (
              <MedicationDetailCard
                key={item.recordId || index}
                recordId={item.recordId}
                medicationName={item.medicationName}
                alarmTime={item.alarmTime}
                status={item.status}
                imageUrl={item.imageUrl}
                firstAlarmAt={item.firstAlarmAt}
                secondAlarmAt={item.secondAlarmAt}
                caregiverNotifiedAt={item.caregiverNotifiedAt}
                checkedAt={item.checkedAt}
                isSelectionMode={isSelectionMode}
                isSelected={
                  item.recordId ? selectedRecordIds.has(item.recordId) : false
                }
                onSelectionToggle={() => handleSelectionToggle(item.recordId)}
                onImageView={handleImageView}
              />
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

      {/* Delete Confirmation Modal */}
      <CustomModal
        visible={deleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmText="삭제"
        cancelText="취소"
        disableBackdropClose={false}
        line1="선택한 알림을"
        line2="삭제하시겠습니까?"
      />
    </SafeAreaView>
  );
}
