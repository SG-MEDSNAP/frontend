// src/components/field/TimePickField.android.tsx
import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  useColorScheme,
} from 'react-native';
import { Controller, Control } from 'react-hook-form';
import type { MedicationForm } from '../../schemas/medication';
import Picker from 'react-native-wheel-picker-expo';
import WheelPicker from 'react-native-wheely';
import { to24h, toKoreanTimeLabelFromHHMM, pad2 } from '../../lib/date';

export function TimePickField({
  control,
}: {
  control: Control<MedicationForm>;
}) {
  const [visible, setVisible] = useState(false);

  const [periodIndex, setPeriodIndex] = useState(0); // '오전'
  const [hourIndex, setHourIndex] = useState(8); // '09'시 (인덱스는 0부터 시작)
  const [minuteIndex, setMinuteIndex] = useState(0); // '00'분

  const [dupMsg, setDupMsg] = useState<string | null>(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const periodOptions = useMemo(() => ['오전', '오후'], []);
  const hourOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => pad2(i + 1)),
    [],
  );
  const minuteOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => pad2(i * 5)),
    [],
  );

  const getItemLayout = useCallback(
    (data: ArrayLike<string | null> | null | undefined, index: number) => ({
      length: 50, // itemHeight와 반드시 동일해야 합니다.
      offset: 50 * index,
      index,
    }),
    [],
  );
  return (
    <Controller
      control={control}
      name="times"
      defaultValue={[]}
      render={({ field: { value = [], onChange }, fieldState: { error } }) => {
        const addTime = () => {
          const tempPeriod = periodOptions[periodIndex];
          const tempHour12 = parseInt(hourOptions[hourIndex], 10);
          const tempMinute = parseInt(minuteOptions[minuteIndex], 10);

          const hhmm = to24h(
            tempPeriod as '오전' | '오후',
            tempHour12,
            tempMinute,
          );
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
            <TouchableOpacity
              onPress={() => {
                setDupMsg(null);
                setVisible(true);
              }}
              className="rounded-[16px] border border-[#D7E0FF] px-[16px] h-[60px] justify-center mb-3 flex-row items-center"
            >
              <Text className="flex-1 text-[20px] font-semibold text-[#999999]">
                오전 00:00
              </Text>
              <Text className="text-[28px] leading-[28px] text-[#597AFF]">
                +
              </Text>
            </TouchableOpacity>

            {/* 추가된 시간 리스트 */}
            {value.map((t) => (
              <View
                key={t}
                className="rounded-[16px] border border-[#D7E0FF] px-[16px] h-[60px] justify-center mb-3 flex-row items-center"
              >
                <Text className="flex-1 text-[20px] font-bold text-[#111111]">
                  {toKoreanTimeLabelFromHHMM(t)}
                </Text>
                <TouchableOpacity onPress={() => remove(t)} hitSlop={8}>
                  <Text className="text-[28px] leading-[28px] text-[#597AFF]">
                    −
                  </Text>
                </TouchableOpacity>
              </View>
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
                  // onStartShouldSetResponder={() => true}
                >
                  <View
                    className="flex-row gap-3 justify-center items-center"
                    style={{ height: 216 }}
                  >
                    <WheelPicker
                      selectedIndex={periodIndex}
                      options={periodOptions}
                      onChange={(index) => setPeriodIndex(index)}
                      containerStyle={{ width: 110 }}
                      itemHeight={50}
                      itemTextStyle={{
                        fontSize: 22,
                        color: isDark ? 'white' : 'black',
                      }}
                      selectedIndicatorStyle={{
                        backgroundColor: isDark ? '#3A3A3C' : '#F1F4FF',
                        borderWidth: 0,
                        borderRadius: 12,
                      }}
                      flatListProps={{ getItemLayout }}
                    />
                    <WheelPicker
                      selectedIndex={hourIndex}
                      options={hourOptions}
                      onChange={(index) => setHourIndex(index)}
                      containerStyle={{ width: 110 }}
                      itemHeight={50}
                      itemTextStyle={{
                        fontSize: 22,
                        color: isDark ? 'white' : 'black',
                      }}
                      selectedIndicatorStyle={{
                        backgroundColor: isDark ? '#3A3A3C' : '#F1F4FF',
                        borderWidth: 0,
                        borderRadius: 12,
                      }}
                      flatListProps={{ getItemLayout }}
                    />
                    <WheelPicker
                      selectedIndex={minuteIndex}
                      options={minuteOptions}
                      onChange={(index) => setMinuteIndex(index)}
                      containerStyle={{ width: 110 }}
                      itemHeight={50}
                      itemTextStyle={{
                        fontSize: 22,
                        color: isDark ? 'white' : 'black',
                      }}
                      selectedIndicatorStyle={{
                        backgroundColor: isDark ? '#3A3A3C' : '#F1F4FF',
                        borderWidth: 0,
                        borderRadius: 12,
                      }}
                      flatListProps={{ getItemLayout }}
                    />
                  </View>

                  {dupMsg && (
                    <Text className="text-center text-[#FF5B6B] mt-2 text-[12px]">
                      {dupMsg}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={addTime}
                    className="my-4 mx-2 h-[56px] rounded-2xl bg-[#3D3D3D] items-center justify-center"
                  >
                    <Text className="text-white text-[16px] font-semibold">
                      확인
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
