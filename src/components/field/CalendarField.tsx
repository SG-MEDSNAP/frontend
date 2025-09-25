import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native';
import React from 'react';
import { InputField } from '../InputField';
import { isValidBirthYYYYMMDD } from '../../lib/validate';

export function CalendarField({
  control,
  name = 'birth',
  label = '생년월일',
}: {
  control: Control<any>;
  name?: string;
  label?: string;
}) {
  const prevFormattedRef = React.useRef<string>('');
  const prevDigitsRef = React.useRef<string>('');
  return (
    <Controller
      control={control}
      name={name as any}
      rules={{
        required: '생년월일을 입력해 주세요.',
        validate: (v) =>
          isValidBirthYYYYMMDD(v || '') ||
          '유효한 생년월일(YYYY.MM.DD) 형식이 아닙니다.',
      }}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <InputField type="calendar" label={label} error={error?.message}>
          <TextInput
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={(t) => {
              const prevFormatted = prevFormattedRef.current || '';
              const prevDigits = prevDigitsRef.current || '';

              // 현재 입력에서 숫자만 추출 (최대 8자리)
              let digits = t.replace(/\D/g, '').slice(0, 8);

              // 사용자가 점(.)에서 백스페이스한 경우: 숫자 갯수는 그대로이므로 이전 숫자에서 1자리 줄여준다
              const deleting = t.length < prevFormatted.length;
              if (
                deleting &&
                digits.length === prevDigits.length &&
                prevDigits.length > 0
              ) {
                digits = prevDigits.slice(0, -1);
              }

              // 숫자를 화면용 포맷으로 변환
              let f = digits;
              if (digits.length >= 8)
                f = `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}`;
              else if (digits.length >= 6)
                f = `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
              else if (digits.length >= 4)
                f = `${digits.slice(0, 4)}.${digits.slice(4)}`;

              prevFormattedRef.current = f;
              prevDigitsRef.current = digits;
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
