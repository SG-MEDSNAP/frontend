// components/ToggleSwitch.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

interface ToggleSwitchProps {
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: React.ReactNode;
  labelClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string; // 부모가 간격 관리
}

export default function ToggleSwitch({
  label,
  value,
  onValueChange,
  description,
  labelClassName = 'text-[18px] font-semibold text-[#404040]',
  descriptionClassName = 'text-[18px] text-[#999999] mt-2 font-semibold',
  containerClassName = '',
}: ToggleSwitchProps) {
  const SwitchOnly = (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={{
        width: 48,
        height: 24,
        borderRadius: 12,
        backgroundColor: value ? '#597AFF' : '#c2c2c2',
        justifyContent: 'center',
        paddingHorizontal: 2,
      }}
      activeOpacity={0.8}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: 'white',
          marginLeft: value ? 24 : 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
        }}
      />
    </TouchableOpacity>
  );

  if (!label) return SwitchOnly;

  return (
    <View className={containerClassName}>
      <View className="flex-row items-center justify-between">
        <Text className={labelClassName}>{label}</Text>
        {SwitchOnly}
      </View>
      {description ? (
        <Text className={descriptionClassName}>{description}</Text>
      ) : null}
    </View>
  );
}
