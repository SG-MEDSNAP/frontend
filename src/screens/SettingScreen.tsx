import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../api/auth';
import CustomModal from '../components/CustomModal';

export default function SettingScreen() {
  const navigation: any = useNavigation();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      // 로그인 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
    } finally {
      setLogoutModalVisible(false);
    }
  };

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
        <TouchableOpacity
          activeOpacity={0.8}
          className="py-4"
          onPress={handleLogout}
        >
          <Text className="h7 text-gray-600">로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="py-4"
          onPress={() => {
            // TODO: 회원탈퇴 기능 구현
            Alert.alert('준비중', '회원탈퇴 기능은 준비중입니다.');
          }}
        >
          <Text className="h7 text-gray-600">회원탈퇴</Text>
        </TouchableOpacity>
      </View>

      {/* 로그아웃 확인 모달 */}
      <CustomModal
        visible={isLogoutModalVisible}
        line1="정말로,"
        line2="로그아웃하시겠습니까?"
        confirmText="확인"
        onConfirm={confirmLogout}
        cancelText="닫기"
        onCancel={() => setLogoutModalVisible(false)}
      />
    </SafeAreaView>
  );
}
