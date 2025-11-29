import { useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  TextInput,
  View,
  Alert,
  FlatList,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { InputField } from '@/components/InputField';
import { Faq, FaqItem } from '@/components/FaqItem';
import Button from '@/components/Button';
import CustomModal from '@/components/CustomModal';
import { RootStackParamList, BottomTabParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  useFaqsQuery,
  useDeleteFaqMutation,
  useUpdateFaqMutation,
} from '@/api/faq';
import type { FaqData } from '@/api/faq';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { isAdmin } from '@/api/auth/apis';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';

type Props = BottomTabScreenProps<BottomTabParamList, 'Support'> & {
  navigation: any; // RootStackParamList의 모든 화면에 접근 가능하도록
};

// 카테고리 매핑 함수
const mapCategoryToKorean = (category: string): string => {
  switch (category) {
    case 'MEDICATION_STATUS':
      return '복약 현황';
    case 'NOTIFICATION':
      return '알림';
    case 'TIMELINE':
      return '타임라인';
    default:
      return category;
  }
};

// API 데이터를 FaqItem 컴포넌트가 기대하는 형태로 변환
const transformFaqData = (data: FaqData): Faq => ({
  id: data.id,
  category: mapCategoryToKorean(data.category),
  question: data.question,
  answer: data.answer,
});

export default function SupportScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Admin 권한 체크
  useEffect(() => {
    const checkAdminPermission = async () => {
      try {
        const adminStatus = await isAdmin();
        setUserIsAdmin(adminStatus);
      } catch (error) {
        console.error('Admin 권한 체크 실패:', error);
        setUserIsAdmin(false);
      }
    };

    checkAdminPermission();
  }, []);

  // FAQ 데이터를 API에서 가져오기
  const { data: faqData, isLoading, isError, error } = useFaqsQuery();
  const deleteFaqMutation = useDeleteFaqMutation();
  const updateFaqMutation = useUpdateFaqMutation();

  const filteredFaqData = useMemo(() => {
    // API 데이터가 없으면 빈 배열 반환
    if (!faqData) {
      return [];
    }

    // API 데이터를 FaqItem 컴포넌트가 기대하는 형태로 변환
    const transformedData = faqData.map(transformFaqData);

    // 검색어가 비어있으면 전체 목록 반환
    if (!searchQuery.trim()) {
      return transformedData;
    }

    // 검색어를 소문자로 변환하여 대소문자 구분 없이 검색
    const lowercasedQuery = searchQuery.toLowerCase();

    // 변환된 데이터 필터링
    return transformedData.filter(
      (item) =>
        item.question.toLowerCase().includes(lowercasedQuery) ||
        item.category.toLowerCase().includes(lowercasedQuery) ||
        item.answer.toLowerCase().includes(lowercasedQuery),
    );
  }, [faqData, searchQuery]); // faqData와 searchQuery가 변경될 때만 위 로직 다시 실행

  const handleToggleFaq = (id: number) => {
    // 이미 열려있는 항목을 다시 누르면 닫고, 다른 항목을 누르면 기존에 열린 항목을 닫고 다시 열기
    setOpenFaqId((prevId) => (prevId === id ? null : id));
  };

  const handleRegisterPress = () => {
    navigation.navigate('FaqRegister');
  };

  const handleEditFaq = (faqId: number) => {
    // 현재 FAQ 데이터 찾기
    const faqToEdit = faqData?.find((faq) => faq.id === faqId);
    if (!faqToEdit) {
      Alert.alert('오류', '수정할 FAQ를 찾을 수 없습니다.');
      return;
    }

    // FaqRegister 화면으로 이동하면서 기존 데이터 전달
    navigation.navigate('FaqRegister', {
      faqData: faqToEdit, // 수정할 FAQ 데이터 전달
      isEdit: true, // 수정 모드임을 표시
    });
  };

  const handleDeleteFaq = (faqId: number) => {
    setFaqToDelete(faqId);
    setDeleteModalVisible(true);
  };

  const confirmDeleteFaq = async () => {
    if (faqToDelete) {
      try {
        await deleteFaqMutation.mutateAsync(faqToDelete);
        Alert.alert('삭제 완료', 'FAQ가 삭제되었습니다.');
      } catch (error) {
        console.error('FAQ 삭제 실패:', error);
        Alert.alert('삭제 실패', 'FAQ 삭제 중 오류가 발생했습니다.');
      } finally {
        setDeleteModalVisible(false);
        setFaqToDelete(null);
      }
    }
  };

  return (
    // 4. TouchableOpacity로 전체 화면을 감싸 키보드 외 영역 터치 시 키보드가 내려가도록 합니다.
    <TouchableOpacity
      activeOpacity={1}
      onPress={Keyboard.dismiss}
      className="flex-1"
      accessible={false}
    >
      <SafeAreaView className="flex-1 bg-[#F8F9FA] " edges={['top']}>
        <View className="flex-row items-center px-4 bg-white h-[60px]">
          <HeaderLogo />
        </View>
        <View className="flex-col justify-between h-[14rem] bg-[#F2F4FF]">
          <Text className="mt-10 text-center text-[#232323] text-[24px]/[34px] font-bold">
            MEDSNAP에 관한 {'\n'} 궁금하신 사항을 확인하세요
          </Text>
          <View className="mx-4 mb-3">
            <InputField type="search">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                keyboardType="default"
                placeholder="검색어 입력"
                returnKeyType="search" // 키보드의 완료 버튼을 '검색'으로 변경
                className="text-[20px] font-semibold text-[#232323]"
                placeholderTextColor="#888888"
                maxLength={40}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </InputField>
          </View>
        </View>
        <View className="flex-1">
          {isLoading ? (
            <View className="flex-1 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#597AFF" />
              <Text className="mt-4 text-[16px] text-gray-500">
                FAQ를 불러오는 중...
              </Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center bg-white">
              <Text className="text-[18px] text-red-500 mb-4">
                FAQ를 불러오는데 실패했습니다.
              </Text>
              <Text className="text-[14px] text-gray-500 text-center px-4">
                네트워크 연결을 확인하고 다시 시도해주세요.
              </Text>
            </View>
          ) : (
            <FlatList
              className="flex-col bg-white" // 남은 공간을 모두 차지하도록 flex-1 추가
              data={filteredFaqData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <FaqItem
                  item={item}
                  isOpen={item.id === openFaqId}
                  onPress={() => handleToggleFaq(item.id)}
                  showActions={userIsAdmin}
                  onEdit={() => handleEditFaq(item.id)}
                  onDelete={() => handleDeleteFaq(item.id)}
                />
              )}
              // 검색 결과가 없을 때 보여줄 컴포넌트
              ListEmptyComponent={
                <View className="items-center justify-center pt-20">
                  <Text className="text-[20px] text-gray-500 mb-8">
                    {searchQuery.trim()
                      ? '검색 결과가 없습니다.'
                      : 'FAQ가 없습니다.'}
                  </Text>
                </View>
              }
              // 리스트의 맨 아래에 "Q&A 등록하기" 버튼 구현 (Admin만 표시)
              ListFooterComponent={
                userIsAdmin ? (
                  <View className="m-4">
                    <Button
                      title="Q&A 등록하기"
                      type="primary"
                      size="lg"
                      onPress={handleRegisterPress}
                    />
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {/* FAQ 삭제 확인 모달 */}
        <CustomModal
          visible={deleteModalVisible}
          line1="정말로,"
          line2="삭제하시겠습니까?"
          confirmText="확인"
          onConfirm={confirmDeleteFaq}
          cancelText="닫기"
          onCancel={() => {
            setDeleteModalVisible(false);
            setFaqToDelete(null);
          }}
        />
      </SafeAreaView>
    </TouchableOpacity>
  );
}
