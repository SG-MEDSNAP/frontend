import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';

type MedicationRegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MedicationRegister'
>;

interface Props {
  navigation: MedicationRegisterScreenNavigationProp;
}

export default function MedicationRegisterScreen({ navigation }: Props) {
  const [medicationName, setMedicationName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([
    '월',
    '화',
    '수',
    '목',
    '금',
  ]);
  const [everyDay, setEveryDay] = useState(false);
  const [time, setTime] = useState('오전 00:00');
  const [guardianSms, setGuardianSms] = useState(false);
  const [guardianPhone, setGuardianPhone] = useState('');
  const [tenMinuteReminder, setTenMinuteReminder] = useState(false);

  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleEveryDay = () => {
    setEveryDay(!everyDay);
    if (!everyDay) {
      setSelectedDays(days);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 제목 */}
        <Text style={styles.title}>처방 받은 약 정보를 입력해주세요</Text>

        {/* 약 이름 입력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>어떤 약을 드시나요?</Text>
          <TextInput
            style={styles.input}
            placeholder="혈압약"
            value={medicationName}
            onChangeText={setMedicationName}
            placeholderTextColor="#999"
          />
        </View>

        {/* 요일 선택 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>요일을 선택해주세요</Text>
            <View style={styles.everyDayContainer}>
              <Text style={styles.everyDayText}>매일</Text>
              <Switch
                value={everyDay}
                onValueChange={toggleEveryDay}
                trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
                thumbColor={everyDay ? '#fff' : '#fff'}
              />
            </View>
          </View>
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.dayButtonTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 시간 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>시간을 선택해주세요</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.timeInput}
              value={time}
              onChangeText={setTime}
              placeholderTextColor="#333"
            />
            <TouchableOpacity style={styles.addTimeButton}>
              <Text style={styles.addTimeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 보호자 SMS 알림 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>보호자 문자 수신(결과 전송)</Text>
            <Switch
              value={guardianSms}
              onValueChange={setGuardianSms}
              trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
              thumbColor={guardianSms ? '#fff' : '#fff'}
            />
          </View>
          {guardianSms && (
            <TextInput
              style={styles.input}
              placeholder="010-0000-0000"
              value={guardianPhone}
              onChangeText={setGuardianPhone}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          )}
        </View>

        {/* 10분전 알림 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>10분전 알림</Text>
            <Switch
              value={tenMinuteReminder}
              onValueChange={setTenMinuteReminder}
              trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
              thumbColor={tenMinuteReminder ? '#fff' : '#fff'}
            />
          </View>
          <Text style={styles.reminderDescription}>
            (지정 시간에 알려드려요, 체크하시면 10분전에도 알림을 받아보실 수
            있어요)
          </Text>
        </View>

        {/* 등록 버튼 */}
        <Button
          title="등록하기"
          type="primary"
          size="lg"
          onPress={() => {
            // 등록 로직 구현
            console.log('약 등록 완료');
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  everyDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  everyDayText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#E3F2FD',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: '#007AFF',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addTimeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTimeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  reminderDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    lineHeight: 16,
  },
});
