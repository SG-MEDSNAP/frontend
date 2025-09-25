// components/FaqItem.tsx
import { View, Text, TouchableOpacity } from 'react-native';
// import { Icon } from './Icon';

export interface Faq {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface FaqItemProps {
  item: Faq;
  isOpen: boolean;
  onPress: () => void;
}

export function FaqItem({ item, isOpen, onPress }: FaqItemProps) {
  return (
    <View className="border-b border-b-[#EBEBEB]">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between px-4 py-5"
      >
        <View className="flex-1 pr-4">
          <Text className="text-[20px]/[30px] font-semibold text-[#232323]">
            <Text className="text-[#597AFF]">Q.</Text>
            <View className="w-[10px]"></View>

            <Text className="text-[#232323]">
              [{item.category}] {item.question}
            </Text>
          </Text>
        </View>
        {/* <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} color="#888888" /> */}
        {/* Icon 컴포넌트가 없다면 아래 텍스트로 임시 대체 */}
        <Text className="text-[20px] text-[#232323]">{isOpen ? '∧' : '∨'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="p-4 bg-[#F4F7FF] border-1 border-[#DAE1FF]">
          <Text className="text-[20px]/[30px] font-semibold text-[#232323]">
            <Text className="text-[#597AFF]">A.</Text>
            <View className="w-[10px]"></View>
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
}
