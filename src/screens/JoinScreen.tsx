import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import ToggleSwitch from '../components/ToggleSwitch';
import { PersonNameField } from '../components/field/PersonNameField';
import { PhoneField } from '../components/field/PhoneField';
import { CalendarField } from '../components/field/CalendarField';
import { signupWithIdToken, loginWithIdToken, Provider } from '../api/auth';

type JoinForm = {
  name: string;
  birth: string;
  phone: string;
  caregiverPhone: string;
  pushAgree: boolean;
};

interface JoinScreenProps {
  route: {
    params: {
      idToken: string;
      provider: Provider;
      nameHint?: string; // 404 응답에서 받은 이름 힌트
    };
  };
  navigation: any;
}

export default function JoinScreen({ route, navigation }: JoinScreenProps) {
  const { idToken, provider, nameHint } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const { control, watch, setValue, formState } = useForm<JoinForm>({
    defaultValues: {
      name: nameHint || '', // nameHint가 있으면 이름 필드에 자동 채우기
      birth: '',
      phone: '',
      // caregiverPhone: '',
      pushAgree: false,
    },
    mode: 'onChange',
  });

  // nameHint가 있으면 이름 필드에 자동 채우기
  useEffect(() => {
    if (nameHint && nameHint.trim() !== '') {
      setValue('name', nameHint.trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
      console.log('[JOIN] nameHint로 이름 필드 채움:', nameHint);
    }
  }, [nameHint, setValue]);

  const name = watch('name');
  const birth = watch('birth');
  const phone = watch('phone');
  //   const caregiverPhone = watch('caregiverPhone');
  const pushAgree = watch('pushAgree');

  const canSubmit = formState.isValid && Boolean(name && birth && phone);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsLoading(true);

    try {
      // birthday 포맷 정규화: 2002.08.19 -> 2002-08-19
      const normalizedBirthday = birth.replace(/\./g, '-');

      // caregiverPhone 정규화: 값 없으면 필드 자체를 생략
      const signupData: any = {
        name,
        idToken,
        provider,
        birthday: normalizedBirthday,
        phone: phone,
        isPushConsent: pushAgree,
      };

      await signupWithIdToken(signupData);

      navigation.replace('MainTabs');
    } catch (e: any) {
      if (e?.response?.status === 409) {
        // 이미 가입됨 → 로그인 재시도
        try {
          const loginResult = await loginWithIdToken({
            idToken,
            provider,
          });
          if (loginResult?.success && loginResult.data) {
            navigation.replace('MainTabs');
            return;
          }
        } catch (loginError) {
          console.error('로그인 재시도 실패:', loginError);
        }
      }

      // 400 등 폼 검증 오류 메시지 표시
      const errorMessage =
        e?.response?.data?.message || '회원가입에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white" edges={['bottom']}>
      <ScrollView
        className="flex-1 "
        contentInsetAdjustmentBehavior="never"
        contentContainerClassName="px-[16px] pb-[32px]"
      >
        <View className="pt-[32px]">
          <Text className="h2 text-[#232323]">
            개인정보를{'\n'}입력해주세요
          </Text>
        </View>

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

        {/* <View className="mt-8">
          <PhoneField
            control={control as any}
            name="caregiverPhone"
            label="보호자 핸드폰 번호(결과 전송)"
            requiredField={false}
          />
        </View> */}

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
          title={isLoading ? '처리 중...' : '완료'}
          type={canSubmit ? 'primary' : 'quaternary'}
          disabled={!canSubmit || isLoading}
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
