import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import Button from '../components/Button';
import ToggleSwitch from '../components/ToggleSwitch';
import { NameField } from '../components/field/NameField';
import { PhoneField } from '../components/field/PhoneField';
import { CalendarField } from '../components/field/CalendarField';

type JoinForm = {
  name: string;
  birth: string;
  phone: string;
  caregiverPhone?: string;
  pushAgree: boolean;
};

export default function JoinScreen({ navigation }: any) {
  const { control, watch, setValue } = useForm<JoinForm>({
    defaultValues: {
      name: '',
      birth: '',
      phone: '',
      caregiverPhone: '',
      pushAgree: false,
    },
    mode: 'onChange',
  });

  const name = watch('name');
  const birth = watch('birth');
  const phone = watch('phone');
  const pushAgree = watch('pushAgree');

  const canSubmit = Boolean(name && birth && phone);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <ScrollView className="flex-1 " contentContainerClassName="px-4 pb-6">
        <View className="px-4 pt-6">
          <Text className="h2 text-[#232323]">
            개인정보를{'\n'}입력해주세요
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-[14px] font-semibold text-[#8B8B8B] mb-2">
            이름
          </Text>
          <NameField control={control as any} />
        </View>

        <View className="mt-6">
          <Text className="text-[14px] font-semibold text-[#8B8B8B] mb-2">
            생년월일
          </Text>
          <CalendarField control={control as any} />
        </View>

        <View className="mt-6">
          <Text className="text-[14px] font-semibold text-[#8B8B8B] mb-2">
            핸드폰 번호
          </Text>
          <PhoneField control={control as any} withInnerLabel={false} />
        </View>

        <View className="mt-6">
          <Text className="text-[14px] font-semibold text-[#8B8B8B] mb-2">
            보호자 핸드폰 번호(결과 전송)
          </Text>
          <PhoneField control={control as any} withInnerLabel={false} />
        </View>

        <View className="mt-6">
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
          title="다음"
          type={canSubmit ? 'primary' : 'quaternary'}
          disabled={!canSubmit}
          onPress={() => canSubmit && navigation.navigate('JoinDone')}
        />
      </View>
    </SafeAreaView>
  );
}
