import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import StatusContent from '../components/StatusContent';
import PillIcon from '../assets/PillIcon.native';

export default function JoinDoneScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <StatusContent
      icon={<PillIcon size={79} />}
      title={'회원가입이 \n완료되었습니다'}
      primaryAction={{
        label: '확인',
        onPress: () => navigation.navigate('MainTabs'),
      }}
    />
  );
}
