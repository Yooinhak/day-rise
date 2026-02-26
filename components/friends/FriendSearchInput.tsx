import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { useFriendSearch } from "@/lib/hooks/useFriends";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FriendSearchInputProps = {
  onSendRequest: (userId: string) => void;
  isSending: boolean;
};

export function FriendSearchInput({
  onSendRequest,
  isSending,
}: FriendSearchInputProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const [email, setEmail] = useState("");
  const { data: result, isLoading } = useFriendSearch(email);

  return (
    <View>
      {/* Search Input */}
      <View
        className={`flex-row items-center ${c.card} border ${c.borderSoft} rounded-2xl px-4 py-3`}
      >
        <Feather name="search" size={18} color={theme.colors.textSub} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="친구의 이메일을 입력하세요"
          placeholderTextColor={theme.colors.textSub}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className={`flex-1 ml-3 ${c.textMain} text-sm`}
          style={{ color: theme.colors.textMain }}
        />
        {email.length > 0 && (
          <TouchableOpacity onPress={() => setEmail("")}>
            <Feather name="x" size={18} color={theme.colors.textSub} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Result */}
      {isLoading && (
        <View className="items-center py-4">
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      )}

      {!isLoading && result && (
        <View
          className={`${c.card} p-4 rounded-2xl border ${c.borderSoft} mt-3 flex-row items-center`}
        >
          {result.avatar_url ? (
            <Image
              source={{ uri: result.avatar_url }}
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
              {result.display_name}
            </Text>
            <Text className={`${c.textSub} text-xs`}>{result.email}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onSendRequest(result.id)}
            disabled={isSending}
            className={`px-4 py-2 rounded-full ${c.primaryBg}`}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-xs font-bold">요청</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {!isLoading &&
        !result &&
        email.length >= 3 &&
        email.includes("@") && (
          <View className="items-center py-4">
            <Text className={`${c.textSub} text-sm`}>
              해당 이메일의 사용자를 찾을 수 없어요
            </Text>
          </View>
        )}
    </View>
  );
}
