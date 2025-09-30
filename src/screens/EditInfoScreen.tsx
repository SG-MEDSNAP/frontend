import React, { useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useUserQuery, useUpdateMyPageMutation } from '../api/user';
import Button from '../components/Button';
import ToggleSwitch from '../components/ToggleSwitch';
import { PersonNameField } from '../components/field/PersonNameField';
import { PhoneField } from '../components/field/PhoneField';
import { CalendarField } from '../components/field/CalendarField';

type EditForm = {
  name: string;
  birth: string;
  phone: string;
  pushAgree: boolean;
};

export default function EditInfoScreen() {
  const navigation: any = useNavigation();
  // 사용자 정보 조회 활성화 (새로운 응답 구조로 재활성화)
  const { data: user, isLoading, error } = useUserQuery();
  const updateMyPageMutation = useUpdateMyPageMutation();

  const { control, watch, setValue, formState } = useForm<EditForm>({
    defaultValues: {
      name: '',
      birth: '',
      phone: '',
      pushAgree: true,
    },
    mode: 'onChange',
  });

  // 사용자 정보 로드 시 폼에 데이터 설정
  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('birth', user.birthday);
      setValue('phone', user.phone);
      setValue('pushAgree', user.isPushConsent);
    }
  }, [user, setValue]);

  const name = watch('name');
  const birth = watch('birth');
  const phone = watch('phone');
  const pushAgree = watch('pushAgree');

  const canSubmit = formState.isValid && Boolean(name && birth && phone);

  const handleSubmit = async () => {
    try {
      const formData = {
        name: name,
        birthday: birth, // 이미 - 형식으로 입력받음
        phone: phone,
        isPushConsent: pushAgree,
      };

      console.log('[EDIT_INFO] 마이페이지 수정 요청:', formData);

      await updateMyPageMutation.mutateAsync(formData);

      console.log('[EDIT_INFO] 마이페이지 수정 성공');
      Alert.alert('수정 완료', '개인정보가 수정되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      console.error('[EDIT_INFO] 마이페이지 수정 실패:', e);
      Alert.alert('수정 실패', e?.message ?? '다시 시도해주세요.');
    }
  };

  // 로딩 및 에러 처리
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white" edges={['bottom']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">
            사용자 정보를 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white" edges={['bottom']}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-red-600 text-center">
            사용자 정보를 불러올 수 없습니다
          </Text>
          <Button
            title="다시 시도"
            type="primary"
            size="md"
            className="mt-4"
            onPress={() => {
              // React Native에서는 페이지 새로고침 대신 다른 방법 사용
              // 예: navigation.goBack() 또는 queryClient.invalidateQueries()
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white" edges={['bottom']}>
      <ScrollView
        className="flex-1 "
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-[16px] pb-[32px]"
      >
        <View className="mt-8">
          <PersonNameField control={control as any} />
        </View>

        <View className="mt-8">
          <CalendarField control={control as any} label="생년월일" />
        </View>

        <View className="mt-8">
          <PhoneField
            control={control as any}
            name="phone"
            label="핸드폰 번호"
          />
        </View>

        {/* 보호자 번호 필드 제거 - API 스펙에 없음 */}

        <View className="mt-8">
          <ToggleSwitch
            label="앱 알림 동의"
            value={pushAgree}
            onValueChange={(v) =>
              setValue('pushAgree', v, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            description="(설명 문구 필요)"
          />
        </View>
      </ScrollView>

      <View className="px-4 pb-4">
        <Button
          title="수정완료"
          type={canSubmit ? 'primary' : 'quaternary'}
          onPress={handleSubmit}
          disabled={!canSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
