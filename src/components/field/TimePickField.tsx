// components/field/TimePickField.tsx
import { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Controller, Control } from 'react-hook-form';
import type { MedicationForm } from '../../schemas/medication';
import { Picker } from '@react-native-picker/picker';

function pad(n: number) { return String(n).padStart(2, '0'); }

function toKoreanTimeLabel(hhmm: string) {
  const [H, M] = hhmm.split(':').map(Number);
  const isAM = H < 12;
  const h12 = ((H + 11) % 12) + 1;
  return `${isAM ? '오전' : '오후'} ${pad(h12)}:${pad(M)}`;
}
function to24h(period: '오전' | '오후', h12: number, m: number) {
  let H = h12 % 12;
  if (period === '오후') H += 12;
  return `${pad(H)}:${pad(m)}`;
}

export function TimePickField({ control }: { control: Control<MedicationForm> }) {
  const [visible, setVisible] = useState(false);
  const [tempPeriod, setTempPeriod] = useState<'오전' | '오후'>('오전');
  const [tempHour12, setTempHour12] = useState(9);
  const [tempMinute, setTempMinute] = useState(0);
  const [dupMsg, setDupMsg] = useState<string | null>(null);

  const periods: Array<'오전' | '오후'> = ['오전', '오후'];
  const hours12 = Array.from({ length: 12 }, (_, i) => i + 1);
  const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <Controller
      control={control}
      name="times"
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const addTime = () => {
          const hhmm = to24h(tempPeriod, tempHour12, tempMinute);
          if (value.includes(hhmm)) {
            setDupMsg('이미 추가된 시간이에요');
            return; // 중복이면 닫지 않음
          }
          onChange([...value, hhmm].sort());
          setDupMsg(null);
          setVisible(false); // 추가 후에만 닫기
        };

        const remove = (t: string) => onChange(value.filter((v) => v !== t));

        return (
          <>
            {/* 추가용 플레이스홀더 행 */}
            <Pressable
              onPress={() => { setDupMsg(null); setVisible(true); }}
              className="rounded-[16px] border border-[#D7E0FF] px-[16px] h-[60px] justify-center mb-3 flex-row items-center"
            >
              <Text className="flex-1 text-[20px] font-semibold text-[#999999]">오전 00:00</Text>
              <Text className="text-[28px] leading-[28px] text-[#597AFF]">+</Text>
            </Pressable>

            {/* 추가된 시간 리스트 */}
            {value.map((t) => (
              <View
                key={t}
                className="rounded-[16px] border border-[#D7E0FF] px-[16px] h-[60px] justify-center mb-3 flex-row items-center"
              >
                <Text className="flex-1 text-[20px] font-bold text-[#111111]">
                  {toKoreanTimeLabel(t)}
                </Text>
                <Pressable onPress={() => remove(t)} hitSlop={8}>
                  <Text className="text-[28px] leading-[28px] text-[#597AFF]">−</Text>
                </Pressable>
              </View>
            ))}

            {/* zod 에러 */}
            {error?.message && (
              <Text className="text-[12px] text-[#FF5B6B] mt-1">{error.message}</Text>
            )}

            {/* 모달: 오전/오후 + 시 + 분 (추가하기 눌러야 확정) */}
            <Modal
              visible={visible}
              transparent
              animationType="fade"
              onRequestClose={() => setVisible(false)}
            >
              {/*  배경과 콘텐츠를 분리: 배경을 누르면 닫힘*/}
              <View className="flex-1 justify-end">
                {/* 배경(딤드) */}
                <Pressable className="flex-1 bg-black/40" onPress={() => setVisible(false)} />

                {/* 콘텐츠 */}
                <View
                  className="bg-white rounded-t-3xl p-4"
                  // 콘텐츠 내부 터치가 배경으로 전파되지 않게 차단
                  onStartShouldSetResponder={() => true}
                >
                  <View className="flex-row gap-3 justify-center items-center">
                    <Picker
                      selectedValue={tempPeriod}
                      style={{ width: 110 }}
                      onValueChange={(v) => setTempPeriod(v)}
                    >
                      {periods.map((p) => <Picker.Item key={p} label={p} value={p} />)}
                    </Picker>
                    <Picker
                      selectedValue={tempHour12}
                      style={{ width: 110 }}
                      onValueChange={(v) => setTempHour12(v)}
                    >
                      {hours12.map((h) => <Picker.Item key={h} label={pad(h)} value={h} />)}
                    </Picker>
                    <Picker
                      selectedValue={tempMinute}
                      style={{ width: 110 }}
                      onValueChange={(v) => setTempMinute(v)}
                    >
                      {mins.map((mm) => <Picker.Item key={mm} label={pad(mm)} value={mm} />)}
                    </Picker>
                  </View>

                  {dupMsg && (
                    <Text className="text-center text-[#FF5B6B] mt-2 text-[12px]">
                      {dupMsg}
                    </Text>
                  )}

                  {/* 추가하기 버튼 */}
                  <Pressable
                    onPress={addTime}
                    className="my-4 mx-2 h-[56px] rounded-2xl bg-[#597AFF] items-center justify-center"
                  >
                    <Text className="text-white text-[16px] font-semibold">추가하기</Text>
                  </Pressable>

               
                </View>
              </View>
            </Modal>
          </>
        );
      }}
    />
  );
}
