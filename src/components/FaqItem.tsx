// components/FaqItem.tsx
import { View, Text, TouchableOpacity } from 'react-native';

// icons
import DownIcon from '../../assets/icons/DownIcon.svg';
import UpIcon from '../../assets/icons/UpIcon.svg';

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
        <View className="flex-row flex-1 pr-4">
          <Text className="text-[20px]/[30px] font-semibold text-[#597AFF] mr-2">
            Q.
          </Text>
          <Text className="text-[20px]/[30px] font-semibold text-[#232323] flex-1">
            [{item.category}] {item.question}
          </Text>
        </View>
        <Text className="text-[20px] text-[#232323]">
          {isOpen ? <UpIcon /> : <DownIcon />}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="p-4 bg-[#F4F7FF] border-t border-t-[#DAE1FF] flex-row">
          <Text className="text-[20px]/[30px] font-semibold text-[#597AFF] mr-2">
            A.
          </Text>
          <Text className="text-[20px]/[30px] font-semibold text-[#232323] flex-1">
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
}
