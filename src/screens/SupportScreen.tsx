import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, View, Alert, FlatList } from 'react-native';
import { InputField } from '@/components/InputField';
import { Faq, FaqItem } from '@/components/FaqItem';
import Button from '@/components/Button';
import { RootStackParamList } from '../../App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'QnaRegister'>;

export default function SupportScreen({ navigation }: Props) {
  const [faqData, setFaqData] = useState<Faq[]>([
    {
      id: 1,
      category: '복약 현황',
      question: '복약 현황의 상세 내용을 수정할 수 있나요?',
      answer: '현재 수정은 불가하며, 내용 삭제는 가능합니다.',
    },
    {
      id: 2,
      category: '알림',
      question: '알림 횟수를 설정할 수 있나요?',
      answer:
        '네, 설정 가능합니다. [마이페이지]에서 수정하여 알림 횟수를 변경할 수 있습니다.',
    },
    {
      id: 3,
      category: '타임라인',
      question: '사진을 찍지 않고도 복약상태를 설정할 수 있나요?',
      answer:
        '타임라인에서 직접 "복용 완료" 또는 "건너뛰기" 버튼을 눌러 상태를 변경할 수 있습니다.',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      Alert.alert('알림', '검색어를 입력해주세요.'); // 테스트용
      return;
    }
    Alert.alert('검색 실행', `검색어: ${searchQuery}`); // 테스트용
  };

  const handleToggleFaq = (id: number) => {
    // 이미 열려있는 항목을 다시 누르면 닫고, 다른 항목을 누르면 기존에 열린 항목을 닫고 다시 열기
    setOpenFaqId((prevId) => (prevId === id ? null : id));
  };

  const handleRegisterPress = () => {
    navigation.navigate('QnaRegister');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
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
              onSubmitEditing={handleSearch}
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
        <FlatList
          className="flex-col bg-white" // 남은 공간을 모두 차지하도록 flex-1 추가
          data={faqData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FaqItem
              item={item}
              isOpen={item.id === openFaqId}
              onPress={() => handleToggleFaq(item.id)}
            />
          )}
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
      </View>
    </SafeAreaView>
  );
}
