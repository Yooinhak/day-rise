import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { FriendListItem } from "@/components/friends/FriendListItem";
import { FriendRequestItem } from "@/components/friends/FriendRequestItem";
import { FriendSearchInput } from "@/components/friends/FriendSearchInput";
import { ConfirmActionModal } from "@/components/home/ConfirmActionModal";
import { useFriends } from "@/lib/hooks/useFriends";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FriendsScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const {
    friends,
    friendsLoading,
    pendingRequests,
    pendingLoading,
    sendRequest,
    sendingRequest,
    respondRequest,
    removeFriend,
  } = useFriends();

  const [removeTarget, setRemoveTarget] = useState<{
    friendshipId: string;
    name: string;
  } | null>(null);

  return (
    <ScrollView className={`flex-1 ${c.bg} px-6 pt-12`}>
      {/* Close Button */}
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Feather name="x" size={24} color={theme.colors.textMain} />
      </TouchableOpacity>

      <Text className={`${c.textMain} text-2xl font-bold mb-6`}>
        친구 관리
      </Text>

      {/* Section 1: Search */}
      <View className="mb-8">
        <Text className={`${c.textMain} text-lg font-bold mb-3`}>
          친구 검색
        </Text>
        <FriendSearchInput
          onSendRequest={sendRequest}
          isSending={sendingRequest}
        />
      </View>

      {/* Section 2: Pending Requests */}
      {pendingLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : (
        pendingRequests.length > 0 && (
          <View className="mb-8">
            <Text className={`${c.textMain} text-lg font-bold mb-3`}>
              받은 요청 ({pendingRequests.length})
            </Text>
            {pendingRequests.map((req) => (
              <FriendRequestItem
                key={req.id}
                request={req}
                onAccept={() =>
                  respondRequest({ friendshipId: req.id, accept: true })
                }
                onReject={() =>
                  respondRequest({ friendshipId: req.id, accept: false })
                }
              />
            ))}
          </View>
        )
      )}

      {/* Section 3: Friend List */}
      <View className="mb-24">
        <Text className={`${c.textMain} text-lg font-bold mb-3`}>
          내 친구 ({friends.length})
        </Text>

        {friendsLoading ? (
          <View className="items-center py-4">
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        ) : friends.length === 0 ? (
          <View className="items-center py-8">
            <Text className={`${c.textSub} text-sm`}>
              아직 친구가 없어요. 이메일로 검색해보세요!
            </Text>
          </View>
        ) : (
          friends.map((friend) => (
            <FriendListItem
              key={friend.friendshipId}
              friend={friend}
              onRemove={() =>
                setRemoveTarget({
                  friendshipId: friend.friendshipId,
                  name: friend.displayName,
                })
              }
            />
          ))
        )}
      </View>

      <ConfirmActionModal
        visible={!!removeTarget}
        headline="친구를 삭제하시겠습니까?"
        title={removeTarget?.name ?? ""}
        detail="삭제하면 서로의 피드에서 활동이 보이지 않아요."
        confirmLabel="삭제"
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => {
          if (!removeTarget) return;
          removeFriend(removeTarget.friendshipId);
          setRemoveTarget(null);
        }}
      />
    </ScrollView>
  );
}
