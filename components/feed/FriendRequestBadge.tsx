import { Text, View } from "react-native";

type FriendRequestBadgeProps = {
  count: number;
};

export function FriendRequestBadge({ count }: FriendRequestBadgeProps) {
  if (count <= 0) return null;

  return (
    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
      <Text className="text-white text-[10px] font-bold">
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
}
