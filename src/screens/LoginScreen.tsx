import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginButton from '../components/LoginButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, any>;

export default function LoginScreen({ navigation }: Props) {
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ flexGrow: 1 }} // 스크롤이 없어도 꽉 차게
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 내용 덩어리를 세로 중앙 정렬 */}
        <View className="flex-1 justify-center px-4">
          {/* 1) 로고 */}
          <View className="items-center">
            <Image
              source={require('../../assets/images/medsnap.png')}
              resizeMode="contain"
              className="w-[142px] h-[135px]"
            />
          </View>

          {/* 2) SNS 간편 로그인 구분선 (로고와 48px 간격) */}
          <View className="mt-12 w-full flex-row items-center">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-3 text-[14px] text-gray-600">
              SNS 간편 로그인
            </Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* 3) 버튼들 (구분선과 28px 간격) */}
          <View className="mt-7 gap-4">
            <LoginButton
              type="kakao"
              title="카카오로 로그인"
              onPress={() => navigation.navigate('Join')}
              className="w-full"
            />
            <LoginButton
              type="naver"
              title="네이버로 로그인"
              onPress={() => navigation.navigate('Join')}
              className="w-full"
            />
            <LoginButton
              type="google"
              title="구글로 로그인"
              onPress={() => navigation.navigate('Join')}
              className="w-full"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
