Day Rise

Day Rise는 따뜻한 톤의 루틴/목표 관리 앱입니다. 오늘의 루틴을 차분하게 기록하고, 주간·월간 목표를 흐름 있게 채우며, 정원처럼 쌓여가는 성취감을 시각적으로 보여줍니다.

핵심 컨셉
- 매일 해야 할 일은 가볍고 명확하게
- 주간/월간 목표는 긴 호흡으로
- 오늘의 달성률은 “오늘 목표” 기준으로만
- 편집 모드에서 정리/정렬까지 한 번에

주요 기능
- 데일리 루틴 완료 기록
- 주간/월간 목표 진행률
- 오늘의 정원(달성률) 요약 카드
- 편집 모드: 삭제 및 순서 정렬(드래그 앤 드롭)
- 당겨서 새로고침

기술 스택
- Expo + React Native
- TypeScript
- TanStack Query
- Supabase (Postgres + Auth)
- NativeWind

업데이트 로그
- 테마 선택 기능 추가 (클래식/데이라이즈/포커스 3종)
- 설정 화면 신설: 테마 선택 및 로그아웃 제공
- 프로필 화면에서 설정 진입 메뉴 추가
- 테마별 컬러 토큰 및 UI 전반 연동

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
- `app/` - Expo Router 기반 화면
- `components/` - UI 컴포넌트 (홈 화면 UI는 `components/home`)
- `lib/` - Supabase 클라이언트 및 유틸
- `types/` - DB 타입 정의
