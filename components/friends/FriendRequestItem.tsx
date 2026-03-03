import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { PendingRequest } from "@/lib/hooks/useFriends";
import { Feather } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type FriendRequestItemProps = {
  request: PendingRequest;
  onAccept: () => void;
  onReject: () => void;
};

export function FriendRequestItem({
  request,
  onAccept,
  onReject,
}: FriendRequestItemProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;

  return (
    <View
      className={`${c.card} p-4 rounded-2xl border ${c.borderSoft} mb-3 flex-row items-center`}
    >
      {request.requester.avatar_url ? (
        <Image
          source={{ uri: request.requester.avatar_url }}
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
          {request.requester.display_name}
        </Text>
        <Text className={`${c.textSub} text-xs`}>
          {request.requester.email}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={onAccept}
          className={`px-3 py-1.5 rounded-full ${c.primaryBg}`}
        >
          <Text className="text-white text-xs font-medium">수락</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onReject}
          className={`px-3 py-1.5 rounded-full ${c.mutedBg} border ${c.borderSoft}`}
        >
          <Text className={`${c.textSub} text-xs font-medium`}>거절</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
