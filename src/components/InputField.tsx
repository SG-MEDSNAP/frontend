// InputField.tsx
import { View, Text } from 'react-native';

export function InputField({
  label,
  helpText,
  error,
  right,
  children,
}: {
  label?: string;
  helpText?: string;
  error?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const border = error ? 'border-[#FF5B6B]' : 'border-[#D7E0FF]';
  const hasHeader = !!label || !!right;
  const hasBottom = !!error || !!helpText;

  return (
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

      <View
        className={`py-[20px] px-[16px] rounded-[16px] min-h-[60px] border ${border} justify-center android:py-1`}
      >
        {children}
      </View>

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
