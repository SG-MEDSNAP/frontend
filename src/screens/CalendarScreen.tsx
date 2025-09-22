// src/screens/CalendarScreen.tsx

import { useState } from 'react';
import { View, Text, Image, ScrollView, Alert, Platform } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

// images
import HeaderLogo from '../../assets/images/header_logo.svg';

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
              // selectedDotColor: 'orange',
            },
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
