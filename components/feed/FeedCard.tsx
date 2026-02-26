import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { FeedEntry } from "@/lib/hooks/useFriendFeed";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Image, Text, TouchableOpacity, View } from "react-native";

type FeedCardProps = {
  entry: FeedEntry;
  onCheer: () => void;
};

export function FeedCard({ entry, onCheer }: FeedCardProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;

  const timeAgo = formatDistanceToNow(new Date(entry.completed_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <View
      className={`${c.card} p-5 rounded-2xl mb-4 border ${c.borderSoft}`}
    >
      {/* Header: Avatar + Name + Time */}
      <View className="flex-row items-center mb-3">
        {entry.avatar_url ? (
          <Image
            source={{ uri: entry.avatar_url }}
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
            {entry.display_name}
          </Text>
          <Text className={`${c.textSub} text-xs`}>{timeAgo}</Text>
        </View>
      </View>

      {/* Content */}
      <Text className={`${c.textMain} mb-4`}>
        <Text className="font-bold">{entry.routine_title}</Text>
        {"을(를) 완료했어요!"}
      </Text>

      {/* Footer: Cheer button */}
      <View className={`flex-row border-t ${c.borderSoft} pt-3`}>
        <TouchableOpacity
          onPress={onCheer}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Feather
            name="heart"
            size={18}
            color={
              entry.has_cheered ? theme.colors.primary : theme.colors.textSub
            }
          />
          <Text
            className={`text-xs ml-1.5 font-medium ${
              entry.has_cheered ? c.primaryText : c.textSub
            }`}
          >
            응원{entry.cheer_count > 0 ? ` ${entry.cheer_count}` : "하기"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
