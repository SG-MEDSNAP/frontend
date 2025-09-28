// FaqRegisterScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, Text, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useRegisterFaqMutation } from '@/api/faq';
import type { FaqRegisterRequest, FaqCategory } from '@/api/faq';
import Button from '@/components/Button';
import { InputField } from '@/components/InputField';
import { TextInput } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'FaqRegister'>;

interface FaqForm {
  question: string;
  answer: string;
  category: FaqCategory;
}

const CATEGORY_OPTIONS: { label: string; value: FaqCategory }[] = [
  { label: '복약 현황', value: 'MEDICATION_STATUS' },
  { label: '알림', value: 'NOTIFICATION' },
  { label: '타임라인', value: 'TIMELINE' },
];

export default function FaqRegisterScreen({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] =
    useState<FaqCategory>('MEDICATION_STATUS');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FaqForm>({
    defaultValues: {
      question: '',
      answer: '',
      category: 'MEDICATION_STATUS',
    },
    mode: 'onChange',
  });

  const registerFaqMutation = useRegisterFaqMutation();

  const onSubmit = async (data: FaqForm) => {
    if (!data.question.trim()) {
      Alert.alert('입력 확인', '질문을 입력해주세요.');
      return;
    }

    if (!data.answer.trim()) {
      Alert.alert('입력 확인', '답변을 입력해주세요.');
      return;
    }

    const requestData: FaqRegisterRequest = {
      question: data.question.trim(),
      answer: data.answer.trim(),
      category: selectedCategory,
    };

    try {
      await registerFaqMutation.mutateAsync(requestData);
      Alert.alert('등록 완료', 'Q&A가 성공적으로 등록되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('등록 실패', 'Q&A 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {/* 카테고리 선택 */}
          <View className="mb-6">
            <Text className="text-[16px] font-semibold text-[#232323] mb-3">
              카테고리 선택
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  title={option.label}
                  type={
                    selectedCategory === option.value ? 'primary' : 'secondary'
                  }
                  size="sm"
                  onPress={() => setSelectedCategory(option.value)}
                />
              ))}
            </View>
          </View>

          {/* 질문 입력 */}
          <View className="mb-6">
            <Text className="h7 text-[#232323] mb-3">질문</Text>
            <Controller
              control={control}
              name="question"
              rules={{
                required: '질문을 입력해주세요.',
                minLength: {
                  value: 5,
                  message: '질문은 5자 이상 입력해주세요.',
                },
                maxLength: {
                  value: 100,
                  message: '질문은 100자 이하로 입력해주세요.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField type="default">
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="질문 입력"
                    multiline
                    numberOfLines={3}
                    className="text-[20px]/[30px] font-semibold text-[#232323] min-h-[80px]"
                    placeholderTextColor="#888888"
                    maxLength={100}
                  />
                </InputField>
              )}
            />
            {errors.question && (
              <Text className="text-[14px] text-red-500 mt-1">
                {errors.question.message}
              </Text>
            )}
          </View>

          {/* 답변 입력 */}
          <View className="mb-6">
            <Text className="h7 text-[#232323] mb-3">답변</Text>
            <Controller
              control={control}
              name="answer"
              rules={{
                required: '답변을 입력해주세요.',
                minLength: {
                  value: 10,
                  message: '답변은 10자 이상 입력해주세요.',
                },
                maxLength: {
                  value: 500,
                  message: '답변은 500자 이하로 입력해주세요.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField type="default">
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="답변 입력"
                    multiline
                    numberOfLines={5}
                    className="text-[20px]/[30px] font-semibold text-[#232323] min-h-[120px]"
                    placeholderTextColor="#888888"
                    maxLength={500}
                  />
                </InputField>
              )}
            />
            {errors.answer && (
              <Text className="text-[14px] text-red-500 mt-1">
                {errors.answer.message}
              </Text>
            )}
          </View>

          {/* 등록 버튼 */}
          <Button
            title={registerFaqMutation.isPending ? '등록 중...' : '등록하기'}
            type="primary"
            size="lg"
            onPress={handleSubmit(onSubmit)}
            disabled={registerFaqMutation.isPending || !isValid}
          />

          {registerFaqMutation.isPending && (
            <View className="items-center mt-4">
              <ActivityIndicator size="small" color="#597AFF" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
