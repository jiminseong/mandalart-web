# FEAT: Theme Variations + Custom Theme Selector

## 1. 목표

현재 앱은 사실상 하나의 팔레트에 가깝게 동작하고 있다.  
이번 작업의 목표는 아래 두 가지다.

1. 기존 `DESGIN_SYSTEM.md` 기반의 초록-베이지 계열은 `editorial` 테마로 유지하되, 기본 진입 테마는 `white`로 전환한다.
2. `ko/en` 언어 전환 UI의 왼쪽에 커스텀 테마 셀렉터를 추가해 사용자가 테마를 즉시 바꿀 수 있게 만든다.

## 2. 작업 가정

문맥상 "테마 4개 베리에이션"은 기존 `editorial` 테마에 신규 4종을 추가하는 의미로 해석한다.

- 선택형: `editorial`
  - 현재 `DESGIN_SYSTEM.md`의 초록-베이지 계열
- 신규 1: `dark`
  - 흰색~검은색 중심의 모노톤
- 신규 2: `pink`
  - 분홍 파스텔톤
- 신규 3: `rainbow`
  - 무지개 포인트 컬러
- 신규 4(기본): `white`
  - 화이트 중심의 미니멀 테마

즉, 최종 선택지는 총 5개로 계획한다.


## 3. 현재 구조 확인 결과

### 스타일/테마

- [src/app/globals.css](/Users/jiminseong/own-service/mandalart-web/src/app/globals.css)
  - 전역 CSS 변수가 현재 단일 팔레트로 고정되어 있다.
- [src/components/providers.tsx](/Users/jiminseong/own-service/mandalart-web/src/components/providers.tsx)
  - `next-themes`는 이미 설치되어 있지만 `class` 기반의 기본 `light/dark/system` 설정만 존재한다.
- [src/app/[locale]/layout.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/layout.tsx)
  - `body`에 `bg-white dark:bg-slate-950` 같은 하드코딩 클래스가 남아 있다.

### 언어 전환 UI

- [src/components/LanguageSwitcher.tsx](/Users/jiminseong/own-service/mandalart-web/src/components/LanguageSwitcher.tsx)
  - 현재 텍스트 버튼형 `ko/en` 토글이다.
- `LanguageSwitcher` 사용 위치
  - [src/app/[locale]/page.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/page.tsx)
  - [src/app/[locale]/editor/page.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/editor/page.tsx)
  - [src/app/[locale]/feedback/page.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/feedback/page.tsx)

### 추가 확인 사항

- `dark:` 클래스와 `gray/slate/black/white` 하드코딩이 앱 전역에 많이 분포한다.
- 특히 `health`, `todo`, `settings` 계열은 현재 iOS식 흑백 계열을 많이 직접 사용 중이다.
- 따라서 단순히 `globals.css`만 바꿔서는 전체 앱 테마가 일관되게 바뀌지 않는다.

## 4. 제안 방향

### 4.1 테마 시스템 구조

`next-themes`를 커스텀 다중 테마용으로 재설정한다.

- `attribute="data-theme"` 사용
- `defaultTheme="white"`
- `enableSystem={false}`
- `themes=["editorial", "dark", "pink", "rainbow", "white"]`

이유:

- 이번 요구사항은 시스템 다크모드 대응보다 "명시적인 사용자 선택 테마"가 핵심이다.
- `light/dark/system`보다 커스텀 이름을 직접 쓰는 편이 CSS 변수 관리와 analytics 확장에 유리하다.

### 4.2 토큰 전략

기존 색상명을 그대로 늘리는 방식보다 "의미 기반 토큰"으로 한 번 정리한다.

필수 토큰 예시:

