// QnaField.tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
// import { Icon } from './Icon';

export default function InputField({
  type,
  error,
  right,
}: {
  type?: 'question' | 'answer';
  error?: string;
  right?: React.ReactNode;
}) {
  const label =
    type === 'question' ? '질문' : type === 'answer' ? '답변' : undefined;

  const border = error ? 'border-[#FF5B6B]' : 'border-[#D7E0FF]';
  const hasHeader = !!label || !!right;
  // const hasBottom = !!error || !!helpText;
  const [height, setHeight] = useState(0);

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
        className={`py-3 px-4 rounded-[16px] bg-white min-h-[48px] justify-start border ${border}  flex-row`}
      >
        <View className="flex-1">
          <TextInput
            onContentSizeChange={(e) => {
              setHeight(e.nativeEvent.contentSize.height);
            }}
            style={{
              height: Math.max(35, height), // 최소 높이를 보장
              textAlignVertical: 'top', // 커서가 항상 위에서 시작하도록 설정
            }}
            className="text-[20px] font-semibold text-[#232323]"
            keyboardType="default"
            placeholder={type === 'question' ? '질문 입력' : '답변 입력'}
            multiline
            placeholderTextColor="#888888"
            maxLength={type === 'question' ? 100 : 200}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>
    </View>
  );
}
