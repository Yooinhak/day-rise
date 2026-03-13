import { useEffect, useState } from "react";
import { Alert, AppState } from "react-native";

/**
 * 간단한 네트워크 상태 감지 훅
 * 실제 Supabase 연결을 시도해서 온라인/오프라인 판별
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkConnection() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch("https://www.google.com/generate_204", {
          method: "HEAD",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (isMounted) setIsOnline(true);
      } catch {
        if (isMounted) setIsOnline(false);
      }
    }

    checkConnection();

    // 앱이 foreground로 돌아올 때마다 체크
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkConnection();
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return { isOnline };
}
