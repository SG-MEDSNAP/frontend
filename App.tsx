// App.tsx
import * as React from 'react';
import { useFonts } from 'expo-font';
import { TextInput, ActivityIndicator, Text, View, Image, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import './global.css';

import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import PhotoRegisterScreen from './src/screens/PhotoRegisterScreen';

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import RegisterDoneScreen from './src/screens/RegisterDoneScreen';
import VerifyIntakeResultScreen from './src/screens/VerifyResultScreen';

export type RootStackParamList = {
  PhotoRegister: undefined;
  Home: undefined;
  Main: undefined;
  MedicationRegister: undefined;
  RegisterScreen: undefined;
  RegisterDoneScreen: undefined;
  VerifyIntakeResult:
    | { result?: 'success' | 'not_taken' | 'error'; delayMs?: number }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ✅ 컴포넌트 바깥: 알림 핸들러(항상 한 번만 설정)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // 기본 알럿
    shouldPlaySound: true,      // 소리
    shouldSetBadge: false,      // 뱃지
    shouldShowBanner: true,     // iOS 상단 배너
    shouldShowList: true,       // iOS 알림센터 리스트
  }),
});

export default function App() {
  const [loaded] = useFonts({
    Pretendard: require('./assets/fonts/PretendardVariable.ttf'),
  });

  // ✅ 훅은 항상 호출. 실행은 loaded가 true일 때만.
  useEffect(() => {
    if (!loaded) return; // 폰트 로딩 전엔 아무것도 안 함

    (async () => {
      // iOS 권한
      const ios = await Notifications.getPermissionsAsync();
      if (ios.status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== 'granted') {
          Alert.alert('알림 권한 필요', '알림 기능을 사용하려면 권한을 허용해주세요.');
        }
      }
      // Android 채널 (중요도 HIGH)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: '약 알림',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    })();
  }, [loaded]);

  // 전역 기본 Text/TextInput 폰트
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

  // ⬇️ 로딩 UI는 훅 선언 "뒤"에서 분기
  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
            fontWeight: '600',
          },
          headerBackButtonDisplayMode: 'minimal',
          // headerBackImage: () => (
          //   <Image source={require('./assets/icons/icon_back.png')} style={{ width: 24, height: 24 }} />
          // ),
        }}
      >
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PhotoRegister" component={PhotoRegisterScreen} options={{ title: '약 등록' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈 화면' }} />
        <Stack.Screen name="MedicationRegister" component={RegisterScreen} options={{ title: '약 등록' }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: '약 등록' }} />
        <Stack.Screen name="RegisterDoneScreen" component={RegisterDoneScreen} options={{ title: '약 등록' }} />
        <Stack.Screen name="VerifyIntakeResult" component={VerifyIntakeResultScreen} options={{ title: '복약 인증' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
