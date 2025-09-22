// src/screens/RegisterScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';
import { registerMedication, type DoseDay } from '../api/medication';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { medicationSchema, type MedicationForm } from '../schemas/medication'; // name/times/caregiverPhone 스키마
import { NameField } from '../components/field/NameField';
import { TimePickField } from 'src/components/field/TimePickField'; // declarations.d.ts에 경로 추가 했으므로 import 가능. 단 절대경로로, 확장자 없이.
import { PhoneField } from '../components/field/PhoneField';
import ToggleSwitch from '../components/ToggleSwitch';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { scheduleWeeklyNotifications } from '../lib/notifications';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MedicationRegister'
>;
type Props = NativeStackScreenProps<RootStackParamList, 'MedicationRegister'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const [selectedDays, setSelectedDays] = useState<string[]>([
    '월',
    '화',
    '수',
    '목',
    '금',
    '월',
    '화',
    '수',
    '목',
    '금',
  ]);
  const [everyDay, setEveryDay] = useState(false);
  const [guardianSms, setGuardianSms] = useState(false);
  const [tenMinuteReminder, setTenMinuteReminder] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleEveryDay = () => {
    setEveryDay((prev) => {
      const next = !prev;
      if (next) {
        setSelectedDays(days); // 켤 때: 모든 요일 선택
      } else {
        setSelectedDays([]); // 끌 때: 모두 해제
      }
      return next;
    });
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { name: '', times: [], caregiverPhone: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 2000,
    shouldFocusError: true,
  });

  // 보호자 스위치 끄면 폰 입력 비우기
  const caregiverPhone = watch('caregiverPhone');
  useEffect(() => {
    if (!guardianSms && caregiverPhone) setValue('caregiverPhone', '');
  }, [guardianSms]);

  // 🔹 추가 유효성: 요일/보호자번호(ON이면 필수)
  const isDayValid = useMemo(() => selectedDays.length > 0, [selectedDays]);
  const isPhoneValid = useMemo(() => {
    if (!guardianSms) return true;
    const digits = (caregiverPhone ?? '').replace(/\D/g, '');
    return /^01[016789]\d{7,8}$/.test(digits);
  }, [guardianSms, caregiverPhone]);

  //  버튼 활성 조건: Zod + 추가 유효성
  const canSubmit = isValid && isDayValid && isPhoneValid;

  const onSubmit = async (form: MedicationForm) => {
    if (!isDayValid) {
      Alert.alert('입력 확인', '요일을 최소 1개 이상 선택해주세요.');
      return;
    }
    if (!isPhoneValid) {
      Alert.alert(
        '입력 확인',
        '보호자 문자 수신이 켜져있으면 전화번호가 필요해요.',
      );
      return;
    }

    // route.params가 없는 경우 체크
    if (!route.params?.imageUri) {
      Alert.alert('오류', '약 이미지가 없습니다. 사진 등록부터 진행해주세요.');
      navigation.navigate('PhotoRegister');
      return;
    }

    const daysToUse = everyDay ? days : selectedDays; // '매일' ON이면 7일 전체

    try {
      // 1) 권한 보장 (iOS/Android 공통)
      const perm = await Notifications.getPermissionsAsync();
      if (perm.status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== 'granted') {
          Alert.alert(
            '알림 권한 필요',
            '알림 권한을 허용해야 예약이 가능합니다.',
          );
          return;
        }
      }

      // 2) 예약 실행
      const ids = await scheduleWeeklyNotifications({
        selectedDays: daysToUse,
        times: form.times, // 예: ['09:00','21:30']
        tenMinutesBefore: tenMinuteReminder,
        drugName: form.name,
      });

      console.log('예약된 알림 IDs:', ids);

      // 3) payload 로그 (필요하다면)
      const payload = {
        name: form.name,
        times: form.times,
        caregiverPhone: guardianSms ? form.caregiverPhone : undefined,
        selectedDays: daysToUse,
        everyDay,
        tenMinuteReminder,
      };
      console.log('등록 payload:', payload);

      // 4) 완료 화면으로 이동
      navigation.replace('RegisterDoneScreen');
    } catch (e: any) {
      console.error(e);
      Alert.alert('알림 예약 실패', e?.message ?? '다시 시도해주세요.');
    }
  };

  const onInvalid = () => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Alert.alert('입력 확인', String(firstError.message));
    } else if (!isDayValid) {
      Alert.alert('입력 확인', '요일을 최소 1개 이상 선택해주세요.');
    } else if (!isPhoneValid) {
      Alert.alert(
        '입력 확인',
        '보호자 문자 수신이 켜져있으면 전화번호가 필요해요.',
      );
    } else {
      Alert.alert('입력 확인', '필수 항목을 확인해 주세요.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView
        className="flex-1 bg-white p-[16px]"
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <View className="mb-[80px] mt-[26px] gap-[10px]">
            <Text className="text-[30px]/[40px] font-bold text-[#333] text-start ">
              처방 받은 약 정보를{'\n'}입력해주세요
            </Text>
          </View>

          <View className="flex-col gap-[30px]">
            {/* 약 이름 */}
            <NameField control={control} />

            {/* 요일 선택 */}
            <View className="mb-7">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[18px] font-semibold text-[#404040]">
                  요일을 선택해주세요
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-[16px] text-[#404040] font-semibold mr-2">
                    매일
                  </Text>
                  <ToggleSwitch
                    value={everyDay}
                    onValueChange={toggleEveryDay}
                  />
                </View>
              </View>

              <View className="flex-row w-full gap-[5.67px]">
                {days.map((day) => {
                  const selected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleDay(day)}
                      className={[
                        'flex-1 justify-center items-center rounded-xl px-3 py-3',
                        selected ? 'bg-[#F1F4FF]' : 'bg-[#F5F5F5]',
                      ].join(' ')}
                    >
                      <Text
                        className={[
                          'text-[20px] font-bold',
                          selected ? 'text-[#597AFF]' : 'text-[#999]',
                        ].join(' ')}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* (선택) 요일 에러 메세지 */}
              {!isDayValid && (
                <Text className="mt-2 text-[#EF4444] text-[14px]">
                  요일을 최소 1개 이상 선택해주세요.
                </Text>
              )}
            </View>

            {/* 시간 선택 (+ 추가 / − 삭제) */}
            <View className="flex-col gap-[8px]">
              <Text className="text-[18px] font-semibold text-[#404040]">
                시간을 선택해주세요
              </Text>
              <TimePickField control={control} />
            </View>

            {/* 보호자 문자 수신 영역 */}
            <View className="flex-col gap-[8px]">
              <View className="flex-row items-center justify-between ">
                <Text className="text-[18px] font-semibold text-[#404040]">
                  보호자 문자 수신(결과 전송)
                </Text>
                <ToggleSwitch
                  value={guardianSms}
                  onValueChange={setGuardianSms}
                />
              </View>

              <PhoneField control={control} />
              {/* (선택) 번호 에러 안내 */}
              {!isPhoneValid && guardianSms && (
                <Text className="mt-1 text-[#EF4444] text-[14px]">
                  올바른 전화번호를 입력해주세요.
                </Text>
              )}
            </View>

            {/* 10분 전 알림 */}
            <ToggleSwitch
              label="10분전 알림"
              value={tenMinuteReminder}
              onValueChange={setTenMinuteReminder}
              description={
                <>
                  지정 시간에 알려드려요, 체크하시면{'\n'}
                  10분전에도 알림을 받아보실 수 있어요
                </>
              }
            />

            {/* 등록 버튼 */}
            <Button
              title="등록하기"
              type="primary"
              size="lg"
              className="mt-2"
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={!canSubmit} //  유효할 때만 활성화
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
