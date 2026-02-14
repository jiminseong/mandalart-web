# 작업: Supabase, Health OS, Todo OS 기능 비활성화

## 완료된 작업
1. 미들웨어에서 Supabase 비활성화
2. 랜딩 페이지에서 Health OS 및 Todo OS 링크 제거
3. AI 기능 비활성화
4. 에디터 페이지에서 인증 동기화 비활성화
5. 루트 레이아웃에서 인증 에러 핸들러 비활성화

---

# 작업: 디자인 전면 리팩토링 (북유럽 에디토리얼 스타일)

`DESIGN_SYSTEM.md`에 정의된 "북유럽 에디토리얼(Nordic Editorial)" 스타일을 적용하여 전체적인 디자인을 리팩토링합니다.

## 목표
- **Anti-AI**: 인위적인 느낌을 배제하고 자연스러운 물성과 종이 질감을 구현.
- **Editorial Layout**: 좌측 정렬 타이포그래피, 넓은 여백, 명확한 위계.
- **Color System**: Warm Off-white 배경, Deep Moss Green (Growth), Muted Slate (Focus) 적용.

## 단계

### 1. 글로벌 스타일 및 테마 설정 (완료)
- **파일**: `src/app/globals.css`, `tailwind.config.ts`, `src/app/[locale]/layout.tsx`
- **작업**:
    - `globals.css`에 디자인 시스템의 CSS 변수(`--color-base`, `--color-growth`, `--color-focus` 등) 정의.
    - 배경색을 완전한 화이트(`bg-white`)에서 웜톤 미색(`#F5F5F0`)으로 변경.
    - 폰트 설정을 확인하고 `Pretendard Variable` 적용.
    - 다크 모드 스타일을 잠시 배제하고(또는 웜톤 다크로 재정의) 라이트 모드 완성도에 집중.

### 2. 랜딩 페이지 (`Home`) 리디자인 (완료)
- **파일**: `src/app/[locale]/page.tsx`
- **작업**:
    - **레이아웃**: 중앙 정렬(`text-center`, `flex-col items-center`)을 제거하고 **좌측 정렬** 위주의 에디토리얼 레이아웃으로 변경.
    - **타이포그래피**: Hero Title을 압도적인 크기(`text-6xl` 이상)와 Tight한 행간(`leading-none`)으로 수정.
    - **여백**: 섹션 간 여백을 시원하게(`py-24` 이상) 확보.
    - **버튼**: `rounded-full`과 `hover:scale` 효과 적용.

### 3. 만다라트 에디터 UI (`Grid` & `NodeEditor`) 리스타일링
- **파일**: `src/components/grid/MandalartGrid.tsx`, `src/components/grid/Cell.tsx`, `src/components/editor/NodeEditor.tsx`
- **작업**:
    - **Grid**: 그림자(Shadow)를 제거하고 `gap-px bg-border` 방식을 사용하여 얇고 선명한 그리드 라인 구현.
    - **Cell**: 셀 배경을 `#F5F5F0`(Base) 또는 `#FFFFFF`(Highlight)로 변경. 텍스트는 `break-keep` 적용.
    - **Colors**:
        - 핵심 목표(Core): **Growth Color** (`#4A5D44`) 텍스트 또는 테두리 포인트.
        - 세부 목표(Sub): **Focus Color** (`#2E3A45`) 적용.
    - **NodeEditor**: 바텀 시트/사이드 패널 디자인을 "종이 카드" 느낌으로 변경(`border` 강조, `shadow` 축소).

### 4. 공통 UI 컴포넌트 업데이트
- **파일**: `src/components/CommonHeader.tsx`, `src/components/LanguageSwitcher.tsx` 등
- **작업**:
    - 네비게이션 바의 배경을 글래스모피즘(Blur) 대신 불투명한 종이 질감(`bg-base`)으로 변경이 나을지 검토.
    - 아이콘 사용을 최소화하고 텍스트 레이블(Label) 강화.

## 확인 사항
- 모든 텍스트가 `Pretendard`로 렌더링되는지 확인.
- 중앙 정렬된 요소가 없는지 체크 (의도된 것 제외).
- 색감이 너무 차갑거나(Cool Gray) 너무 쨍하지(Neon) 않은지 확인.
