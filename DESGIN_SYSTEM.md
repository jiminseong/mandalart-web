# Mandalart 2026 Design System & Convention Guide

만다라트 2026(Mandalart 2026)의 디자인 시스템은 **"북유럽 에디토리얼(Nordic Editorial)"** 스타일을 지향합니다.
인위적인 디지털 느낌을 배제하고, 물성(Materiality)과 신뢰감, 그리고 정돈된 여백을 통해 목표 달성을 위한 차분한 몰입감을 전달합니다.

---

## 1. Core Philosophy (핵심 원칙)

### 1.1 Editorial Layout (매거진 스타일)
- **비대칭의 미학**: 화면 정중앙 정렬을 피하고, 좌측 정렬 타이포그래피와 우측 비주얼의 균형을 맞춥니다.
- **활자의 힘**: 이미지가 없어도 글자 자체의 크기(Scale), 굵기(Weight), 여백(Spacing)만으로 위계가 느껴져야 합니다.
- **여백의 규칙**: 좁고 답답한 간격 대신, 숨 쉴 수 있는 넓은 여백을 사용하여 고급스러움을 연출합니다.

### 1.2 Natural & Material (자연스러운 물성)
- **차분한 톤**: 쨍한 디지털 컬러(Neon)를 금지하고, 자연에서 온 색감(이끼색, 돌색, 종이색)을 사용합니다.
- **종이 질감**: 배경을 완전한 `#FFFFFF`가 아닌 `#F5F5F0` 등의 미색으로 처리하여 눈이 편안한 종이 질감을 줍니다.
- **구조적 선**: 흐릿한 그림자(Shadow)보다는 명확한 선(Border/Divider)으로 구획을 나눕니다.

---

## 2. Color System

### 2.1 Base Palette (Backgrounds)
따뜻하고 유기적인 배경색을 사용합니다.
- **Base (Main BG)**: `#F5F5F0` (따뜻한 회미색 / Warm Off-white)
- **Surface (Cards/Sections)**: `#EBEBE6` (배경보다 조금 더 짙은 톤)
- **White (High Highlight)**: `#FFFFFF` (강조된 카드 배경에만 제한적 사용)

### 2.2 Typography Palette
검정색을 쓰되, 자연스러운 톤으로 조정합니다.
- **Primary Text**: `#1C1C1B` (완전한 블랙 아님, 먹색)
- **Secondary Text**: `#5A5A55` (따뜻한 다크 그레이)
- **Border**: `#D1D1C7` (따뜻한 회색 라인)

### 2.3 Brand Colors (Accents)
- **Growth (Main)**: `#4A5D44` (Deep Moss Green / 차분한 이끼색)
  - *Usage*: 핵심 목표, 긍정적 강조, 성장
- **Focus (Sub)**: `#2E3A45` (Muted Slate / 묵직한 군청색)
  - *Usage*: 세부 계획, 기술적 신뢰, 무게감
- **Action (Accent)**: `#C45C44` (Burnt Orange / 붉은 벽돌색)
  - *Usage*: 극소량의 포인트 (알림, 중요 버튼 호버 등)

---

## 3. Typography Convention

### 3.1 Font Family
- **Main**: `Pretendard Variable`
- **Fallback**: system-ui, sans-serif

### 3.2 Typescale & Leading
텍스트는 **`break-keep` (단어 단위 줄바꿈)** 을 기본으로 합니다.

| Role | Class (Tailwind) | Size / Line-height | Note |
| :--- | :--- | :--- | :--- |
| **Hero Title** | `text-5xl lg:text-7xl font-bold` | Leading `1.1` | 매우 크고 타이트하게 |
| **Section Title** | `text-3xl font-bold` | - | 섹션 헤더 |
| **Card Title** | `text-2xl font-bold` | - | 카드 내 제목 |
| **Body (Long)** | `text-lg` or `text-base` | Leading `relaxed` | 긴 글은 줄간격 넓게 |
| **Label/Meta** | `text-sm font-medium` | Tracking `wide` | 대문자 포인트 등 |

---

## 4. UI Component Guide

### 4.1 Grid & Layout
- **Container**: `max-w-container` (기본 `1280px`보다 더 와이드하게)
- **Section Spacing**: `py-24` (96px) 이상. 시원한 상하 여백 필수.
- **Grid Lines**: 콘텐츠 구분을 위해 `gap-px bg-border` 테크닉(내부는 bg-base)을 사용하여 얇은 그리드 라인을 노출합니다.

### 4.2 Buttons & Links
- **Shape**:
  - 기본: `rounded-lg` (8px)
  - 강조 버튼(Nav 등): `rounded-full` (완전 둥근 형태)
- **Interaction**:
  - Hover 시 배경색 변경보다는 `Translate` (위치 이동)이나 `Scale` 미세 조정을 선호합니다.
  - 텍스트 링크는 `border-b` (밑줄) 애니메이션을 활용합니다.

### 4.3 Cards (Navigation/Feature)
- **Growth (Groals)**: White 배경 + Border + Green Accent
- **Focus (Plans)**: Dark Slate 배경 + No Border + White Text
- **Effect**: Hover 시 `border-growth` 등 컬러 변화와 함께 `y-1` 리프트 효과.

---

## 5. "Anti-AI" Checklist (개발 전 필독)

디자인 구현 시 아래 요소가 들어가면 즉시 수정해야 합니다.

1. **[X] Centered Everything**: 모든 텍스트를 습관적으로 가운데 정렬하지 마세요. 좌측 정렬이 기본입니다.
2. **[X] Generic Icons**: 의미 없는 추상적인 아이콘이나 이모지(🚀, ✨) 사용을 자제하세요. 텍스트로 풀거나 Lucide 아이콘을 얇게 사용하세요.
3. **[X] Gradient Backgrounds**: 배경에 흐릿한 그라데이션(Blurry blobs)을 넣지 마세요. 단색(Solid)이나 질감으로 승부합니다.
4. **[X] Rounded Full Everything**: 모든 모서리를 너무 둥글게(20px 이상) 하지 마세요. 적당한 텐션(8~12px)을 유지하세요.
5. **[X] Pure Black/White**: `#000000`, `#FFFFFF`를 텍스트나 배경에 직접 쓰지 마세요. 지정된 변수(`bg-base`, `text-primary`)를 사용하세요.

---

## 6. CSS Variable Reference (Tailwind)

```css
/* globals.css */
--color-base: #F5F5F0;
--color-surface: #EBEBE6;
--color-text-primary: #1C1C1B;
--color-text-secondary: #5A5A55;
--color-border: #D1D1C7;
--color-growth: #4A5D44;
--color-focus: #2E3A45;
```

위 규칙을 준수하여 **"신뢰감 있고, 읽기 편하며, 사람의 손길이 느껴지는"** 웹사이트를 구축합니다.
