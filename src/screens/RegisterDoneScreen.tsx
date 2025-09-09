// screens/DrugRegisterDoneScreen.tsx
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import StatusContent from '../components/StatusContent'
import PillIcon from '../assets/PillIcon.native'

export default function DrugRegisterDoneScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>()

  return (
    <StatusContent
      icon={<PillIcon size={79}  />}
      title="약 등록이 \n완료되었습니다"
      primaryAction={{
        label: '확인',
        onPress: () => navigation.goBack(),
      }}
    />
  )
}
