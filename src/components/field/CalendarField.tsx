import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native';
import { InputField } from '../InputField';

export function CalendarField({
  control,
  name = 'birth',
  label = '생년월일',
}: {
  control: Control<any>;
  name?: string;
  label?: string;
}) {
  return (
    <Controller
      control={control}
      name={name as any}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <InputField type="calendar" label={label} error={error?.message}>
          <TextInput
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={(t) => {
              // 숫자만 남기고 YYYY.MM.DD 로 포맷
              const d = t.replace(/\D/g, '').slice(0, 8);
              let f = d;
              if (d.length >= 8)
                f = `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
              else if (d.length >= 6)
                f = `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`;
              else if (d.length >= 4) f = `${d.slice(0, 4)}.${d.slice(4)}`;
              onChange(f);
            }}
            placeholder="년.월.일"
            keyboardType="number-pad"
            className="text-[20px] text-[#000000] font-semibold"
            placeholderTextColor="#99979C"
            maxLength={10}
          />
        </InputField>
      )}
    />
  );
}

