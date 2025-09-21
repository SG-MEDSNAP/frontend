// src/components/field/TimePickField.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from 'react-native';
import { Controller, Control } from 'react-hook-form';
import type { MedicationForm } from '../../schemas/medication';
import { Picker } from '@react-native-picker/picker';
import { to24h, toKoreanTimeLabelFromHHMM, pad2 } from '../../lib/date';
import { InputField } from '../InputField';
import { Icon } from '../Icon';

export function TimePickField({
  control,
}: {
  control: Control<MedicationForm>;
}) {
  const [visible, setVisible] = useState(false);
  const [tempPeriod, setTempPeriod] = useState<'오전' | '오후'>('오전');
  const [tempHour12, setTempHour12] = useState(9);
  const [tempMinute, setTempMinute] = useState(0);
  const [dupMsg, setDupMsg] = useState<string | null>(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const pickerItemStyle = {
    color: isDark ? '#fff' : '#111',
    fontSize: 20 as const,
    /* @ts-ignore */ fontFamily: 'System',
  };

  const periods: Array<'오전' | '오후'> = ['오전', '오후'];
  const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);
  const mins = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Controller
      control={control}
      name="times"
      defaultValue={[]}
      render={({ field: { value = [], onChange }, fieldState: { error } }) => {
        const addTime = () => {
          const hhmm = to24h(tempPeriod, tempHour12, tempMinute);
          if (value.includes(hhmm)) {
            setDupMsg('이미 추가된 시간이에요');
            return;
          }
          onChange([...value, hhmm].sort());
          setDupMsg(null);
          setVisible(false);
        };

        const remove = (t: string) => onChange(value.filter((v) => v !== t));

        return (
          <>
            {/* 추가용 플레이스홀더 행 */}
            <InputField
              type="add"
              onPress={() => {
                setDupMsg(null);
                setVisible(true);
              }}
            >
              <Text className="text-[20px] font-semibold text-[#999999]">
                오전 00:00
              </Text>
            </InputField>

            {/* 추가된 시간 리스트 */}
            {value.map((t) => (
              <InputField key={t}>
                <View className="flex-row items-center">
                  <Text className="flex-1 text-[20px] font-bold text-[#111111]">
                    {toKoreanTimeLabelFromHHMM(t)}
                  </Text>
                  <TouchableOpacity onPress={() => remove(t)} hitSlop={8}>
                    <Icon name="minus" size={24} color="#597AFF" />
                  </TouchableOpacity>
                </View>
              </InputField>
            ))}

            {/* zod 에러 */}
            {error?.message && (
              <Text className="text-[12px] text-[#FF5B6B] mt-1">
                {error.message}
              </Text>
            )}

            {/* 모달: 오전/오후 + 시 + 분 */}
            <Modal
              visible={visible}
              transparent
              presentationStyle="overFullScreen"
              animationType="slide"
              onRequestClose={() => setVisible(false)}
            >
              <View className="flex-1 justify-end">
                <TouchableOpacity
                  className="flex-1 bg-black/40"
                  onPress={() => setVisible(false)}
                />
                <View
                  className="rounded-t-3xl p-4"
                  style={{ backgroundColor: isDark ? '#1C1C1E' : '#fff' }}
                  onStartShouldSetResponder={() => true}
                >
                  <View
                    className="flex-row gap-3 justify-center items-center"
                    style={{ height: 216 }}
                  >
                    <Picker
                      selectedValue={tempPeriod}
                      style={{ width: 110 }}
                      itemStyle={pickerItemStyle}
                      onValueChange={(v: '오전' | '오후') => setTempPeriod(v)}
                    >
                      {periods.map((p) => (
                        <Picker.Item key={p} label={p} value={p} />
                      ))}
                    </Picker>
                    <Picker
                      selectedValue={tempHour12}
                      style={{ width: 110 }}
                      itemStyle={pickerItemStyle}
                      onValueChange={(v: number) => setTempHour12(v)}
                    >
                      {hours12.map((h) => (
                        <Picker.Item key={h} label={pad2(h)} value={h} />
                      ))}
                    </Picker>
                    <Picker
                      selectedValue={tempMinute}
                      style={{ width: 110 }}
                      itemStyle={pickerItemStyle}
                      onValueChange={(v: number) => setTempMinute(v)}
                    >
                      {mins.map((mm) => (
                        <Picker.Item key={mm} label={pad2(mm)} value={mm} />
                      ))}
                    </Picker>
                  </View>

                  {dupMsg && (
                    <Text className="text-center text-[#FF5B6B] mt-2 text-[12px]">
                      {dupMsg}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={addTime}
                    className="my-4 mx-2 h-[56px] rounded-2xl bg-[#597AFF] items-center justify-center"
                  >
                    <Text className="text-white text-[16px] font-semibold">
                      추가하기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        );
      }}
    />
  );
}
