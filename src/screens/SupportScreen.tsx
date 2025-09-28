import { useMemo, useState } from 'react';
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
import { RootStackParamList, BottomTabParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFaqsQuery } from '@/api/faq';
import type { FaqData } from '@/api/faq';
import axios from 'axios';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';
import { API_BASE_URL } from '@env';

type Props = BottomTabScreenProps<BottomTabParamList, 'Support'>;

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

  // FAQ 데이터를 API에서 가져오기
  const { data: faqData, isLoading, isError, error } = useFaqsQuery();

  const fetchFaqsTest = async () => {
    console.log('테스트');
    try {
      const res = await axios.get(`${API_BASE_URL}/v1/faqs`);
      console.log('테스트용 FAQ API 응답 성공:', res.data);
      return res.data;
    } catch (error) {
      console.error('FAQ API 호출 실패:', error);
      throw error;
    }
  };

  console.log('SupportScreen 상태:', {
    isLoading,
    isError,
    hasData: !!faqData,
    dataLength: faqData?.length,
    error: error?.message,
  });

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
    navigation.navigate('QnaRegister');
  };

  return (
    // 4. TouchableOpacity로 전체 화면을 감싸 키보드 외 영역 터치 시 키보드가 내려가도록 합니다.
    <TouchableOpacity
      activeOpacity={1}
      onPress={Keyboard.dismiss}
      className="flex-1"
      accessible={false}
    >
      <SafeAreaView className="flex-1 bg-[#F8F9FA]">
        <View className="flex-row items-center px-4 bg-white h-[60px]">
          <HeaderLogo />
        </View>
        <Button title="FAQ 테스트" onPress={fetchFaqsTest} />
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
              // 리스트의 맨 아래에 "Q&A 등록하기" 버튼 구현
              ListFooterComponent={
                <View className="m-4">
                  <Button
                    title="Q&A 등록하기"
                    type="primary"
                    size="lg"
                    onPress={handleRegisterPress}
                  />
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </TouchableOpacity>
  );
}
