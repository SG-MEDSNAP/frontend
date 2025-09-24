import { Controller, Control } from 'react-hook-form';
import { TextInput } from 'react-native';
import { InputField } from '../InputField';
import { isKoreanEnglishName } from '../../lib/validate';

export function PersonNameField({ control }: { control: Control<any> }) {
  return (
    <Controller
      control={control}
      name="name"
      rules={{
        required: '이름을 입력해 주세요.',
        validate: (v) =>
          isKoreanEnglishName(v || '') || '이름은 한글/영문, 최대 15자입니다.',
      }}
      render={({
        field: { onChange, value, onBlur },
        fieldState: { error },
      }) => (
        <InputField type="default" label="이름" error={error?.message}>
          <TextInput
            value={value ?? ''}
            onChangeText={(t) => {
              // 입력 중 조합 문자 문제 방지를 위해 필터링하지 않고
              // 연속 공백만 정리 + 길이 제한만 적용
              const cleaned = t.replace(/\s{2,}/g, ' ').slice(0, 15);
              onChange(cleaned);
            }}
            onBlur={onBlur}
            placeholder="이름 입력"
            className="body-lg text-[#232323]"
            placeholderTextColor="#99979C"
            autoCapitalize="words"
            autoCorrect={false}
            keyboardType="default"
            inputMode="text"
            maxLength={15}
          />
        </InputField>
      )}
    />
  );
}
