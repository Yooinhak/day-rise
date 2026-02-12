import {
  configureNotificationHandler,
  setupAndroidChannel,
  syncAllNotifications,
  type SchedulableRoutine,
} from "@/lib/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export function useNotificationSync() {
  const queryClient = useQueryClient();
  const isConfigured = useRef(false);

  useEffect(() => {
    if (isConfigured.current) return;
    isConfigured.current = true;

    configureNotificationHandler();
    setupAndroidChannel();
  }, []);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === "updated" &&
        event.query.queryKey[0] === "home-routines" &&
        event.action.type === "success"
      ) {
        const data = event.query.state.data as {
          routines: SchedulableRoutine[];
        } | null;

        if (data?.routines) {
          syncAllNotifications(data.routines);
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient]);
}
