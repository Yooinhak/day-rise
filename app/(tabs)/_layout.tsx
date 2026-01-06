import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#E08162", // primary 색상
        tabBarInactiveTintColor: "#7C736C", // text-sub 색상
        tabBarStyle: {
          backgroundColor: "#FFFCF8",
          borderTopWidth: 1,
          borderTopColor: "#F0E6DD",
          elevation: 12,
          shadowColor: "#5A3F33",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
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
        name="profile" // 파일명을 profile.tsx로 바꿀 예정입니다
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
