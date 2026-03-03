import { useAppTheme } from "@/components/theme/AppThemeProvider";
import { DailyCompletion } from "@/lib/hooks/useProfileStats";
import { format, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

type WeeklyWaveChartProps = {
  data: DailyCompletion[];
};

type WeeklyData = {
  weekLabel: string;
  avgRate: number;
};

export function WeeklyWaveChart({ data }: WeeklyWaveChartProps) {
  const { theme } = useAppTheme();
  const c = theme.classes;

  // 주간 데이터로 그룹화 (최근 4주)
  const weeklyData = groupByWeek(data);

  // 차트 크기
  const width = 280;
  const height = 120;
  const padding = { top: 20, bottom: 30, left: 10, right: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 데이터 포인트 계산
  const points = weeklyData.map((week, i) => ({
    x: padding.left + (i / (weeklyData.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (week.avgRate / 100) * chartHeight,
    rate: week.avgRate,
    label: week.weekLabel,
  }));

  // 부드러운 곡선 Path 생성 (Catmull-Rom spline)
  const linePath = createSmoothPath(points);

  // 그라데이션 영역 Path
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x},${padding.top + chartHeight}` +
    ` L ${points[0].x},${padding.top + chartHeight} Z`;

  return (
    <View className={`${c.card} p-4 rounded-2xl border ${c.borderSoft}`}>
      <Text className={`${c.textMain} text-lg font-bold mb-2`}>
        주간 달성률 트렌드
      </Text>
      <Text className={`${c.textSub} text-xs mb-4`}>
        최근 4주간의 변화를 확인해보세요
      </Text>

      <View className="items-center">
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>

          {/* 그라데이션 영역 */}
          <Path d={areaPath} fill="url(#gradient)" />

          {/* 곡선 라인 */}
          <Path
            d={linePath}
            stroke={theme.colors.primary}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>

        {/* X축 라벨 */}
        <View
          className="flex-row justify-between w-full px-2"
          style={{ marginTop: -20 }}
        >
          {weeklyData.map((week, i) => (
            <View key={i} className="items-center" style={{ width: 60 }}>
              <Text className={`${c.textSub} text-[10px]`}>{week.weekLabel}</Text>
              <Text className={`${c.primaryText} text-xs font-bold`}>
                {week.avgRate}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 트렌드 메시지 */}
      <View className="mt-4 pt-3 border-t border-gray-100">
        <Text className={`${c.textMain} text-sm`}>
          {getTrendMessage(weeklyData)}
        </Text>
      </View>
    </View>
  );
}

function groupByWeek(data: DailyCompletion[]): WeeklyData[] {
  const weeks: Map<string, number[]> = new Map();

  data.forEach((day) => {
    const date = new Date(day.date);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekKey = format(weekStart, "MM/dd");

    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, []);
    }
    weeks.get(weekKey)!.push(day.completionRate);
  });

  // 주간 평균 계산
  const result: WeeklyData[] = [];
  weeks.forEach((rates, weekKey) => {
    const avg = Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
    result.push({ weekLabel: weekKey, avgRate: avg });
  });

  // 최근 4주만
  return result.slice(-4);
}

function createSmoothPath(
  points: { x: number; y: number }[]
): string {
  if (points.length < 2) return "";

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Bezier conversion
    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return path;
}

function getTrendMessage(weeklyData: WeeklyData[]): string {
  if (weeklyData.length < 2) return "데이터를 모으고 있어요!";

  const recent = weeklyData[weeklyData.length - 1].avgRate;
  const previous = weeklyData[weeklyData.length - 2].avgRate;
  const diff = recent - previous;

  if (diff > 10) return `이번 주 ${diff}% 상승! 대단해요!`;
  if (diff > 0) return `꾸준히 성장하고 있어요 (+${diff}%)`;
  if (diff === 0) return "일정한 페이스를 유지하고 있어요";
  if (diff > -10) return "조금 쉬어가도 괜찮아요";
  return "다시 시작해봐요, 할 수 있어요!";
}
