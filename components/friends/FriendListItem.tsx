import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { FriendWithProfile } from "@/lib/hooks/useFriends";
import { Feather } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type FriendListItemProps = {
  friend: FriendWithProfile;
  onRemove: () => void;
};

export function FriendListItem({ friend, onRemove }: FriendListItemProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;

  return (
    <View
      className={`${c.card} p-4 rounded-2xl border ${c.borderSoft} mb-3 flex-row items-center`}
    >
      {friend.avatarUrl ? (
        <Image
          source={{ uri: friend.avatarUrl }}
          className="w-10 h-10 rounded-full mr-3"
        />
      ) : (
        <View
          className={`w-10 h-10 rounded-full ${c.mutedBg} mr-3 items-center justify-center`}
        >
          <Feather name="user" size={18} color={theme.colors.textSub} />
        </View>
      )}

      <View className="flex-1">
        <Text className={`${c.textMain} font-bold`}>
          {friend.displayName}
        </Text>
        <Text className={`${c.textSub} text-xs`}>{friend.email}</Text>
      </View>

      <TouchableOpacity
        onPress={onRemove}
        className={`px-3 py-1.5 rounded-full ${c.mutedBg} border ${c.borderSoft}`}
      >
        <Text className={`${c.textSub} text-xs font-medium`}>삭제</Text>
      </TouchableOpacity>
    </View>
  );
}
