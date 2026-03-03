import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type FeedEmptyStateProps = {
  hasFriends: boolean;
  onAddFriends: () => void;
};

export function FeedEmptyState({
  hasFriends,
  onAddFriends,
}: FeedEmptyStateProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;

  return (
    <View className="flex-1 items-center justify-center py-20">
      <View
        className={`w-16 h-16 rounded-full ${c.mutedBg} items-center justify-center mb-4`}
      >
        <Feather
          name={hasFriends ? "clock" : "users"}
          size={28}
          color={theme.colors.textSub}
        />
      </View>

      <Text className={`${c.textMain} text-lg font-bold mb-2 text-center`}>
        {hasFriends
          ? "아직 친구들의 활동이 없어요"
          : "친구를 추가해보세요!"}
      </Text>

      <Text className={`${c.textSub} text-sm text-center mb-6 px-8`}>
        {hasFriends
          ? "친구들이 루틴을 완료하면\n여기에 표시돼요"
          : "친구를 추가하고\n서로의 갓생을 응원해보세요"}
      </Text>

      {!hasFriends && (
        <TouchableOpacity
          onPress={onAddFriends}
          className={`${c.primaryBg} px-6 py-3 rounded-full`}
        >
          <Text className="text-white font-bold">친구 추가하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
