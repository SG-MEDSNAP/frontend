import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

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
  // 유지 호환: 기존 호출부에서 style/textStyle을 넘겨도 동작
  style?: any;
  textStyle?: any;
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
    sm: 'h-[48px]',
    md: 'h-[52px]',
    lg: 'h-[60px]',
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
    disabled ? 'opacity-60' : '',
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
      activeOpacity={0.8}
      style={style}
    >
      <Text className={labelClass} style={textStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
