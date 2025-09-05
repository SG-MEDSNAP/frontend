import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Button from '../components/Button';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      <Text className="text-2xl font-bold text-[#333] mb-4">
        MEDSNAP
      </Text>

      <Button
        title="약 등록하기"
        type="primary"
        size="md"
        onPress={() => navigation.navigate('MedicationRegister')}
        className="px-8"
      />
    </View>
  );
}
