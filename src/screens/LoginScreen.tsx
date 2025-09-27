import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginButton from '../components/LoginButton';
import { socialLoginOrSignupKickoff } from '../features/socialLogin';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, any>;

export default function LoginScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-4">
          <View className="items-center">
            <Image
              source={require('../../assets/images/medsnap.png')}
              resizeMode="contain"
              className="w-[142px] h-[135px]"
            />
          </View>

          <View className="mt-12 w-full flex-row items-center">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-3 h7 font-bold text-gray-600">
              SNS 간편 로그인
            </Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          <View className="mt-7 gap-4">
            <LoginButton
              type="kakao"
              title="카카오로 로그인"
              onPress={async () => {
                try {
                  const result = await socialLoginOrSignupKickoff('KAKAO');
                  if (result.next === 'HOME') {
                    navigation.replace('MainTabs');
                  } else {
                    navigation.navigate('Join', {
                      idToken: result.idToken,
                      provider: 'KAKAO',
                    });
                  }
                } catch (e) {
                  console.warn('Kakao 로그인 실패:', e);
                  // 에러 토스트 표시 (구현 필요)
                }
              }}
              className="w-full"
            />
            <LoginButton
              type="naver"
              title="네이버로 로그인"
              onPress={async () => {
                try {
                  const result = await socialLoginOrSignupKickoff('NAVER');
                  if (result.next === 'HOME') {
                    navigation.replace('MainTabs');
                  } else {
                    navigation.navigate('Join', {
                      idToken: result.idToken,
                      provider: 'NAVER',
                    });
                  }
                } catch (e) {
                  console.warn('Naver 로그인 실패:', e);
                  // 에러 토스트 표시 (구현 필요)
                }
              }}
              className="w-full"
            />
            <LoginButton
              type="google"
              title="구글로 로그인"
              onPress={async () => {
                try {
                  const result = await socialLoginOrSignupKickoff('GOOGLE');
                  if (result.next === 'HOME') {
                    navigation.replace('MainTabs');
                  } else {
                    navigation.navigate('Join', {
                      idToken: result.idToken,
                      provider: 'GOOGLE',
                    });
                  }
                } catch (e) {
                  console.warn('Google 로그인 실패:', e);
                  // 에러 토스트 표시 (구현 필요)
                }
              }}
              className="w-full"
            />
            <LoginButton
              type="apple"
              title="애플로 로그인"
              onPress={async () => {
                try {
                  const result = await socialLoginOrSignupKickoff('APPLE');
                  if (result.next === 'HOME') {
                    navigation.replace('MainTabs');
                  } else {
                    navigation.navigate('Join', {
                      idToken: result.idToken,
                      provider: 'APPLE',
                    });
                  }
                } catch (e) {
                  console.warn('Apple 로그인 실패:', e);
                  // 에러 토스트 표시 (구현 필요)
                }
              }}
              className="w-full"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
