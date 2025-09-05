import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  // LeftIcon,
  // RightIcon,
  // onPressLeft,
  // onPressRight,
}) => {
  return (
    <View className="h-[60px] w-full flex-row items-center justify-between px-4 bg-white border-b border-gray-200">
      {/* 좌측 아이콘 영역 */}
      <TouchableOpacity
        // onPress={onPressLeft}
        className="w-[36px] h-[36px] items-center justify-center"
      >
        <Text>Left</Text>
        {/* {LeftIcon ? <LeftIcon /> : null} */}
      </TouchableOpacity>

      {/* 중앙 제목 */}
      <Text className="text-lg font-bold text-black">{title}</Text>

      {/* 우측 아이콘 영역 */}
      <TouchableOpacity
        // onPress={onPressRight}
        className="w-[36px] h-[36px] items-center justify-center"
      >
        <Text>Right</Text>
        {/* {RightIcon ? <RightIcon /> : null} */}
      </TouchableOpacity>
    </View>
  );
};

export default NavigationHeader;
