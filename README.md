Day Rise

Day Rise는 따뜻한 톤의 루틴/목표 관리 앱입니다. 오늘의 루틴을 차분하게 기록하고, 주간·월간 목표를 흐름 있게 채우며, 정원처럼 쌓여가는 성취감을 시각적으로 보여줍니다.

핵심 컨셉
- 매일 해야 할 일은 가볍고 명확하게
- 주간/월간 목표는 긴 호흡으로
- 오늘의 달성률은 "오늘 목표" 기준으로만
- 편집 모드에서 정리/정렬까지 한 번에

주요 기능
- 데일리 루틴 완료 기록
- 주간/월간 목표 진행률
- 오늘의 정원(달성률) 요약 카드
- 편집 모드: 삭제, 수정 및 순서 정렬(드래그 앤 드롭)
- 당겨서 새로고침
- 스트릭 시스템: 전체/개별 루틴 연속 달성 일수 표시
- 프로필 실제 통계: 이번 달 완료율, 지난 달 비교, 최장 스트릭
- 주간 웨이브 차트: 최근 4주 완료율 추이 시각화
- 루틴 수정: 제목, 빈도, 목표 횟수, 알림 시간 변경
- 푸시 알림: 설정한 시간에 매일 반복 로컬 알림 전송
- 루틴 상세 바텀시트: 길게 눌러 생성일, 스트릭, 완료 기록 달력 확인
- 3종 테마 선택: 클래식(가든), 데이라이즈(선라이즈), 포커스

기술 스택
- Expo SDK 54 + React Native
- TypeScript
- TanStack React Query
- Supabase (PostgreSQL + Auth with Google OAuth PKCE)
- NativeWind / Tailwind CSS
- React Hook Form
- react-native-reanimated (애니메이션)
- react-native-draggable-flatlist (드래그 앤 드롭)
- react-native-svg (차트)
- expo-notifications (로컬 푸시 알림)

데이터베이스 개요 (Supabase)
아래 스키마는 `types/database.types.ts` 기준입니다.

테이블
- `routines` (사용자 루틴/목표)
  - `id` (string)
  - `user_id` (string)
  - `title` (string)
  - `frequency` (enum: `daily`, `weekly`, `monthly`, `yearly`)
  - `target_count` (number)
  - `reminder_time` (string | null)
  - `sort_order` (number | null)
  - `is_active` (boolean | null)
  - `created_at` (string | null)
  - `deactivated_at` (string | null)

- `routine_logs` (완료 기록)
  - `id` (string)
  - `routine_id` (string, FK -> routines.id)
  - `user_id` (string)
  - `completed_at` (string)
  - `note` (string | null)

열거형
- `frequency_type`: `daily` | `weekly` | `monthly` | `yearly`

RPC 함수
- `update_routine_order(payload: Json)` -> void
  - 루틴들의 `sort_order`를 일괄 업데이트
  - 편집 모드 정렬 시 사용

운영 정책 메모
- 순서는 `sort_order` 오름차순 기준
- 삭제는 소프트 삭제(`is_active = false`)로 기록 보존

프로젝트 구조 (요약)
- `app/` - Expo Router 기반 화면 (홈, 프로필, 로그인, 생성, 수정, 설정)
- `components/home/` - 홈 화면 UI (루틴 카드, 요약 카드, 바텀시트, 달력 등)
- `components/profile/` - 프로필 화면 UI (웨이브 차트)
- `components/theme/` - 테마 시스템 (AppThemeProvider)
- `components/ui/` - 공통 UI (AnimatedPressable)
- `lib/hooks/` - 커스텀 훅 (useHomeRoutines, useProfileStats, useRoutineDetail, useNotificationSync)
- `lib/utils/` - 유틸리티 (streakCalculator)
- `lib/` - Supabase 클라이언트, 테마 정의, 알림 서비스
- `types/` - DB 타입 정의
