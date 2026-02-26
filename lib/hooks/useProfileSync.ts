import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function useProfileSync() {
  useEffect(() => {
    const sync = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("profiles").upsert(
        {
          id: user.id,
          display_name:
            user.user_metadata?.name ?? user.email?.split("@")[0] ?? "",
          avatar_url: user.user_metadata?.picture ?? "",
          email: user.email ?? "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
    };

    sync();
  }, []);
}