- `--color-base`
- `--color-surface`
- `--color-surface-strong`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-border`
- `--color-accent-primary`
- `--color-accent-secondary`
- `--color-accent-contrast`
- `--color-selection-bg`
- `--color-selection-text`

기존 `growth`, `focus`, `action`은 유지하되, 내부적으로는 각 테마의 accent와 연결하는 방식이 안정적이다.

### 4.3 셀렉터 UX 방향

`apple-ui-designer` 원칙 기준으로 과하게 화려한 드롭다운은 피한다.

권장 형태:

- 언어 전환 왼쪽에 배치되는 capsule 형태 트리거
- 현재 테마의 작은 컬러 스와치 + 라벨 + chevron
- 클릭 시 가벼운 popover/listbox 오픈
- 각 옵션은 미리보기 스와치 2~3개와 이름을 함께 노출

의도:

- 기본 언어 스위처보다 한 단계 큰 우선순위
- 모바일에서도 한 손 조작이 가능한 크기
- "커스텀 셀렉터" 느낌은 주되 네이티브 iOS처럼 차분해야 함

## 5. 테마 정의 초안

### editorial

- 역할: 기존 디자인 시스템 보존용 선택 테마
- 방향: 현재 `DESGIN_SYSTEM.md` 유지
- 핵심 인상: Nordic editorial, green + beige, calm

### dark

- 역할: 고대비 모노톤
- 방향: 오프화이트 텍스트 + 차콜/블랙 배경
- 주의: pure black 일변도보다 깊이 차이가 느껴지는 2~3단 톤 필요

### pink

- 역할: 감성형 파스텔
- 방향: blush pink, rose beige, muted berry accent
- 주의: 채도 과다 금지, 텍스트 대비 확보 필수

### rainbow

- 역할: 가장 개성 있는 테마
- 방향: 배경은 중립적으로 두고 accent만 다채롭게 사용
- 주의: 배경 전체를 무지개로 만들지 않는다. 셀, 강조선, 뱃지, 상태색에만 분산 적용

### white

- 역할: 기본 진입 테마
- 방향: white, light gray, graphite 중심
- 주의: 현재 editorial과 겹치지 않도록 베이지 감을 최소화

## 6. 구현 범위

### 6.1 1차 범위

아래는 이번 기능의 최소 출하 범위다.

- 전역 테마 상태 구성
- 전역 CSS 변수 다중 테마화
- 커스텀 `ThemeSwitcher` 컴포넌트 추가
- `LanguageSwitcher` 왼쪽에 `ThemeSwitcher` 삽입
- 홈/에디터/피드백 페이지에서 정상 작동
- 새로고침, 라우트 이동, locale 변경 후에도 선택 테마 유지

### 6.2 2차 범위

아래는 같은 기능이지만 실제 일관성을 위해 거의 같이 해야 하는 범위다.

- `about`, `share` 같이 공개 페이지 전반의 토큰 정리
- `settings`, `todo`, `health` 레이아웃의 `dark:`/하드코딩 색상 정리
- 공통 헤더, 탭바, 카드, 버튼의 의미 기반 토큰 전환

### 6.3 제외 가능 범위

초기 구현에서 제외해도 되는 항목:

- 공유 이미지 export 색상을 현재 선택 테마에 100% 맞추는 작업
- 사용자 프로필 DB에 테마 저장
- 테마별 세부 일러스트/아이콘 변경

다만 `share` analytics의 `theme: "light" | "dark"` 타입은 이후 확장 필요가 있다.

## 7. 파일 단위 작업 계획

### 핵심 수정

- [src/components/providers.tsx](/Users/jiminseong/own-service/mandalart-web/src/components/providers.tsx)
  - `next-themes` 설정을 다중 커스텀 테마 기준으로 변경
- [src/app/globals.css](/Users/jiminseong/own-service/mandalart-web/src/app/globals.css)
  - 기본 토큰 재정의
  - `data-theme`별 변수 블록 추가
  - selection, body, 공통 surface 색 정리
- [src/app/[locale]/layout.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/layout.tsx)
  - `body`의 하드코딩 라이트/다크 클래스 제거

### 신규 컴포넌트

- `src/components/ThemeSwitcher.tsx`
  - 현재 선택 테마 표시
  - popover/listbox 기반 선택 UI
  - `next-themes` 연동
  - 모바일 대응

### 조립 위치

- [src/app/[locale]/page.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/page.tsx)
- [src/app/[locale]/editor/page.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/editor/page.tsx)
- [src/app/[locale]/feedback/page.tsx](/Users/jiminseong/own-service/mandalart-web/src/app/[locale]/feedback/page.tsx)

변경 방향:

- `ThemeSwitcher` + `LanguageSwitcher`를 하나의 utility cluster로 묶는다.
- 배치는 "ThemeSwitcher | LanguageSwitcher" 순서로 통일한다.

### 번역

- [messages/ko.json](/Users/jiminseong/own-service/mandalart-web/messages/ko.json)
- [messages/en.json](/Users/jiminseong/own-service/mandalart-web/messages/en.json)

추가될 가능성이 큰 키:

- `theme.label`
- `theme.editorial`
- `theme.dark`
- `theme.pink`
- `theme.rainbow`
- `theme.white`

## 8. 단계별 구현 순서

### Phase 1. 테마 인프라 정리

1. `Providers`에서 `next-themes`를 5개 커스텀 테마 기준으로 재구성
2. `globals.css`를 의미 기반 토큰 구조로 확장
3. `layout.tsx`의 하드코딩 `white/dark` body 스타일 제거

### Phase 2. 셀렉터 컴포넌트 추가

1. `ThemeSwitcher` 구현
2. 현재 테마 표시 방식 결정
3. 키보드 접근성, 바깥 클릭 닫힘, 모바일 터치 영역 확인

### Phase 3. 헤더 조립

1. `home`, `editor`, `feedback` 헤더에 삽입
2. 언어 전환 UI와 간격, 정렬, 반응형 상태 조정
3. locale 변경 시 theme 상태가 유지되는지 확인

### Phase 4. 토큰 전환 확장

1. 공개 페이지 우선 정리
2. 앱 쉘 영역 `todo`, `health`, `settings` 순으로 하드코딩 색상 제거
3. `dark:` 클래스를 semantic token 기반 클래스로 치환

### Phase 5. 검증

1. `ko/en` 각각에서 테마 전환 확인
2. 모바일/데스크톱 헤더 레이아웃 확인
3. 새로고침/직접 URL 진입/뒤로가기 후 유지 확인
4. `lint` 및 주요 페이지 수동 점검

## 9. 주요 리스크

### 리스크 1. 하드코딩 색상 잔존

현재 앱에는 `gray`, `slate`, `black`, `white`, `dark:` 계열이 광범위하게 남아 있다.  
테마 셀렉터만 먼저 넣으면 일부 화면은 바뀌고 일부 화면은 안 바뀌는 반쪽 상태가 생길 수 있다.

대응:

- 1차 출하 범위를 명확히 정하고
- 최소한 app shell 주요 화면은 semantic token으로 치환 후 배포

### 리스크 2. rainbow 테마 가독성

레인보우는 가장 쉽게 산만해질 수 있다.

대응:

- 배경은 중립 유지
- accent만 다색 적용
- 본문 텍스트는 항상 고정 대비값 사용

### 리스크 3. hydration/Flicker

테마 초기값이 SSR/CSR 사이에서 어긋나면 첫 렌더에서 깜빡일 수 있다.

대응:

- `next-themes` 초기 설정 정리
- `body/html`의 직접 하드코딩 클래스 제거
- 셀렉터는 mounted 이후 현재값 표시 처리

### 리스크 4. 기존 작업과 충돌

현재 워크트리에 다른 수정 중인 파일이 있다.

대응:

- 이번 기능 구현 시에는 관련 파일만 좁게 수정
- 메시지 파일과 에디터/공유 페이지의 기존 변경분은 덮어쓰지 않도록 주의

## 10. 완료 기준

아래를 만족하면 기능 완료로 본다.

- 사용자는 총 5개 테마 중 하나를 선택할 수 있다.
- 기본 진입 테마는 `white`다.
- 테마 셀렉터는 `LanguageSwitcher` 왼쪽에 위치한다.
- 테마 선택은 새로고침과 locale 변경 후에도 유지된다.
- 홈/에디터/피드백 기준으로 즉시 시각 차이가 명확하다.
- 주요 공통 화면에서 하드코딩 `dark:` 스타일 충돌이 없다.
- `ko/en` 번역 라벨이 모두 제공된다.

## 11. 권장 구현 메모

- `ThemeSwitcher`는 `<select>` 대신 커스텀 popover로 구현한다.
- rainbow 테마는 "배경 무지개"가 아니라 "accent 무지개"여야 한다.
- editorial 테마는 기존 감성을 유지하되, 기본값은 white로 둔다.
- white 테마는 editorial의 베이지를 거의 제거해 명확히 다른 인상을 만들어야 한다.
- settings 페이지에는 추후 동일한 테마 셀렉터를 재사용 가능하게 컴포넌트 분리 구조로 만든다.
