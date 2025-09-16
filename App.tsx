// App.tsx
import * as React from 'react';
import { useFonts } from 'expo-font';
import { TextInput, ActivityIndicator, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import './global.css';

import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PhotoRegisterScreen from './src/screens/PhotoRegisterScreen';
import RegisterDoneScreen from './src/screens/RegisterDoneScreen';
import VerifyIntakeResultScreen from './src/screens/VerifyResultScreen';
import { size } from 'zod';

// icons
import HomeIcon from './assets/icons/HomeIcon.svg';
import LogIcon from './assets//icons/LogIcon.svg';
import SupportIcon from './assets/icons//SupportIcon.svg';
import MyPageIcon from './assets/icons/MyPageIcon.svg';

export type RootStackParamList = {
  PhotoRegister: undefined;
  // Home: undefined;
  MedicationRegister: {
    imageUri: string;
  };
  // ✅ 추가
  RegisterDoneScreen: undefined;
  VerifyIntakeResult:
    | { result?: 'success' | 'not_taken' | 'error'; delayMs?: number }
    | undefined;
  MainTabs: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  MedicationLog: undefined;
  Support: undefined;
  MyPage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

function MainTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#597AFF',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 90,
          paddingBottom: 12,
        },
        tabBarIconStyle: {
          width: 42,
          height: 42,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
          lineHeight: 18,
          marginTop: 2,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <HomeIcon fill={focused ? '#597AFF' : '#888888'} />
          ),
          title: '홈',
        }}
      />
      <BottomTab.Screen
        name="MedicationLog"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <LogIcon fill={focused ? '#597AFF' : '#888888'} />
          ),
          title: '복약 현황',
        }}
      />
      <BottomTab.Screen
        name="Support"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <SupportIcon fill={focused ? '#597AFF' : '#888888'} />
          ),
          title: '고객 센터',
        }}
      />
      <BottomTab.Screen
        name="MyPage"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MyPageIcon fill={focused ? '#597AFF' : '#888888'} />
          ),
          title: '마이페이지',
        }}
      />
    </BottomTab.Navigator>
  );
}

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
        initialRouteName="MainTabs"
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
        }}
      >
        <Stack.Screen
          name="PhotoRegister"
          component={PhotoRegisterScreen}
          options={{
            title: '약 등록',
          }}
        />
        {/* <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: '홈 화면', headerShown: false }}
        /> */}
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
        {/* <Stack.Screen
          name="VerifyIntakeResult"
          component={VerifyIntakeResultScreen}
          options={{ title: '복약 인증' }}
        /> */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
