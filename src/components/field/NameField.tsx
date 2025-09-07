import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native';
import { InputField } from '../InputField';
import type { MedicationForm } from '../../schemas/medication';

export function NameField({ control }: { control: Control<MedicationForm> }) {
  return (
    <Controller
      control={control}
      name="name"
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <InputField label="어떤 약을 드시나요?" error={error?.message}>
          <TextInput
            value={value ?? ''} // 안전장치: undefined 방지
            onChangeText={(t) => {
              const noDigits = t.replace(/[0-9０-９]/g, '');
              onChange(noDigits.slice(0, 15)); // 길이 제한
            }}
            onBlur={onBlur}
            placeholder="혈압약"
            className="text-[20px] text-[#99979C] font-semibold"
           
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
