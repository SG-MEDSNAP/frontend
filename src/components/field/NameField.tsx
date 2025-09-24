import { Controller, Control } from 'react-hook-form';
import { TextInput, StyleSheet } from 'react-native';
import { InputField } from '../InputField';

export function NameField({ control }: { control: Control<any> }) {
  return (
    <Controller
      control={control}
      name="name"
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <InputField
          type="default"
          label="어떤 약을 드시나요?"
          error={error?.message}
        >
          <TextInput
            value={value ?? ''} // 안전장치: undefined 방지
            onChangeText={(t) => {
              const noDigits = t.replace(/[0-9０-９]/g, '');
              onChange(noDigits.slice(0, 15)); // 길이 제한
            }}
            onBlur={onBlur}
            placeholder="혈압약"
            className="text-[#232323] text-[20px] font-semibold"
            placeholderTextColor="#99979C"
            maxLength={15}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
            inputMode="text"
          />
        </InputField>
      )}
    />
  );
}
