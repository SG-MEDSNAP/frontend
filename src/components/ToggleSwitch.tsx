// components/ToggleSwitch.tsx
import React from 'react';
import { View, Text, Switch } from 'react-native';

interface ToggleSwitchProps {
  label?: string;                       // ← optional
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

export default function ToggleSwitch({
  label,
  value,
  onValueChange,
  description,
}: ToggleSwitchProps) {
  const SwitchOnly = (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#CACACA', true: '#007AFF' }}
      thumbColor="#fff"
    />
  );

  // 라벨 없으면 스위치만 반환
  if (!label) return SwitchOnly;

  return (
    <View className="mb-7">
      <View className="flex-row items-center justify-between">
        <Text className="text-[16px] font-semibold text-[#333]">{label}</Text>
        {SwitchOnly}
      </View>
      {description && (
        <Text className="text-[12px] text-[#999] mt-2 leading-4">
          {description}
        </Text>
      )}
    </View>
  );
}
