import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native';
import { InputField } from '../InputField';

export function PhoneField({
  control,
  withInnerLabel = false, // 헤더에서 라벨/토글을 쓰므로 기본 false
}: {
  control: Control<any>;
  withInnerLabel?: boolean;
}) {
  return (
    <Controller
      control={control}
      name="caregiverPhone"
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputField
          type="default"
          label={withInnerLabel ? '보호자 문자 수신(결과 전송)' : undefined}
          error={error?.message}
        >
          <TextInput
            keyboardType="phone-pad"
            placeholder="010-0000-0000"
            value={value ?? ''}
            onChangeText={(t) => {
              // 숫자만 남기고 ###-####-#### 로 가벼운 포맷
              const d = t.replace(/\D/g, '').slice(0, 11);
              let f = d;
              if (d.length >= 11)
                f = `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
              else if (d.length >= 7)
                f = `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
              onChange(f);
            }}
            className="text-[20px] text-[#000000] font-semibold"
            placeholderTextColor="#99979C" // ← 요구 색상
          />
        </InputField>
      )}
    />
  );
}
