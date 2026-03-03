import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

// ─── Types ───────────────────────────────────────────────────────

export type FeedEntry = {
  log_id: string;
  completed_at: string;
  routine_title: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  cheer_count: number;
  has_cheered: boolean;
};

// ─── Fetch Function ──────────────────────────────────────────────

async function fetchFeed(): Promise<FeedEntry[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase.rpc("get_friend_feed", {
    p_user_id: user.id,
    p_limit: 30,
    p_offset: 0,
  });

  if (error) throw error;
  return (data ?? []) as FeedEntry[];
}

// ─── Hook ────────────────────────────────────────────────────────

export function useFriendFeed() {
  const queryClient = useQueryClient();

  const feedQuery = useQuery({
    queryKey: ["friend-feed"],
    queryFn: fetchFeed,
    staleTime: 2 * 60 * 1000,
  });

  const toggleCheer = useMutation({
    mutationFn: async ({
      logId,
      hasCheered,
    }: {
      logId: string;
      hasCheered: boolean;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("로그인이 필요합니다.");

      if (hasCheered) {
        const { error } = await supabase
          .from("cheers")
          .delete()
          .eq("user_id", user.id)
          .eq("log_id", logId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cheers").insert({
          user_id: user.id,
          log_id: logId,
        });
        if (error) throw error;
      }
    },
    onMutate: async ({ logId, hasCheered }) => {
      await queryClient.cancelQueries({ queryKey: ["friend-feed"] });
      const previous = queryClient.getQueryData<FeedEntry[]>(["friend-feed"]);

      queryClient.setQueryData<FeedEntry[]>(["friend-feed"], (old) =>
        (old ?? []).map((entry) =>
          entry.log_id === logId
            ? {
                ...entry,
                has_cheered: !hasCheered,
                cheer_count: hasCheered
                  ? entry.cheer_count - 1
                  : entry.cheer_count + 1,
              }
            : entry,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["friend-feed"], context.previous);
      }
      Alert.alert("오류", "응원 처리 중 문제가 발생했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-feed"] });
    },
  });

  return {
    feed: feedQuery.data ?? [],
    feedLoading: feedQuery.isLoading,
    refetchFeed: feedQuery.refetch,
    toggleCheer: toggleCheer.mutate,
  };
}
