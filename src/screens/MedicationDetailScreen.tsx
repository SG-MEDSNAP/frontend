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

interface MedicationItemProps {
  recordId?: number;
  medicationName: string;
  alarmTime: string;
  status: string;
  imageUrl?: string;
  firstAlarmAt?: string;
  secondAlarmAt?: string;
  caregiverNotifiedAt?: string;
  checkedAt?: string;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelectionToggle: () => void;
  onImageView: (imageUrl: string) => void;
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
          <Text className="text-[16px]/[22px] font-medium text-[#597AFF]">
            {completed ? '완료' : '미완료'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function MedicationItem({
  recordId,
  medicationName,
  alarmTime,
  status,
  imageUrl,
  firstAlarmAt,
  secondAlarmAt,
  caregiverNotifiedAt,
  isSelectionMode,
  isSelected,
  onSelectionToggle,
  onImageView,
}: MedicationItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TAKEN':
        return '#597AFF'; // 복약 완료
      case 'PENDING':
        return '#597AFF'; // 복약 완료 (파란색)
      case 'SKIPPED':
        return '#FF4444'; // 복약 미 실행 (빨간색)
      default:
        return '#666666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'TAKEN':
        return '복약 완료';
      case 'PENDING':
        return '복약 완료';
      case 'SKIPPED':
        return '복약 미 실행';
      default:
        return status;
    }
  };

  return (
    <View className="mb-8">
      {/* Header with selection */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1">
          <Text className="text-[20px]/[28px] font-bold text-[#232323] mb-1">
            {medicationName}
          </Text>
          <Text className="text-[16px]/[16px] text-[#232323] font-bold">
            {alarmTime}
          </Text>
          <Text
            className="text-[16px]/[22px] font-medium mt-1"
            style={{ color: getStatusColor(status) }}
          >
            {getStatusText(status)}
          </Text>
        </View>

        {/* Selection Circle */}
        <TouchableOpacity
          onPress={onSelectionToggle}
          className="w-8 h-8 rounded-full border-2 border-gray-300 items-center justify-center"
          style={{
            backgroundColor: isSelected ? colors.primary[500] : 'white',
            borderColor: isSelected ? colors.primary[500] : '#D1D5DB',
          }}
        >
          {isSelected && (
            <Text className="text-white text-sm font-bold">✓</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Status Items */}
      <View className="bg-white rounded-2xl p-6">
        <StatusItem label="앱 알림 1차" completed={!!firstAlarmAt} />
        <StatusItem label="앱 알림 2차" completed={!!secondAlarmAt} />
        <StatusItem
          label="사진 촬영"
          completed={!!imageUrl}
          showViewButton={!!imageUrl}
          onViewPress={() => imageUrl && onImageView(imageUrl)}
        />
        <StatusItem label="보호자 알림" completed={!!caregiverNotifiedAt} />
      </View>
    </View>
  );
}

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
              <MedicationItem
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
