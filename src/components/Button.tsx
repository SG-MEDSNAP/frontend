import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'quaternary';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  type?: ButtonType;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  type = 'primary',
  size = 'md',
  onPress,
  disabled = false,
  className,
  textClassName,
  style,
  textStyle,
}: ButtonProps) {
  const sizeClassMap: Record<ButtonSize, string> = {
    sm: 'h-[48px] px-4',
    md: 'h-[52px] px-5',
    lg: 'h-[60px] px-6',
  };

  const typeClassMap: Record<ButtonType, string> = {
    primary: 'bg-primary-500', // 1. primary-500 (진한 파랑)
    secondary: 'bg-gray-50 border border-primary-500', // 2. 흰배경 + primary-500 테두리
    tertiary: 'bg-primary-100', // 3. primary-100 (연한 파랑)
    quaternary: 'bg-gray-200', // 4. gray-200 (회색)
  };

  const textColorMap: Record<ButtonType, string> = {
    primary: 'text-white', // 흰색 텍스트
    secondary: 'text-primary-500', // primary-500 텍스트
    tertiary: 'text-primary-500', // primary-500 텍스트
    quaternary: 'text-gray-700', // 진한 회색 텍스트
  };

  const containerClass = [
    'rounded-[12px] items-center justify-center',
    sizeClassMap[size],
    typeClassMap[type],
    disabled ? 'opacity-60' : 'pressed:opacity-80', // pressed 상태 클래스
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  const labelClass = [
    'text-[20px] font-bold',
    textColorMap[type],
    textClassName || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <TouchableOpacity
      className={containerClass}
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <Text className={labelClass} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
