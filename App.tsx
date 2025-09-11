// App.tsx
import * as React from 'react';
import { useFonts } from 'expo-font';
import { TextInput, ActivityIndicator, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import './global.css';

import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import PhotoRegisterScreen from './src/screens/PhotoRegisterScreen';

// ✅ 새로 추가되는 화면 import
import RegisterDoneScreen from './src/screens/RegisterDoneScreen';
import VerifyIntakeResultScreen from './src/screens/VerifyResultScreen';

export type RootStackParamList = {
  PhotoRegister: undefined;
  Home: undefined;
  Main: undefined;
  MedicationRegister: undefined;
  // ✅ 추가
  RegisterDoneScreen: undefined;
  VerifyIntakeResult:
    | { result?: 'success' | 'not_taken' | 'error'; delayMs?: number }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [loaded] = useFonts({
    Pretendard: require('./assets/fonts/PretendardVariable.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 전역 기본 Text/TextInput 폰트 설정
  const RnText: any = Text as any;
  const RnTextInput: any = TextInput as any;
  RnText.defaultProps = RnText.defaultProps || {};
  RnText.defaultProps.style = {
    ...(RnText.defaultProps.style || {}),
    fontFamily: 'Pretendard',
  };
  RnTextInput.defaultProps = RnTextInput.defaultProps || {};
  RnTextInput.defaultProps.style = {
    ...(RnTextInput.defaultProps.style || {}),
    fontFamily: 'Pretendard',
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: {
            fontFamily: 'Pretendard',
            fontSize: 22,
            // RN은 'semibold' 대신 숫자 사용 권장(600)
            fontWeight: '600',
          },
          headerBackButtonDisplayMode: 'minimal',
          // ❗️SVG가 에러나면 headerBackImage로 PNG 사용 권장
          // headerBackImage: () => (
          //   <Image source={require('./assets/icons/icon_back.png')} style={{ width: 24, height: 24 }} />
          // ),
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PhotoRegister"
          component={PhotoRegisterScreen}
          options={{
            title: '약 등록',
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈 화면' }}
        />
        <Stack.Screen
          name="MedicationRegister"
          component={RegisterScreen}
          options={{ title: '약 등록' }}
        />

        {/* ✅ 약 등록 완료 */}
        <Stack.Screen
          name="RegisterDoneScreen"
          component={RegisterDoneScreen}
          options={{ title: '약 등록' }}
        />

        {/* ✅ 복약 인증 결과(분석중 → 성공/실패를 한 화면에서 처리) */}
        <Stack.Screen
          name="VerifyIntakeResult"
          component={VerifyIntakeResultScreen}
          options={{ title: '복약 인증' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
