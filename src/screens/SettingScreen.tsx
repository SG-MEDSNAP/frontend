import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { useNavigation } from '@react-navigation/native';

export default function SettingScreen() {
  const navigation: any = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <View className="px-4 py-4">
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center justify-between py-4"
          onPress={() => navigation.navigate('EditInfo')}
        >
          <Text className="h4 text-[#232323]">내 정보 수정</Text>
          <Icon name="chevron-forward" size={36} color="#3D3D3D" />
        </TouchableOpacity>

        <Text className="h7 text-gray-600 mt-4">회원탈퇴</Text>
      </View>
    </SafeAreaView>
  );
}
