import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function OfflineBanner() {
  const { theme } = useAppTheme();
  return (
    <View
      className="flex-row items-center bg-amber-100 px-4 py-3 rounded-2xl mb-4"
      accessibilityRole="alert"
      accessibilityLabel="인터넷 연결이 끊어졌습니다"
    >
      <Feather name="wifi-off" size={16} color="#92400e" />
      <Text className="text-amber-800 text-sm font-medium ml-2 flex-1">
        오프라인 상태예요. 연결되면 자동으로 동기화됩니다.
      </Text>
    </View>
  );
}
