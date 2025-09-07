// components/ToggleSwitch.tsx
import React from 'react';
import { View, Text, Switch } from 'react-native';

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
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#CACACA', true: '#007AFF' }}
      thumbColor="#fff"
    />
  );

  if (!label) return SwitchOnly;

  return (
    <View className={containerClassName}>
      <View className="flex-row items-center justify-between">
        <Text className={labelClassName}>{label}</Text>
        {SwitchOnly}
      </View>
      {description ? <Text className={descriptionClassName}>{description}</Text> : null}
    </View>
  );
}
