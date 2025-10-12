import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import StatusContent from '../components/StatusContent';
import PillIcon from '../assets/PillIcon.native';
import { setupPushNotifications } from '../lib/notifications';

export default function JoinDoneScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <StatusContent
      icon={<PillIcon size={79} />}
      title={'회원가입이 \n완료되었습니다'}
      primaryAction={{
        label: '확인',
        onPress: () => {
          // 회원가입 완료 후 푸시 알림 설정
          setupPushNotifications()
            .then((success) => {
              if (success) {
                console.log('[JOIN] 푸시 알림 설정 완료');
              } else {
                console.warn('[JOIN] 푸시 알림 설정 실패 또는 권한 거부');
              }
            })
            .catch((error) => {
              console.error('[JOIN] 푸시 알림 설정 중 예외 발생:', error);
            });

          navigation.navigate('MainTabs');
        },
      }}
    />
  );
}
