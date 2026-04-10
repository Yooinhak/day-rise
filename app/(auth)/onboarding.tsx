import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { completeOnboarding } from "@/lib/onboarding";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  type ViewToken,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingSlide = {
  emoji: string;
  title: string;
  subtitle: string;
};

const slides: OnboardingSlide[] = [
  {
    emoji: "🌱",
    title: "매일의 작은 루틴이\n큰 변화를 만들어요",
    subtitle: "하루 하나씩, 나만의 루틴을 쌓아가세요",
  },
  {
    emoji: "📊",
    title: "달성률과 연속 기록으로\n성장을 확인하세요",
    subtitle: "일간, 주간, 월간 통계를 한눈에",
  },
  {
    emoji: "🤝",
    title: "친구와 함께라면\n더 즐거운 도전",
    subtitle: "서로의 루틴을 응원하고 격려해요",
  },
];

export default function OnboardingScreen() {
  const { theme } = useAppTheme();
  const c = theme.classes;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  async function handleNext() {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await completeOnboarding();
      router.replace("/(auth)/login");
    }
  }

  async function handleSkip() {
    await completeOnboarding();
    router.replace("/(auth)/login");
  }

  return (
    <View className={`flex-1 ${c.bg}`}>
      <View className="flex-row justify-end px-6 pt-14">
        <TouchableOpacity
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="온보딩 건너뛰기"
        >
          <Text className={`${c.textSub} text-base font-medium`}>
            건너뛰기
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{ width: SCREEN_WIDTH }}
            className="flex-1 items-center justify-center px-10"
          >
            <Text className="text-6xl mb-8">{item.emoji}</Text>
            <Text
              className={`${c.textMain} text-2xl font-bold text-center mb-4`}
            >
              {item.title}
            </Text>
            <Text className={`${c.textSub} text-base text-center`}>
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      <View className="px-8 pb-14">
        <View className="flex-row items-center justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex ? c.primaryBg : c.mutedBg
              }`}
              style={{ width: index === currentIndex ? 24 : 8 }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={
            currentIndex === slides.length - 1 ? "시작하기" : "다음"
          }
          className={`${c.primaryBg} py-4 rounded-2xl items-center shadow-lg ${c.shadowPrimary40}`}
        >
          <Text className="text-white text-lg font-bold">
            {currentIndex === slides.length - 1 ? "시작하기" : "다음"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
