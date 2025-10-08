import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../components/Icon';
import { Image } from 'react-native';

export default function AppInfoScreen() {
  const navigation = useNavigation();

  const handlePrivacyPolicyPress = async () => {
    const url =
      'https://www.freeprivacypolicy.com/live/2f37fbaf-809d-484f-ba82-7faec226b098';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('오류', '링크를 열 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '링크를 여는 중 오류가 발생했습니다.');
    }
  };

  const handleContactPress = async () => {
    const url =
      'https://stormy-mind-8b0.notion.site/MedSnap-274aba98e77e80278fe1e97ea67f2229?source=copy_link';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('오류', '링크를 열 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '링크를 여는 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView className="flex-1">
        {/* 앱 정보 내용 */}
        <View className="px-4 py-6">
          {/* 앱 로고/이름 섹션 */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 shadow-sm rounded-2xl items-center justify-center mb-4">
              <Image
                source={require('../../assets/icon.png')}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>
            <Text className="label1  text-black mb-2">MEDSNAP</Text>
            <Text className="body-sm text-gray-600 text-center">
              복약 관리를 도와주는{'\n'}
              스마트한 건강 관리 파트너
            </Text>
          </View>

          {/* 기본 정보 */}
          <View className="mb-8">
            <Text className="h7 text-black mb-4">기본 정보</Text>
            <View className="bg-primary-50 rounded-xl p-4 ">
              <View className="space-y-2">
                <View className="flex-row justify-between items-center py-2">
                  <Text className="body-sm text-gray-700">버전</Text>
                  <Text className="text-black font-medium">v.0.1.0</Text>
                </View>

                <View className="flex-row justify-between items-center py-2">
                  <Text className="body-sm text-gray-700">플랫폼</Text>
                  <Text className="text-black font-medium">iOS / Android</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 법적 정보 */}
          <View className="mb-8">
            <Text className="h7 text-black mb-4">법적 정보</Text>
            <View className="space-y-2 bg-primary-50 rounded-xl p-4">
              <TouchableOpacity
                className="flex-row items-center justify-between py-2"
                onPress={handleContactPress}
              >
                <Text className="body-sm text-gray-700">문의하기</Text>
                <Icon name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center justify-between py-2"
                onPress={handlePrivacyPolicyPress}
              >
                <Text className="body-sm text-gray-700">개인정보처리방침</Text>
                <Icon name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 저작권 */}
          <View className="items-center pt-4">
            <Text className="text-gray-500 text-sm text-center">
              © 2025 MEDSNAP Team{'\n'}
              All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
