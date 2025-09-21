// App.tsx
import * as React from 'react';
import { useFonts } from 'expo-font';
import {
  TextInput,
  ActivityIndicator,
  Text,
  View,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import './global.css';

import { Providers } from './src/components/Providers';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PhotoRegisterScreen from './src/screens/PhotoRegisterScreen';
import RegisterDoneScreen from './src/screens/RegisterDoneScreen';
import VerifyIntakeResultScreen from './src/screens/VerifyResultScreen';

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// icons
import HomeIcon from './assets/icons/HomeIcon.svg';
import LogIcon from './assets/icons/LogIcon.svg';
import SupportIcon from './assets/icons/SupportIcon.svg';
import MyPageIcon from './assets/icons/MyPageIcon.svg';

export type RootStackParamList = {
  PhotoRegister: undefined;
  // Home: undefined;
  MedicationRegister: {
    imageUri: string;
  };
  RegisterScreen: undefined;
  RegisterDoneScreen: undefined;
  VerifyIntakeResult?:
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

// ✅ 글로벌 알림 핸들러 (앱 전체에서 한 번만 설정)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ✅ 메인 탭 네비게이터
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

  // ✅ 알림 권한/채널 설정
  useEffect(() => {
    if (!loaded) return;

    (async () => {
      const ios = await Notifications.getPermissionsAsync();
      if (ios.status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync();
        if (req.status !== 'granted') {
          Alert.alert(
            '알림 권한 필요',
            '알림 기능을 사용하려면 권한을 허용해주세요.',
          );
        }
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: '약 알림',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    })();
  }, [loaded]);

  // ✅ 전역 폰트 적용
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

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Providers>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: {
              fontFamily: 'Pretendard',
              fontSize: 22,
              fontWeight: '600',
            },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen
            name="PhotoRegister"
            component={PhotoRegisterScreen}
            options={{ title: '약 등록' }}
          />
          <Stack.Screen
            name="MedicationRegister"
            component={RegisterScreen}
            options={{ title: '약 등록' }}
          />
          <Stack.Screen
            name="RegisterDoneScreen"
            component={RegisterDoneScreen}
            options={{ title: '약 등록' }}
          />
          <Stack.Screen
            name="VerifyIntakeResult"
            component={VerifyIntakeResultScreen}
            options={{ title: '복약 인증' }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Providers>
  );
}
