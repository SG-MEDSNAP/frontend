// src/screens/EditMedication.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useMedicationsQuery,
  useUpdateMedicationMutation,
} from '../api/medication';

import { medicationSchema, type MedicationForm } from '../schemas/medication';
import { NameField } from '../components/field/NameField';
import { TimePickField } from 'src/components/field/TimePickField';
import ToggleSwitch from '../components/ToggleSwitch';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DoseDay } from '../api/medication/types';

type EditMedicationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditMedication'
>;
type Props = NativeStackScreenProps<RootStackParamList, 'EditMedication'>;

export default function EditMedicationScreen({ navigation, route }: Props) {
  const medicationId = (route.params as any)?.medicationId as
    | number
    | undefined;

  // 약 목록 조회 후 특정 약 찾기 (500 에러 방지)
  const { data: medications, isLoading, error } = useMedicationsQuery();

  // medicationId로 특정 약 찾기
  const medication = medications?.find((med) => med.id === medicationId);

  const updateMedicationMutation = useUpdateMedicationMutation();

  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [everyDay, setEveryDay] = useState(false);
  const [tenMinuteReminder, setTenMinuteReminder] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { name: '', times: [] },
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 2000,
    shouldFocusError: true,
  });

  // 약 정보 로드 시 폼에 데이터 설정
  useEffect(() => {
    if (medication) {
      setValue('name', medication.name);
      setValue('times', medication.doseTimes);

      // doseDays 처리
      if (medication.doseDays.includes('DAILY')) {
        setEveryDay(true);
        setSelectedDays([]);
      } else {
        setEveryDay(false);
        const koreanDays = medication.doseDays.map((day) => {
          const dayMap: Record<string, string> = {
            MON: '월',
            TUE: '화',
            WED: '수',
            THU: '목',
            FRI: '금',
            SAT: '토',
            SUN: '일',
          };
          return dayMap[day] || day;
        });
        setSelectedDays(koreanDays);
      }

      setTenMinuteReminder(medication.preNotify);
    }
  }, [medication, setValue]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleEveryDay = () => {
    setEveryDay((prev) => {
      const next = !prev;
      // 매일 토글은 selectedDays와 독립적으로 작동
      return next;
    });
  };

  // 🔹 추가 유효성: 요일 (매일이거나 개별 요일 선택)
  const isDayValid = useMemo(
    () => everyDay || selectedDays.length > 0,
    [everyDay, selectedDays],
  );

  //  버튼 활성 조건: Zod + 추가 유효성
  const canSubmit = isValid && isDayValid;

  const onSubmit = async (form: MedicationForm) => {
    if (!isDayValid) {
      Alert.alert('입력 확인', '요일을 최소 1개 이상 선택해주세요.');
      return;
    }

    if (!medicationId) {
      Alert.alert('오류', '약 ID가 없습니다.');
      return;
    }

    try {
      // 매일이면 DAILY, 아니면 선택된 개별 요일들
      const doseDays: DoseDay[] = everyDay
        ? ['DAILY']
        : selectedDays.map((day) => {
            const dayMap: Record<string, DoseDay> = {
              월: 'MON',
              화: 'TUE',
              수: 'WED',
              목: 'THU',
              금: 'FRI',
              토: 'SAT',
              일: 'SUN',
            };
            return dayMap[day] || 'MON';
          });

      const medicationPayload = {
        name: form.name,
        preNotify: tenMinuteReminder,
        doseTimes: form.times,
        doseDays: doseDays,
      };

      console.log('[EDIT] 약 수정 API 호출 시작');
      console.log('[EDIT] 최종 페이로드:', medicationPayload);

      await updateMedicationMutation.mutateAsync({
        medicationId,
        payload: medicationPayload,
        // 이미지는 현재 수정하지 않음 (필요시 추가)
      });

      console.log('[EDIT] 약 수정 API 성공');
      Alert.alert('수정 완료', '약 정보가 수정되었습니다.', [
        { text: '확인', onPress: () => navigation.replace('MainTabs') },
      ]);
    } catch (e: any) {
      console.error('[EDIT] 약 수정 실패:', e);
      Alert.alert('수정 실패', e?.message ?? '다시 시도해주세요.');
    }
  };

  const onInvalid = () => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Alert.alert('입력 확인', String(firstError.message));
    } else if (!isDayValid) {
      Alert.alert('입력 확인', '요일을 최소 1개 이상 선택해주세요.');
    } else {
      Alert.alert('입력 확인', '필수 항목을 확인해 주세요.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">
            약 정보를 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-red-600 text-center">
            약 목록을 불러올 수 없습니다
          </Text>
          <Button
            title="뒤로 가기"
            type="primary"
            size="md"
            className="mt-4"
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!medicationId || !medication) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-red-600 text-center">
            해당 약 정보를 찾을 수 없습니다
          </Text>
          <Button
            title="뒤로 가기"
            type="primary"
            size="md"
            className="mt-4"
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView
        className="flex-1 bg-white p-[16px]"
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <View className="mb-[80px] mt-[26px] gap-[10px]">
            <Text className="text-[30px]/[40px] font-bold text-[#333] text-start ">
              {medication
                ? '약 정보를\n수정해주세요'
                : '약 정보를\n확인해주세요'}
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

            {/* 수정 완료 버튼 */}
            <Button
              title="수정완료"
              type={canSubmit ? 'primary' : 'quaternary'}
              size="lg"
              className="mt-2"
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={!canSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
