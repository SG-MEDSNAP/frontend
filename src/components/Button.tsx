import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

export type ButtonType = 'primary' | 'secondary' | 'third';
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
    primary: 'bg-[#597AFF]',
    secondary: 'bg-transparent border border-[#597AFF]',
    third: 'bg-white',
  };

  const textColorMap: Record<ButtonType, string> = {
    primary: 'text-white',
    secondary: 'text-[#597AFF]',
    third: 'text-[#333333]',
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
