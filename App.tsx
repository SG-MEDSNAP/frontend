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
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import './global.css';

import { Providers } from './src/components/Providers';
import { Icon } from './src/components/Icon';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PhotoRegisterScreen from './src/screens/PhotoRegisterScreen';
import RegisterDoneScreen from './src/screens/RegisterDoneScreen';
import VerifyIntakeResultScreen from './src/screens/VerifyResultScreen';

import JoinScreen from './src/screens/JoinScreen';
import LoginScreen from './src/screens/LoginScreen';

import CalendarScreen from '@/screens/CalendarScreen';
import SupportScreen from '@/screens/SupportScreen';

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// icons
import HomeIcon from './assets/icons/HomeIcon.svg';
import LogIcon from './assets/icons/LogIcon.svg';
import SupportIcon from './assets/icons/SupportIcon.svg';
import MyPageIcon from './assets/icons/MyPageIcon.svg';
import FaqRegisterScreen from '@/screens/FaqRegisterScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import SettingScreen from './src/screens/SettingScreen';
import EditInfoScreen from './src/screens/EditInfoScreen';
import EditMedication from './src/screens/EditMedication';

export type RootStackParamList = {
  Login: undefined;
  PhotoRegister: undefined;
  Home: undefined;
  MedicationRegister: {
    imageUri: string;
  };
  Join: {
    idToken: string;
    provider: 'GOOGLE' | 'APPLE' | 'KAKAO' | 'NAVER';
  };
  JoinDone: undefined;
  RegisterScreen: undefined;
  RegisterDoneScreen: undefined;
  VerifyIntakeResult?:
    | { result?: 'success' | 'not_taken' | 'error'; delayMs?: number }
    | undefined;
  MainTabs: undefined;
  Calendar: undefined;
  FaqRegister: undefined;
  Settings: undefined;
  EditInfo: undefined;
  EditMedication: undefined;
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
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <LogIcon fill={focused ? '#597AFF' : '#888888'} />
          ),
          title: '복약 현황',
        }}
      />
      <BottomTab.Screen
        name="Support"
        component={SupportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <SupportIcon fill={focused ? '#597AFF' : '#888888'} />
          ),
          title: '고객 센터',
        }}
      />
      <BottomTab.Screen
        name="MyPage"
        component={MyPageScreen}
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
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.ttf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.ttf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.ttf'),
    'Pretendard-Bold': require('./assets/fonts/Pretendard-Bold.ttf'),
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

  const RnText: any = Text as any;
  const RnTextInput: any = TextInput as any;
  RnText.defaultProps = RnText.defaultProps || {};
  RnText.defaultProps.style = {
    ...(RnText.defaultProps.style || {}),
    fontFamily: 'Pretendard-Regular',
  };
  RnTextInput.defaultProps = RnTextInput.defaultProps || {};
  RnTextInput.defaultProps.style = {
    ...(RnTextInput.defaultProps.style || {}),
    fontFamily: 'Pretendard-Regular',
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
          initialRouteName="Login"
          screenOptions={({ navigation, route }) => ({
            headerShown: true,
            headerStyle: { backgroundColor: '#FFFFFF' },
            headerTitleStyle: {
              fontFamily: 'Pretendard-SemiBold',
              fontSize: 22,
              fontWeight: '600',
            },
            headerBackButtonDisplayMode: 'minimal',
            headerLeft:
              route.name !== 'MainTabs'
                ? () => (
                    <TouchableOpacity onPress={() => navigation?.goBack()}>
                      <Icon name="back" size={36} color="#232323" />
                    </TouchableOpacity>
                  )
                : undefined,
            headerRight:
              route.name !== 'MainTabs'
                ? () => (
                    <TouchableOpacity
                      onPress={() => navigation?.navigate('MainTabs')}
                    >
                      <Icon name="close" size={36} color="#232323" />
                    </TouchableOpacity>
                  )
                : undefined,
          })}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Join"
            component={JoinScreen}
            options={{ title: '회원가입' }}
          />
          <Stack.Screen
            name="JoinDone"
            component={require('./src/screens/JoinDoneScreen').default}
            options={{ title: '회원가입' }}
          />
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
          <Stack.Screen
            name="FaqRegister"
            component={FaqRegisterScreen}
            options={{ headerShown: true, title: 'Q&A 등록' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingScreen}
            options={{ title: '설정' }}
          />
          <Stack.Screen
            name="EditInfo"
            component={EditInfoScreen}
            options={{ title: '내 정보 수정' }}
          />
          <Stack.Screen
            name="EditMedication"
            component={EditMedication}
            options={{ title: '약 정보 수정' }}
          />
        </Stack.Navigator>
        {/* Settings screen outside tabs */}

        <StatusBar style="auto" />
      </NavigationContainer>
    </Providers>
  );
}
