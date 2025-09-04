import * as React from 'react';
import { useFonts } from 'expo-font';
import { View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import MedicationRegisterScreen from './src/screens/MedicationRegisterScreen';

export type RootStackParamList = {
  Home: undefined;
  MedicationRegister: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loaded] = useFonts({
    // Variable 폰트를 가중치별로 서로 다른 family 이름에 매핑
    'Pretendard-Regular': require('./assets/fonts/PretendardVariable.ttf'),
    'Pretendard-Semibold': require('./assets/fonts/PretendardVariable.ttf'),
    'Pretendard-Bold': require('./assets/fonts/PretendardVariable.ttf'),
  });

  if (!loaded) {
    return null;
  }

  // 앱 전역 기본 폰트 적용 (Pretendard-Regular)
  const RnText: any = Text as any;
  const RnTextInput: any = TextInput as any;
  RnText.defaultProps = RnText.defaultProps || {};
  RnText.defaultProps.style = RnText.defaultProps.style || {};
  RnText.defaultProps.style.fontFamily = 'Pretendard-Regular';

  RnTextInput.defaultProps = RnTextInput.defaultProps || {};
  RnTextInput.defaultProps.style = RnTextInput.defaultProps.style || {};
  RnTextInput.defaultProps.style.fontFamily = 'Pretendard-Regular';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈 화면' }}
        />
        <Stack.Screen
          name="MedicationRegister"
          component={MedicationRegisterScreen}
          options={{ title: '약 등록' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
