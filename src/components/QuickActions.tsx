import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ActionButtonProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  backgroundColor?: string;
}

function ActionButton({
  title,
  subtitle,
  icon,
  onPress,
  backgroundColor = '#597AFF',
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 mx-1 rounded-[16px] p-4 items-center justify-center min-h-[100px] pressed:opacity-80"
      style={{ backgroundColor }}
    >
      <Text className="text-[24px] mb-2">{icon}</Text>
      <Text className="text-white text-[16px] font-bold mb-1 text-center">
        {title}
      </Text>
      <Text className="text-white/80 text-[12px] text-center">{subtitle}</Text>
    </Pressable>
  );
}

interface QuickActionsProps {
  onRegisterPress: () => void;
  onHistoryPress: () => void;
  onSettingsPress: () => void;
  onReportPress: () => void;
}

export default function QuickActions({
  onRegisterPress,
  onHistoryPress,
  onSettingsPress,
  onReportPress,
}: QuickActionsProps) {
  return (
    <View className="mb-6">
      <Text className="text-[20px] font-bold text-[#333] mb-4">빠른 메뉴</Text>

      <View className="flex-row mb-3">
        <ActionButton
          title="약 등록"
          subtitle="새로운 약물 추가"
          icon="💊"
          onPress={onRegisterPress}
          backgroundColor="#597AFF"
        />
        <ActionButton
          title="복용 기록"
          subtitle="복용 히스토리 확인"
          icon="📋"
          onPress={onHistoryPress}
          backgroundColor="#34C759"
        />
      </View>

      <View className="flex-row">
        <ActionButton
          title="리포트"
          subtitle="복용 통계 보기"
          icon="📊"
          onPress={onReportPress}
          backgroundColor="#FF9500"
        />
        <ActionButton
          title="설정"
          subtitle="알림 및 계정 관리"
          icon="⚙️"
          onPress={onSettingsPress}
          backgroundColor="#8E8E93"
        />
      </View>
    </View>
  );
}
