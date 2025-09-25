// QnaRegisterScreen.tsx
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QnaField from '@/components/field/QnaField';

export default function QnaRegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex px-4 py-5 min-h-[134px]">
          <QnaField type="question" />
        </View>
        <View className="flex px-4 py-5 min-h-[134px] bg-[#F4F7FF]">
          <QnaField type="answer" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
