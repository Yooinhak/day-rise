// app/create.tsx
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateRoutineScreen() {
  const router = useRouter();
  const [frequency, setFrequency] = useState("daily"); // daily, weekly, monthly, yearly

  const frequencies = [
    { id: "daily", label: "매일" },
    { id: "weekly", label: "매주" },
    { id: "monthly", label: "매달" },
    { id: "yearly", label: "매년" },
  ];

  return (
    <View className="flex-1 bg-bg-warm px-6 pt-12">
      {/* 상단 닫기 버튼 */}
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Feather name="x" size={24} color="#3C322B" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-text-main text-2xl font-bold mb-8">
          어떤 습관을{"\n"}만들어볼까요? ✨
        </Text>

        {/* 1. 목표 이름 입력 */}
        <View className="mb-8">
          <Text className="text-text-sub mb-3 font-medium">목표 이름</Text>
          <TextInput
            placeholder="예: 미지근한 물 마시기"
            className="bg-card p-5 rounded-2xl text-text-main text-lg border border-border-soft shadow-sm"
            placeholderTextColor="#7C736C"
          />
        </View>

        {/* 2. 주기 선택 (핵심!) */}
        <View className="mb-8">
          <Text className="text-text-sub mb-3 font-medium">
            얼마나 자주 할까요?
          </Text>
          <View className="flex-row justify-between bg-muted p-1.5 rounded-2xl border border-border-soft">
            {frequencies.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFrequency(f.id)}
                className={`flex-1 py-3 rounded-xl items-center ${frequency === f.id ? "bg-card shadow-sm border border-border-soft" : ""}`}
              >
                <Text
                  className={`font-bold ${frequency === f.id ? "text-primary" : "text-text-sub"}`}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. 상세 설정 (주기에 따라 변경 가능) */}
        <View className="mb-10">
          <Text className="text-text-sub mb-3 font-medium">세부 설정</Text>
          <View className="bg-card p-5 rounded-2xl border border-border-soft">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-text-main">목표 횟수</Text>
              <View className="flex-row items-center">
                <TouchableOpacity className="w-8 h-8 bg-muted rounded-full items-center justify-center border border-border-soft">
                  <Feather name="minus" size={16} color="#3C322B" />
                </TouchableOpacity>
                <Text className="mx-4 font-bold text-lg">1회</Text>
                <TouchableOpacity className="w-8 h-8 bg-muted rounded-full items-center justify-center border border-border-soft">
                  <Feather name="plus" size={16} color="#3C322B" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="h-[1px] bg-border-soft my-2" />
            <View className="flex-row justify-between items-center">
              <Text className="text-text-main">알림 시간</Text>
              <Text className="text-primary font-bold">오전 09:00</Text>
            </View>
          </View>
        </View>

        {/* 생성 버튼 */}
        <TouchableOpacity
          className="bg-primary p-5 rounded-2xl items-center shadow-lg shadow-primary/30 mb-10"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold text-lg">
            이 목표로 시작하기
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
