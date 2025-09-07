// RegisterScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { medicationSchema, type MedicationForm } from '../schemas/medication'; // name/times/caregiverPhone 스키마
import { NameField } from '../components/field/NameField';
import { TimePickField } from '../components/field/TimePickField';
import { PhoneField } from '../components/field/PhoneField';
import ToggleSwitch from '../components/ToggleSwitch';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MedicationRegister'
>;
interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const [selectedDays, setSelectedDays] = useState<string[]>([
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
        // 켤 때: 모든 요일 선택
        setSelectedDays(days);
      } else {
        // 끌 때: 선택된 요일 초기화
        setSelectedDays([]);
      }
      return next;
    });
  };

  // ✅ RHF: onChange 검증 + 에러 표시 지연
  const { control, handleSubmit, setValue, watch } = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { name: '', times: [], caregiverPhone: '' },
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 2000,
  });

  // 보호자 스위치 끄면 폰 입력 비우기
  const caregiverPhone = watch('caregiverPhone');
  useEffect(() => {
    if (!guardianSms && caregiverPhone) setValue('caregiverPhone', '');
  }, [guardianSms]);

  // 제출: RHF 데이터 + 로컬 상태(요일/토글) 취합
  const onSubmit = (form: MedicationForm) => {
    const payload = {
      name: form.name,
      times: form.times, // ['09:00','21:30']
      caregiverPhone: guardianSms ? form.caregiverPhone : undefined,
      selectedDays,
      everyDay,
      tenMinuteReminder,
    };
    console.log('등록 payload:', payload);
    // TODO: API 호출 or 로컬 저장
    // 성공 후 navigation.goBack() 등
  };

  return (
    <ScrollView className="flex-1 bg-white p-[16px] ">
      <View>
        <View className="mb-[80px] mt-[26px] gap-[10px]">
          <Text className="text-[30px] font-bold text-[#333] text-start ">
            처방 받은 약 정보를
          </Text>
          <Text className="text-[30px] font-bold text-[#333] text-start ">
            입력해주세요
          </Text>
        </View>

        {/* 약 이름 */}
        <NameField control={control} />

        {/* 요일 선택 */}
        <View className="mb-7">
          {/* 헤더: 왼쪽 라벨, 오른쪽 '매일'+토글 */}
  <View className="flex-row items-center justify-between mb-4">
    <Text className="text-[18px] font-semibold text-[#404040]">
      요일을 선택해주세요
    </Text>
    <View className="flex-row items-center">
      <Text className="text-[16px] text-[#404040] font-semibold mr-2">매일</Text>
      {/* 라벨 없이 스위치만 사용 */}
      <ToggleSwitch
        value={everyDay}
        onValueChange={toggleEveryDay}
      />
    </View>
  </View>

          {/* 요일 칩들 */}
          <View className="flex-row w-full gap-[6px]">
            {days.map((day) => {
              const selected = selectedDays.includes(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  className={[
                    ' py-3 rounded-lg items-center h-[42px] flex-1',
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
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 시간 선택 (+ 추가 / − 삭제) */}
        <TimePickField control={control} />

        {/* 보호자 문자 수신 */}
        <ToggleSwitch
          label="보호자 문자 수신(결과 전송)"
          value={guardianSms}
          onValueChange={setGuardianSms}
          description={undefined}
        />
        {guardianSms && <PhoneField control={control} />}

        {/* 10분 전 알림 */}
        <ToggleSwitch
          label="10분전 알림"
          value={tenMinuteReminder}
          onValueChange={setTenMinuteReminder}
          description="지정 시간에 알려드려요. 켜두면 10분 전에도 알림을 받아요."
        />

        {/* 등록 버튼 */}
        <Button
          title="등록하기"
          type="primary"
          size="lg"
          className="mt-2"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScrollView>
  );
}
