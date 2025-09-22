// src/screens/CalendarScreen.tsx

import { useState } from 'react';
import { View, Text, Image, ScrollView, Alert, Platform } from 'react-native';
import {
  Calendar,
  LocaleConfig,
  CalendarList,
  Agenda,
} from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';
import { colors } from '@/styles/designSystem';

export default function CalendarScreen() {
  const [selected, setSelected] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center px-4 bg-white h-[60px]">
          <HeaderLogo />
        </View>
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: colors.primary[400],
            },
          }}
          theme={{
            selectedDayBackgroundColor: '#111111',
            todayTextColor: '#597AFF',
            arrowColor: '#000000',
            textDayFontWeight: 400,
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
