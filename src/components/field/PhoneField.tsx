import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native';
import { InputField } from '../InputField';
import { isValidKoreanMobile } from '../../lib/validate';

export function PhoneField({
  control,
  withInnerLabel = false,
  name = 'phone',
  label,
  requiredField = true,
}: {
  control: Control<any>;
  withInnerLabel?: boolean;
  name?: string;
  label?: string;
  requiredField?: boolean;
}) {
  return (
    <Controller
      control={control}
      name={name as any}
      rules={{
        required: requiredField
          ? `${label ?? '핸드폰 번호'}를 입력해 주세요.`
          : false,
        validate: (v) =>
          (!v && !requiredField) ||
          isValidKoreanMobile(v || '') ||
          '유효한 전화번호 형식이 아닙니다.',
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <InputField
          type="default"
          label={
            label ??
            (withInnerLabel ? '보호자 문자 수신(결과 전송)' : undefined)
          }
          error={error?.message}
        >
          <TextInput
            keyboardType="phone-pad"
            placeholder="010-0000-0000"
            value={value ?? ''}
            onChangeText={(t) => {
              // 자연스러운 삭제/입력을 위해 숫자 상태를 기준으로 포맷팅
              // 이전 숫자 길이와 비교하여 '-' 지점 삭제도 한 자리 줄어들게 처리
              const prevDigits = (value || '').replace(/\D/g, '');
              let digits = t.replace(/\D/g, '').slice(0, 11);
              const deleting = t.length < (value || '').length;
              if (
                deleting &&
                digits.length === prevDigits.length &&
                prevDigits.length > 0
              ) {
                digits = prevDigits.slice(0, -1);
              }
              let f = digits;
              if (digits.length >= 11)
                f = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
              else if (digits.length >= 7)
                f = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
              else if (digits.length >= 3)
                f = `${digits.slice(0, 3)}-${digits.slice(3)}`;
              onChange(f);
            }}
            className="body-lg text-[#000000]"
            placeholderTextColor="#99979C" // ← 요구 색상
          />
        </InputField>
      )}
    />
  );
}
