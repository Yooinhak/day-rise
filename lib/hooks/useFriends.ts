import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

// ─── Types ───────────────────────────────────────────────────────

export type FriendWithProfile = {
  friendshipId: string;
  friendId: string;
  displayName: string;
  avatarUrl: string | null;
  email: string;
};

export type PendingRequest = {
  id: string;
  requester: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    email: string;
  };
  created_at: string;
};

// ─── Fetch Functions ─────────────────────────────────────────────

async function fetchFriends(): Promise<FriendWithProfile[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
      id,
      requester_id,
      addressee_id,
      requester:profiles!friendships_requester_id_fkey (id, display_name, avatar_url, email),
      addressee:profiles!friendships_addressee_id_fkey (id, display_name, avatar_url, email)
    `,
    )
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  if (error) throw error;

  return (data ?? []).map((f: any) => {
    const isRequester = f.requester_id === user.id;
    const friend = isRequester ? f.addressee : f.requester;
    return {
      friendshipId: f.id,
      friendId: friend.id,
      displayName: friend.display_name,
      avatarUrl: friend.avatar_url,
      email: friend.email,
    };
  });
}

async function fetchPendingRequests(): Promise<PendingRequest[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
      id,
      created_at,
      requester:profiles!friendships_requester_id_fkey (id, display_name, avatar_url, email)
    `,
    )
    .eq("addressee_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((d: any) => ({
    id: d.id,
    requester: d.requester,
    created_at: d.created_at,
  }));
}

async function fetchPendingRequestCount(): Promise<number> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from("friendships")
    .select("*", { count: "exact", head: true })
    .eq("addressee_id", user.id)
    .eq("status", "pending");

  if (error) return 0;
  return count ?? 0;
}

async function searchUserByEmail(email: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("email", email.trim().toLowerCase())
    .neq("id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ─── Main Hook ───────────────────────────────────────────────────

export function useFriends() {
  const queryClient = useQueryClient();

  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  const pendingQuery = useQuery({
    queryKey: ["friend-requests"],
    queryFn: fetchPendingRequests,
  });

  const pendingCountQuery = useQuery({
    queryKey: ["pending-request-count"],
    queryFn: fetchPendingRequestCount,
    staleTime: 30 * 1000,
  });

  const sendRequest = useMutation({
    mutationFn: async (addresseeId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      // 이미 친구이거나 요청 보낸 상태인지 확인
      const { data: existing } = await supabase
        .from("friendships")
        .select("id, status")
        .or(
          `and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`,
        )
        .limit(1)
        .maybeSingle();

      if (existing) {
        if (existing.status === "accepted") {
          throw { code: "ALREADY_FRIENDS" };
        }
        if (existing.status === "pending") {
          throw { code: "ALREADY_PENDING" };
        }
      }

      const { error } = await supabase.from("friendships").insert({
        requester_id: user.id,
        addressee_id: addresseeId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["pending-request-count"] });
      Alert.alert("완료", "친구 요청을 보냈어요!");
    },
    onError: (error: any) => {
      if (error.code === "ALREADY_FRIENDS") {
        Alert.alert("알림", "이미 친구예요!");
      } else if (error.code === "ALREADY_PENDING") {
        Alert.alert("알림", "이미 친구 요청을 보냈어요.");
      } else if (error.code === "23505") {
        Alert.alert("알림", "이미 친구 요청을 보냈어요.");
      } else {
        Alert.alert("오류", "친구 요청 중 문제가 발생했습니다.");
      }
    },
  });

  const respondRequest = useMutation({
    mutationFn: async ({
      friendshipId,
      accept,
    }: {
      friendshipId: string;
      accept: boolean;
    }) => {
      if (accept) {
        const { error } = await supabase
          .from("friendships")
          .update({
            status: "accepted" as any,
            updated_at: new Date().toISOString(),
          })
          .eq("id", friendshipId);
        if (error) throw error;
      } else {
        // 거절 시 삭제
        const { error } = await supabase
          .from("friendships")
          .delete()
          .eq("id", friendshipId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["pending-request-count"] });
      queryClient.invalidateQueries({ queryKey: ["friend-feed"] });
    },
    onError: () => {
      Alert.alert("오류", "요청 처리 중 문제가 발생했습니다.");
    },
  });

  const removeFriend = useMutation({
    mutationFn: async (friendshipId: string) => {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-feed"] });
    },
    onError: () => {
      Alert.alert("오류", "친구 삭제 중 문제가 발생했습니다.");
    },
  });

  return {
    friends: friendsQuery.data ?? [],
    friendsLoading: friendsQuery.isLoading,
    pendingRequests: pendingQuery.data ?? [],
    pendingLoading: pendingQuery.isLoading,
    pendingCount: pendingCountQuery.data ?? 0,
    sendRequest: sendRequest.mutate,
    sendingRequest: sendRequest.isPending,
    respondRequest: respondRequest.mutate,
    removeFriend: removeFriend.mutate,
    refetchAll: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["pending-request-count"] });
    },
  };
}

// ─── Search Hook ─────────────────────────────────────────────────

export function useFriendSearch(email: string) {
  return useQuery({
    queryKey: ["friend-search", email],
    queryFn: () => searchUserByEmail(email),
    enabled: email.length >= 3 && email.includes("@"),
    staleTime: 60 * 1000,
  });
}
