import { Modal, Pressable, Text, View } from 'react-native';
import HeaderLogo from '../../assets/images/header_logo.svg';
import Button from './Button';

type CustomModalProps = {
  visible: boolean;
  title?: string; // 첫 줄 굵은 제목 (예: "정말로,")
  description?: string; // 둘째 줄 본문 (예: "삭제 하시겠습니까?")
  confirmText?: string; // 기본: "확인"
  cancelText?: string; // 기본: "닫기"
  onConfirm?: () => void;
  onCancel?: () => void;
  disableBackdropClose?: boolean; // 바깥 영역 탭 닫기 방지
};

export default function CustomModal({
  visible,
  title = '',
  description = '',
  confirmText = '확인',
  cancelText = '닫기',
  onConfirm,
  onCancel,
  disableBackdropClose = false,
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
          <View className="h-[1px] bg-[#DAE1FF]" />

          {/* Body */}
          <View className="px-6 py-8 items-center gap-2">
            {!!title && (
              <Text className="text-[24px]/[34px] font-bold text-[#232323]">
                {title}
              </Text>
            )}
            {!!description && (
              <Text className="text-[24px]/[34px] font-bold text-[#232323]">
                {description}
              </Text>
            )}
          </View>

          {/* Footer Buttons */}
          <View className="m-4">
            <View className="flex-row gap-4">
              <Button
                className="flex-[5]"
                title="확인"
                type="primary"
                size="md"
                onPress={onConfirm}
              />
              <Button
                className="flex-[2]"
                title="닫기"
                type="quinary"
                size="md"
                onPress={onCancel}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
