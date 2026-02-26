import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { FeedCard } from "@/components/feed/FeedCard";
import { FeedEmptyState } from "@/components/feed/FeedEmptyState";
import { FriendRequestBadge } from "@/components/feed/FriendRequestBadge";
import { useFriendFeed } from "@/lib/hooks/useFriendFeed";
import { useFriends } from "@/lib/hooks/useFriends";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FeedScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const { feed, feedLoading, refetchFeed, toggleCheer } = useFriendFeed();
  const { friends, friendsLoading, pendingCount } = useFriends();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetchFeed();
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLoading = feedLoading || friendsLoading;
  const hasFriends = friends.length > 0;

  return (
    <View className={`flex-1 ${c.bg} px-6 pt-16`}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className={`${c.textMain} text-2xl font-bold`}>
          함께하는 갓생 🤝
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/friends")}
          className="relative"
        >
          <Feather name="users" size={22} color={theme.colors.textMain} />
          <FriendRequestBadge count={pendingCount} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : !hasFriends || feed.length === 0 ? (
        <FeedEmptyState
          hasFriends={hasFriends}
          onAddFriends={() => router.push("/friends")}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.primary}
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          {feed.map((entry) => (
            <FeedCard
              key={entry.log_id}
              entry={entry}
              onCheer={() =>
                toggleCheer({
                  logId: entry.log_id,
                  hasCheered: entry.has_cheered,
                })
              }
            />
          ))}
          <View className="h-24" />
        </ScrollView>
      )}
    </View>
  );
}
