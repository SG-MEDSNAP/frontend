// src/screens/CalendarScreen.tsx

import { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';
import { colors, fontStyles } from '@/styles/designSystem';
import TodayTimeLine from '@/components/TodayTimeLine';
import MedicationCard from '@/components/MedicationCard';

// API hooks
import {
  useMedicationRecordsQuery,
  useMedicationRecordDatesQuery,
} from '@/api/medication';

type CalendarScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MainTabs'
>;

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

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarScreen() {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const [selected, setSelected] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    };
  });

  // 현재 선택된 날짜 (또는 오늘)의 복약 기록 조회
  const currentDate = selected || getTodayDateString();
  const { data: medicationRecords, isLoading: recordsLoading } =
    useMedicationRecordsQuery(currentDate);

  // 달력에 점 표시할 날짜 목록 조회
  const { data: recordDates, isLoading: datesLoading } =
    useMedicationRecordDatesQuery(currentMonth.year, currentMonth.month);

  // API 데이터를 바로 사용
  const medicationItems = useMemo(() => {
    return medicationRecords?.items || [];
  }, [medicationRecords]);

  const formatDateHeader = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-').map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = LocaleConfig.locales['kr'].dayNames[date.getDay()];
    return `${month}월 ${day}일 ${dayOfWeek}`;
  };

  // 달력의 marked dates 생성
  const markedDates = useMemo(() => {
    const marks: any = {};

    // 복약 기록이 있는 날짜에 점 표시
    if (recordDates) {
      recordDates.forEach((date) => {
        marks[date] = {
          ...marks[date],
          marked: true,
          dotColor: colors.primary[500],
        };
      });
    }

    // 선택된 날짜 표시
    if (selected) {
      marks[selected] = {
        ...marks[selected],
        disableTouchEvent: true,
        customStyles: {
          container: {
            backgroundColor: colors.primary[500],
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
          },
          text: {
            color: 'white',
            fontWeight: '600',
          },
        },
      };
    }

    return marks;
  }, [selected, recordDates]);

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
        onMonthChange={(month) => {
          setCurrentMonth({
            year: month.year,
            month: month.month,
          });
        }}
        monthFormat="yyyy년 M월"
        hideExtraDays={true} // 이전달, 다음달 날짜 표시 여부.
        enableSwipeMonths={true} // 달력 스와이프 가능 여부
        firstDay={0} // 0: 일요일, 1: 월요일
        markingType={'custom'}
        markedDates={markedDates}
        theme={{
          dotStyle: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: selected ? 'white' : colors.primary[500],
          },
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
      <ScrollView>
        <View className="grow mx-4 mt-12">
          <View className="mb-5 flex-row justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 bg-primary-500 rounded-full"></View>
              <Text className="text-[24px]/[34px] font-bold text-[#232323]">
                {formatDateHeader(selected || getTodayDateString())}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MedicationDetail', {
                  date: selected || getTodayDateString(),
                })
              }
            >
              <Text className="text-[18px]/[18px] font-bold text-[#232323]">
                상세보기
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            {recordsLoading ? (
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-gray-500">
                  복약 기록을 불러오는 중...
                </Text>
              </View>
            ) : (
              <TodayTimeLine medications={medicationItems} />
            )}
          </View>
        </View>
      </ScrollView>
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
