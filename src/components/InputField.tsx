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
  const border = error ? 'border-[#FF5B6B]' : 'border-[#D7E0FF]';
  return (
    <View className="gap-2">
    <View className="gap-4">
      <View className="flex-row justify-between items-center ">
        <Text className="text-[18px] font-semibold text-[#404040]">
          {label}
        </Text>
        {right}
      </View>
      <View className={`py-[20px] px-[16px] rounded-[16px] min-h-[60px] border ${border} justify-center `}>
        {children}
        </View>
        
      </View>
      {error ? (
        <Text className=" text-[12px] text-[#FF5B6B]">{error}</Text>
      ) : helpText ? (
        <Text className=" text-[20px] text-[#99979C] font-semibold">{helpText}</Text>
      ) : null}
      </View>
   
  );
}
