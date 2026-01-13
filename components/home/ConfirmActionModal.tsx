import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/components/theme/AppThemeProvider";

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
  const { theme } = useAppTheme();
  const c = theme.classes;
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View
          className={`w-full rounded-3xl ${c.card} border ${c.borderSoft} p-6`}
        >
          <Text className={`${c.textMain} text-lg font-bold mb-2`}>
            {headline}
          </Text>
          <Text className={`${c.textSub} text-sm`}>{title}</Text>
          {detail ? (
            <Text className={`${c.textSub} text-xs mt-2 mb-6`}>{detail}</Text>
          ) : (
            <View className="mb-6" />
          )}
          <View className="flex-row items-center justify-end">
            <TouchableOpacity
              onPress={onClose}
              className={`px-4 py-2 rounded-full ${c.mutedBg} border ${c.borderSoft} mr-2`}
            >
              <Text className={`${c.textSub} font-medium`}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`px-4 py-2 rounded-full ${c.primaryBg}`}
            >
              <Text className="text-white font-semibold">{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
