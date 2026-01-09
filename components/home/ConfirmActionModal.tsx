import { Modal, Text, TouchableOpacity, View } from "react-native";

type ConfirmActionModalProps = {
  visible: boolean;
  headline: string;
  title: string;
  detail?: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmActionModal({
  visible,
  headline,
  title,
  detail,
  confirmLabel,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-3xl bg-card border border-border-soft p-6">
          <Text className="text-text-main text-lg font-bold mb-2">
            {headline}
          </Text>
          <Text className="text-text-sub text-sm">{title}</Text>
          {detail ? (
            <Text className="text-text-sub text-xs mt-2 mb-6">{detail}</Text>
          ) : (
            <View className="mb-6" />
          )}
          <View className="flex-row items-center justify-end">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 rounded-full bg-muted border border-border-soft mr-2"
            >
              <Text className="text-text-sub font-medium">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="px-4 py-2 rounded-full bg-primary"
            >
              <Text className="text-white font-semibold">{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
