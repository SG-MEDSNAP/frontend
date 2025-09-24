import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Icon } from './Icon';

export type LoginButtonType = 'kakao' | 'naver' | 'google';

interface LoginButtonProps {
  type: LoginButtonType;
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function LoginButton({
  type,
  title,
  onPress,
  disabled = false,
  className,
}: LoginButtonProps) {
  const typeStyleMap: Record<
    LoginButtonType,
    {
      container: string;
      text: string;
      iconColor?: string;
    }
  > = {
    kakao: {
      container: 'bg-[#FEE500]',
      text: 'text-black',
    },
    naver: {
      container: 'bg-[#03C75A]',
      text: 'text-white',
    },
    google: {
      container: 'bg-white border border-gray-200',
      text: 'text-black',
    },
  };

  const style = typeStyleMap[type];

  const containerClass = [
    'w-full h-[60px] rounded-[16px] flex-row items-center px-4',
    style.container,
    disabled ? 'opacity-60' : 'pressed:opacity-80',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <TouchableOpacity
      className={containerClass}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {/* 왼쪽 아이콘 영역 (52x52) */}
      <View className="w-[52px] h-[52px] items-center justify-center">
        <Icon name={type} size={24} />
      </View>

      {/* 텍스트 영역 (가운데 정렬) */}
      <View className="flex-1 items-center">
        <Text className={`text-[20px] font-bold ${style.text}`}>{title}</Text>
      </View>

      {/* 오른쪽 여백 (균형 맞추기) */}
      <View className="w-[52px]" />
    </TouchableOpacity>
  );
}
