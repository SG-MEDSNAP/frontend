import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  Alert,
  NativeModules,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginButton from '../components/LoginButton';
import { useSocialLoginMutation } from '../features/socialLogin';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
// 푸시 알림은 사용자 동의 시에만 설정 (App Store Guideline 4.5.4)

const { KeyHashModule } = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, any>;

export default function LoginScreen({ navigation }: Props) {
  const socialLoginMutation = useSocialLoginMutation();

  // ✅ Android 키 해시 확인 (릴리즈 빌드용)
  useEffect(() => {
    if (Platform.OS === 'android' && KeyHashModule) {
      KeyHashModule.getKeyHashes()
        .then((hashes: string) => {
          console.log('🔑 [KEY HASHES]:', hashes);
          Alert.alert(
            '🔑 릴리즈 키 해시 정보',
            `${hashes}\n\n카카오: Kakao Key Hash 값을 카카오 개발자 콘솔에 등록\n구글: Google SHA-1 값을 Google Cloud Console에 등록`,
            [{ text: '확인' }],
          );
        })
        .catch((err: any) => {
          console.error('❌ 키 해시 확인 실패:', err);
        });
    }
  }, []);

  const handleSocialLogin = (
    provider: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE',
  ) => {
    console.log(`[LOGIN] ${provider} 로그인 시작`);

    socialLoginMutation.mutate(provider, {
      onSuccess: (result: any) => {
        console.log(`[LOGIN] ${provider} 로그인 성공:`, result);

        // Swagger 테스트용 아이디 토큰 로그 출력
        if (result.idToken) {
          console.log('='.repeat(50));
          console.log(`[SWAGGER] ${provider} ID TOKEN:`);
          console.log(result.idToken);
          console.log('='.repeat(50));
        }

        if (result.next === 'HOME') {
          // 푸시 알림은 사용자 동의가 있을 때만 설정 (App Store Guideline 4.5.4)
          // 기존 회원의 isPushConsent 여부는 MainTabs에서 확인 후 처리
          navigation.replace('MainTabs');
        } else {
          navigation.navigate('Join', {
            idToken: result.idToken,
            provider,
            nameHint: result.nameHint,
          });
        }
      },
      onError: (error) => {
        console.error(`[LOGIN] ${provider} 로그인 실패:`, error);
        // 에러 토스트 표시 (구현 필요)
        // TODO: 에러 토스트 표시
      },
    });
  };

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
              onPress={() => handleSocialLogin('KAKAO')}
              disabled={socialLoginMutation.isPending}
              className="w-full"
            />
            {/* 네이버 로그인 비활성화 */}
            {/* <LoginButton
              type="naver"
              title="네이버로 로그인"
              onPress={() => handleSocialLogin('NAVER')}
              disabled={socialLoginMutation.isPending}
              className="w-full"
            /> */}
            <LoginButton
              type="google"
              title="구글로 로그인"
              onPress={() => handleSocialLogin('GOOGLE')}
              disabled={socialLoginMutation.isPending}
              className="w-full"
            />
            {Platform.OS === 'ios' && (
              <LoginButton
                type="apple"
                title="애플로 로그인"
                onPress={() => handleSocialLogin('APPLE')}
                disabled={socialLoginMutation.isPending}
                className="w-full"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
