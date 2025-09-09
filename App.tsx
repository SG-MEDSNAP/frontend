import * as React from 'react';
import { useFonts } from 'expo-font';
import { TextInput, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';

import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainScreen from './src/screens/MainScreen';
import PhotoScreen from './src/screens/PhotoScreen';

export type RootStackParamList = {
  Photo: undefined;
  Home: undefined;
  Main: undefined;
  MedicationRegister: undefined;
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
          // headerBackTitle: '뒤로',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontFamily: 'Pretendard',
            fontSize: 22,
            fontWeight: 'semibold',
          },
          // headerBackButtonMenuEnabled: false,
          headerBackButtonDisplayMode: 'minimal',
          headerBackImageSource: require('./assets/icons/icon_back.svg'),
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Photo"
          component={PhotoScreen}
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
          options={{
            title: '약 등록',
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
