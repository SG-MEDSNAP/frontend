// src/screens/CalendarScreen.tsx

import { useState } from 'react';
import { View, Text, Image, ScrollView, Alert, Platform } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

export default function CalendarScreen() {
  const [selected, setSelected] = useState('');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Calendar Screen</Text>
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
    </View>
  );
}
