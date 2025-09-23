// src/screens/CalendarScreen.tsx

import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  Calendar,
  LocaleConfig,
  CalendarList,
  Agenda,
} from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';
import { colors, fontStyles } from '@/styles/designSystem';

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

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FF]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: colors.primary[500],
              selectedTextColor: 'white',
            },
          }}
          theme={{
            stylesheet: {
              calendar: {
                main: {
                  // marginTop: 10,
                  // marginBottom: 10,
                  // flexDirection: 'row',
                  // justifyContent: 'space-around',
                },
                header: {
                  gap: 16,
                },
              },
              dot: {
                width: 6,
                height: 6,
                marginTop: 2,
                borderRadius: 3,
              },
            },
            arrowColor: colors.gray[900],
            monthTextColor: colors.gray[900],
            // textMonthFontFamily: 'Pretendard', // 이걸 안해야 굵기가 적용됨
            textMonthFontWeight: '700',
            textMonthFontSize: 28,
            textDayHeaderFontWeight: '400',
            textDayHeaderFontSize: 18,
            // textDayFontFamily: 'Pretendard', // 이걸 안해야 굵기가 적용됨
            textDayFontWeight: '500',
            textDayFontSize: 20,
            selectedDayBackgroundColor: '#111111',
            todayTextColor: '#597AFF',
            // customTextStyle: { fontWeight: '800' },
            // monthTextColor: '#000000',
            // textDayFontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
            // textMonthFontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
            // textDayHeaderFontFamily:
            // Platform.OS === 'ios' ? 'System' : 'Roboto',
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  calendarbox: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});
