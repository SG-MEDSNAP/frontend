import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import ToggleSwitch from '../components/ToggleSwitch';
import { PersonNameField } from '../components/field/PersonNameField';
import { PhoneField } from '../components/field/PhoneField';
import { CalendarField } from '../components/field/CalendarField';

type EditForm = {
  name: string;
  birth: string;
  phone: string;
  caregiverPhone: string;
  pushAgree: boolean;
};

export default function EditInfoScreen() {
  const { control, watch, setValue, formState } = useForm<EditForm>({
    defaultValues: {
      name: '',
      birth: '',
      phone: '',
      caregiverPhone: '',
      pushAgree: true,
    },
    mode: 'onChange',
  });

  const name = watch('name');
  const birth = watch('birth');
  const phone = watch('phone');
  const pushAgree = watch('pushAgree');

  const canSubmit = formState.isValid && Boolean(name && birth && phone);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white" edges={['bottom']}>
      <ScrollView
        className="flex-1 "
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-[16px] pb-[32px]"
      >
        <View className="mt-8">
          <PersonNameField control={control as any} />
        </View>

        <View className="mt-8">
          <CalendarField control={control as any} label="생년월일" />
        </View>

        <View className="mt-8">
          <PhoneField
            control={control as any}
            name="phone"
            label="핸드폰 번호"
          />
        </View>

        <View className="mt-8">
          <PhoneField
            control={control as any}
            name="caregiverPhone"
            label="보호자 핸드폰 번호(결과 전송)"
            requiredField={false}
          />
        </View>

        <View className="mt-8">
          <ToggleSwitch
            label="앱 알림 동의"
            value={pushAgree}
            onValueChange={(v) =>
              setValue('pushAgree', v, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            description="(설명 문구 필요)"
          />
        </View>
      </ScrollView>

      <View className="px-4 pb-4">
        <Button
          title="수정완료"
          type={canSubmit ? 'primary' : 'quaternary'}
          disabled={!canSubmit}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}
