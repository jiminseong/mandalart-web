# 작업: Supabase, Health OS, Todo OS 기능 비활성화

이 작업은 Supabase 연동을 비활성화하고 Health OS 및 Todo OS 접근을 숨기거나 막아, 만다라트 기능만 남겨두는 것을 목표로 합니다.

## 단계

### 1. 미들웨어에서 Supabase 비활성화
- **파일**: `src/middleware.ts`
- **작업**: Supabase 클라이언트 초기화 및 `auth.getUser()` 호출, 그리고 관련 import 구문들을 주석 처리합니다. `next-intl` 미들웨어 로직만 남깁니다.
- **목표**: 모든 요청에서 실행되는 Supabase 인증 로직을 막습니다.

### 2. 랜딩 페이지에서 Health OS 및 Todo OS 링크 제거
- **파일**: `src/app/[locale]/page.tsx`
- **작업**: `/health` 및 `/todo` 로 이동하는 링크/버튼을 주석 처리합니다.
    - 헤더의 "Health OS" 링크
    - CTA 섹션의 "Health OS" 및 "Todo OS" 버튼
- **목표**: 비활성화된 기능으로의 진입점을 제거합니다.

### 3. 에디터 페이지에서 인증 동기화 비활성화
- **파일**: `src/app/[locale]/editor/page.tsx`
- **작업**: `<AuthSyncManager />` 컴포넌트의 import 및 사용을 주석 처리합니다.
- **목표**: 만다라트 에디터가 Supabase와 데이터 동기화를 시도하지 않도록 합니다.

### 4. 루트 레이아웃에서 인증 에러 핸들러 비활성화
- **파일**: `src/app/[locale]/layout.tsx`
- **작업**: `<AuthErrorHandler />` 컴포넌트의 import 및 사용을 주석 처리합니다.
- **목표**: 인증이 비활성화되므로 인증 에러 처리 로직도 제거합니다.

## 확인 사항
- 애플리케이션이 빌드되고 실행되는지 확인합니다.
- 만다라트 URL (`/editor`)이 (로컬 스토리지를 사용하여) 정상 작동하는지 확인합니다.
- 홈 페이지에서 Health OS 및 Todo OS 링크가 보이지 않는지 확인합니다.
- Supabase로 나가는 네트워크 요청이 없는지 확인합니다 (브라우저 콘솔/네트워크 탭).
