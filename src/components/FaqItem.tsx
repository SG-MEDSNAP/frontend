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
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function FaqItem({
  item,
  isOpen,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}: FaqItemProps) {
  return (
    <View className="border-b border-b-[#EBEBEB]">
      <View className="flex-row items-center justify-between px-4 py-5">
        <TouchableOpacity onPress={onPress} className="flex-row flex-1 pr-4">
          <Text className="text-[20px]/[30px] font-semibold text-[#597AFF] mr-2">
            Q.
          </Text>
          <Text className="text-[20px]/[30px] font-semibold text-[#232323] flex-1">
            [{item.category}] {item.question}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          {/* 수정|삭제 버튼 (권한이 있을 때만 표시) */}
          {showActions && (
            <>
              <TouchableOpacity onPress={onEdit}>
                <Text className="h8 text-gray-500">수정</Text>
              </TouchableOpacity>
              <Text className="h8 text-gray-500">|</Text>
              <TouchableOpacity onPress={onDelete}>
                <Text className="h8 text-gray-500">삭제</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={onPress}>
            <Text className="text-[20px] text-[#232323]">
              {isOpen ? <UpIcon /> : <DownIcon />}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isOpen && (
        <View className="bg-[#F4F7FF] border-t border-t-[#DAE1FF] p-4 flex-row">
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
