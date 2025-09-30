import { Modal, Pressable, Text, View } from 'react-native';
import HeaderLogo from '../../assets/images/header_logo.svg';
import Button from './Button';

type CustomModalProps = {
  visible: boolean;
  line1?: string; // 첫 줄 (예: "정말로,")
  line2?: string; // 둘째 줄 (예: "삭제 하시겠습니까?")
  line3?: string; // 셋째 줄
  confirmText?: string; // 기본: "확인"
  cancelText?: string; // 기본: "닫기"
  onConfirm?: () => void;
  onCancel?: () => void;
  disableBackdropClose?: boolean; // 바깥 영역 탭 닫기 방지
  children?: React.ReactNode; // 추가 컨텐츠
};

export default function CustomModal({
  visible,
  line1 = '',
  line2 = '',
  line3 = '',
  confirmText = '확인',
  cancelText = '닫기',
  onConfirm,
  onCancel,
  disableBackdropClose = false,
  children,
}: CustomModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        {/* Backdrop close */}
        <Pressable
          className="absolute inset-0"
          onPress={disableBackdropClose ? undefined : onCancel}
          android_ripple={{ color: 'transparent' }}
        />

        <View className="w-full rounded-3xl bg-[#F4F7FF] overflow-hidden">
          {/* Header */}
          <View className="items-center py-6 bg-[#F4F7FF]">
            <HeaderLogo />
          </View>
          <View className="mx-[18px] h-[1px] bg-[#BDCBFF]" />

          {/* Body */}
          <View className="px-6 py-8 items-center gap-2">
            {!!line1 && (
              <Text className="text-[24px]/[34px] font-bold text-[#232323]">
                {line1}
              </Text>
            )}
            {!!line2 && (
              <Text className="text-[24px]/[34px] font-bold text-[#232323]">
                {line2}
              </Text>
            )}
            {!!line3 && (
              <Text className="text-[24px]/[34px] font-bold text-[#232323]">
                {line3}
              </Text>
            )}
            {children}
          </View>

          {/* Footer Buttons: onCancel 유무에 따라 1개 또는 2개의 버튼을 렌더링 */}
          <View className="m-4">
            <View className="flex-row gap-4">
              <Button
                className={onCancel ? 'flex-[5]' : 'flex-1'}
                title={confirmText}
                type="primary"
                size="md"
                onPress={onConfirm}
              />
              {onCancel && (
                <Button
                  className="flex-[2]"
                  title={cancelText}
                  type="quinary"
                  size="md"
                  onPress={onCancel}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
