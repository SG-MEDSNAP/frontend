import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Switch, Pressable } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MedicationRegister'
>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const [medicationName, setMedicationName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['월', '화', '수', '목', '금']);
  const [everyDay, setEveryDay] = useState(false);
  const [time, setTime] = useState('오전 00:00');
  const [guardianSms, setGuardianSms] = useState(false);
  const [guardianPhone, setGuardianPhone] = useState('');
  const [tenMinuteReminder, setTenMinuteReminder] = useState(false);

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleEveryDay = () => {
    setEveryDay((prev) => {
      const next = !prev;
      if (!prev) setSelectedDays(days);
      return next;
    });
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        {/* 제목 */}
        <Text className="text-2xl font-bold text-[#333] text-center mb-7">
          처방 받은 약 정보를 입력해주세요
        </Text>

        {/* 약 이름 입력 */}
        <View className="mb-7">
          <Text className="text-[16px] font-semibold text-[#333] mb-3">
            어떤 약을 드시나요?
          </Text>
          <TextInput
            className="border border-[#E5E5E5] rounded-lg p-4 text-[16px] bg-white"
            placeholder="혈압약"
            value={medicationName}
            onChangeText={setMedicationName}
            placeholderTextColor="#999"
          />
        </View>

        {/* 요일 선택 */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[16px] font-semibold text-[#333]">
              요일을 선택해주세요
            </Text>
            <View className="flex-row items-center">
              <Text className="text-[14px] text-[#666] mr-2">매일</Text>
              <Switch
                value={everyDay}
                onValueChange={toggleEveryDay}
                trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View className="flex-row justify-between">
            {days.map((day) => {
              const selected = selectedDays.includes(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => toggleDay(day)}
                  className={[
                    'flex-1 mx-0.5 py-3 rounded-lg items-center',
                    selected ? 'bg-[#E3F2FD]' : 'bg-[#F5F5F5]',
                  ].join(' ')}
                >
                  <Text
                    className={[
                      'text-[14px] font-medium',
                      selected ? 'text-[#007AFF]' : 'text-[#999]',
                    ].join(' ')}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 시간 선택 */}
        <View className="mb-7">
          <Text className="text-[16px] font-semibold text-[#333] mb-3">
            시간을 선택해주세요
          </Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 border border-[#E5E5E5] rounded-lg p-4 text-[16px] bg-white mr-2.5"
              value={time}
              onChangeText={setTime}
              placeholderTextColor="#333"
            />
            <Pressable className="w-10 h-10 rounded-full bg-[#007AFF] items-center justify-center pressed:opacity-90">
              <Text className="text-white text-[20px] font-bold">+</Text>
            </Pressable>
          </View>
        </View>

        {/* 보호자 SMS 알림 */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-[16px] font-semibold text-[#333]">
              보호자 문자 수신(결과 전송)
            </Text>
            <Switch
              value={guardianSms}
              onValueChange={setGuardianSms}
              trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>
          {guardianSms && (
            <TextInput
              className="border border-[#E5E5E5] rounded-lg p-4 text-[16px] bg-white"
              placeholder="010-0000-0000"
              value={guardianPhone}
              onChangeText={setGuardianPhone}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          )}
        </View>

        {/* 10분전 알림 */}
        <View className="mb-7">
          <View className="flex-row items-center justify-between">
            <Text className="text-[16px] font-semibold text-[#333]">
              10분전 알림
            </Text>
            <Switch
              value={tenMinuteReminder}
              onValueChange={setTenMinuteReminder}
              trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>
          <Text className="text-[12px] text-[#999] mt-2 leading-4">
            (지정 시간에 알려드려요, 체크하시면 10분전에도 알림을 받아보실 수 있어요)
          </Text>
        </View>

        {/* 등록 버튼 */}
        <Button
          title="등록하기"
          type="primary"
          size="lg"
          className="mt-2"
          onPress={() => {
            console.log('약 등록 완료');
          }}
        />
      </View>
    </ScrollView>
  );
}
