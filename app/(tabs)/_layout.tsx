import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { useAppTheme } from "@/components/theme/AppThemeProvider";

export default function TabLayout() {
  const { theme } = useAppTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary, // primary 색상
        tabBarInactiveTintColor: theme.colors.textSub, // text-sub 색상
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          elevation: 12,
          boxShadow: `0px -6px 16px ${theme.colors.tabShadow}`,
          height: 68,
          paddingBottom: 12,
          paddingTop: 8,
        },
        headerShown: false, // 커스텀 헤더를 쓸 것이므로 기본 헤더는 숨김
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <Feather name="check-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed" // 파일명을 feed.tsx로 바꿀 예정입니다
        options={{
          title: "소셜",
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "마이",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
