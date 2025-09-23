// src/screens/CalendarScreen.tsx

import { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';
import { colors, fontStyles } from '@/styles/designSystem';
import TodayTimeLine from '@/components/TodayTimeLine';
import MedicationCard from '@/components/MedicationCard';

interface Medication {
  id: string;
  name: string;
  time: string;
  frequency: string;
  taken: boolean;
}

LocaleConfig.locales['kr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

export default function CalendarScreen() {
  const [selected, setSelected] = useState('');

  // 샘플 데이터
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '혈압약',
      time: '오전 8:00',
      frequency: '매일',
      taken: true,
    },
    {
      id: '2',
      name: '당뇨약',
      time: '오후 1:00',
      frequency: '매일',
      taken: true,
    },
    {
      id: '3',
      name: '비타민',
      time: '오후 6:00',
      frequency: '주 3회',
      taken: false,
    },
  ]);

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateHeader = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-').map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = LocaleConfig.locales['kr'].dayNames[date.getDay()];
    return `${month}월 ${day}일 ${dayOfWeek}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FF]">
      <View className="flex-row items-center px-4 bg-white h-[60px]">
        <HeaderLogo />
      </View>
      <Calendar
        style={styles.calendarbox}
        onDayPress={(day) => {
          setSelected(day.dateString);
        }}
        monthFormat="yyyy년 M월"
        hideExtraDays={true} // 이전달, 다음달 날짜 표시 여부.
        enableSwipeMonths={true} // 달력 스와이프 가능 여부
        firstDay={0} // 0: 일요일, 1: 월요일
        markingType={'custom'}
        markedDates={{
          // 2. selected 값이 있을 때만 markedDates 객체를 적용
          ...(selected && {
            [selected]: {
              disableTouchEvent: true,
              // 3. customStyles를 사용하여 컨테이너와 텍스트 스타일을 직접 지정
              customStyles: {
                container: {
                  backgroundColor: colors.primary[500], // 원의 배경색
                  width: 36, // 원의 너비
                  height: 36, // 원의 높이
                  borderRadius: 18, // 원으로 만들기 (width/height의 절반)
                  justifyContent: 'center', // 내부 텍스트 세로 중앙 정렬
                  alignItems: 'center', // 내부 텍스트 가로 중앙 정렬
                },
                text: {
                  color: 'white', // 글자색
                  fontWeight: '600',
                },
              },
            },
          }),
          // 다른 marked 날짜가 있다면 여기에 추가 가능
        }}
        theme={{
          stylesheet: {
            calendar: {
              main: {
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
              },
              header: {
                gap: 16,
              },
            },
            // day: {
            //   basic: {
            //     base: {
            //       width: 36,
            //       height: 44,
            //       alignItems: 'center',
            //       justifyContent: 'center',
            //     },
            //   },
            // },
          },
          arrowColor: colors.gray[900],
          monthTextColor: colors.gray[900],
          // textMonthFontFamily: 'Pretendard', // 이걸 안해야 굵기가 적용됨
          textMonthFontWeight: '700',
          textMonthFontSize: 28,
          textDayHeaderFontWeight: '400',
          textDayHeaderFontSize: 18,
          // textDayFontFamily: 'Pretendard', // 이걸 안해야 굵기가 적용됨
          textDayFontWeight: '600',
          textDayFontSize: 20,
          selectedDayBackgroundColor: '#111111',
          todayTextColor: '#597AFF',
          'stylesheet.day.basic': {
            base: {
              width: 36,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
            },
          },
        }}
      />
      <View className="grow mx-4 mt-12">
        <View className="mb-5 flex-row justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-2 w-2 bg-primary-500 rounded-full"></View>
            <Text className="text-[24px]/[34px] font-bold text-[#232323]">
              {formatDateHeader(selected || getTodayDateString())}
            </Text>
          </View>
          <Text className="text-[18px]/[18px] font-bold text-[#232323]">
            상세보기
          </Text>
        </View>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <TodayTimeLine medications={medications} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarbox: {
    // height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});
