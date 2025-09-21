// InputField.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';

export type InputFieldType = 'default' | 'search' | 'calendar' | 'add';

export function InputField({
  label,
  helpText,
  error,
  right,
  children,
  type = 'default',
  onPress,
}: {
  label?: string;
  helpText?: string;
  error?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  type?: InputFieldType;
  onPress?: () => void;
}) {
  const border = error ? 'border-[#FF5B6B]' : 'border-[#D7E0FF]';
  const hasHeader = !!label || !!right;
  // const hasBottom = !!error || !!helpText;

  return (
    // CLS에 영향을 줘서 임시로 조건 제거
    // <View className={hasBottom ? 'gap-2' : ''}>
    <View>
      {/* 헤더가 있을 때만 렌더, 라벨↔인풋 8px = mb-2 */}
      {hasHeader && (
        <View className="flex-row justify-between items-center mb-2">
          {label ? (
            <Text className="text-[18px]/[26px] font-semibold text-[#232323]">
              {label}
            </Text>
          ) : (
            <View />
          )}
          {right}
        </View>
      )}

      {/* 타입별 아이콘과 렌더링 */}
      {type === 'add' && onPress ? (
        <TouchableOpacity
          onPress={onPress}
          className={`py-1 px-4 rounded-[16px] min-h-[60px] border ${border} justify-center flex-row items-center`}
        >
          <View className="flex-1">{children}</View>
          <Icon name="plus" size={24} color="#597AFF" />
        </TouchableOpacity>
      ) : (
        <View
          className={`py-1 px-4 rounded-[16px] min-h-[60px] border ${border} justify-center flex-row items-center`}
        >
          <View className="flex-1">{children}</View>
          {type === 'search' && <Icon name="search" size={24} />}
          {type === 'calendar' && <Icon name="calendar" size={24} />}
        </View>
      )}

      {/* 오류 메시지를 위한 고정 높이 영역 */}
      <View className="h-[20px] mt-2">
        {error ? (
          <Text className="text-[12px] text-[#FF5B6B]">{error}</Text>
        ) : helpText ? (
          <Text className="text-[18px] text-[#999999]">{helpText}</Text>
        ) : null}
      </View>
    </View>
  );
}
