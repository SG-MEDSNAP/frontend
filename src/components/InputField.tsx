// InputField.tsx
import { View, Text } from 'react-native';

export function InputField({
  label,
  helpText,
  error,
  right,
  children,
}: {
  label: string;
  helpText?: string;
  error?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const border = error ? 'border-[#FF5B6B]' : 'border-neutral-200';
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-neutral-700">{label}</Text>
        {right}
      </View>
      <View className={`rounded-2xl bg-white border ${border} px-4 py-3`}>
        {children}
      </View>
      {error ? (
        <Text className="mt-1 text-xs text-[#FF5B6B]">{error}</Text>
      ) : helpText ? (
        <Text className="mt-1 text-xs text-neutral-500">{helpText}</Text>
      ) : null}
    </View>
  );
}
