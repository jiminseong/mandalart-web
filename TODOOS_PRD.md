# PRD: Todo OS (`/todo`)

## 0. 한 줄 정의
> **Todo OS는 "스택(Stack)" 메타포를 활용하여 우선순위에 따라 할 일을 쌓고 처리하는 직관적인 실행/성취 관리 시스템이다.**

## 1. 핵심 UX 컨셉: Dual Stack System

### 1.1 The Stacks (두 개의 스택)
화면은 두 개의 스택 영역으로 구성되며, 모든 항목은 **하단부터 차곡차곡 쌓이는(Bottom-up)** 구조를 가진다.

1.  **Left Stack: To-Do (오늘 할 일)**
    *   사용자가 등록한 할 일들이 쌓인다.
    *   **우선순위(Priority)**: 스택 내의 위치가 곧 우선순위다. 기본적으로 **스택의 최상단(Top)**에 있는 항목이 가장 높은 우선순위를 가지며 "지금 당장 해야 할 일"을 의미한다.
    *   카테고리와 무관하게 모든 투두가(All-in-one) 하나의 스택에 쌓여, 사용자는 전체적인 작업량을 한눈에(Visualized) 체감할 수 있다.

2.  **Right Stack: Done (완료한 일)**
    *   완료 처리된 항목들이 이동하여 쌓이는 공간이다.
    *   하루 동안 완료한 일들이 시각적으로 쌓이며 성취감(Sense of Accomplishment)을 부여한다.
    *   완료된 항목은 **회색조(Grayscale)** 처리되어 시각적 노이즈를 줄이고 "끝났다"는 느낌을 강조한다.

### 1.2 Interaction & Flow
*   **Check to Complete**:
    *   To-Do 스택의 항목을 체크하면, 해당 카드는 즉시 회색으로 변하고(Dimmed) 오른쪽 Done 스택의 최상단으로 이동(Fly & Stack)한다.
*   **Keyboard Shortcuts (PC)**:
    *   `Cmd + Enter`: 현재 포커스된(또는 최상단) 투두 항목을 즉시 완료 처리한다.
*   **Drag & Drop**:
    *   스택 내부에서 드래그하여 자유롭게 우선순위(순서)를 변경할 수 있다.

## 2. 주요 기능 명세

### 2.1 Todo Item Specifications
각 투두 항목은 다음 속성을 포함한다.
*   **Title**: 할 일 내용.
*   **Category**: 시각적 구분(색상 띠 또는 배경색).
*   **Time (Optional)**: "14:00 미팅" 처럼 시간을 선택적으로 포함할 수 있다. 시간이 있는 항목도 스택 내 순서는 사용자가 조정 가능하다.
*   **Status**: `Todo` (Left) | `Done` (Right)

### 2.2 Categories
모든 투두는 사용자가 정의한 카테고리에 속한다. 고정된 기본 카테고리는 없으며, 사용자가 자신의 라이프스타일에 맞춰 자유롭게 구성한다.

*   **Fully Custom**: 사용자는 카테고리 이름과 색상을 자유롭게 추가, 수정, 삭제할 수 있다.
*   **Color Coding**: 각 카테고리는 고유한 색상을 가져 스택 내에서 시각적으로 구분되어야 한다.
*   **No Dependency**: 다른 OS(Health OS 등)와 연동되지 않으며, 독자적으로 관리된다.

### 2.3 Routines (반복 설정)
강력한 반복 주기 옵션을 지원하여 루틴 형성을 돕는다.
*   **매일 (Daily)**
*   **매주 요일 지정** (예: 월, 수, 금)
*   **격일** (2일 간격)
*   **매달** (특정 날짜 또는 '마지막 주 금요일' 등)
*   *루틴성 할 일은 해당 날짜의 00:00에 To-Do 스택으로 자동 생성(Push)된다.*

### 2.4 Cross-Platform Support
다양한 디바이스 환경에서 끊김 없는(Seamless) 경험을 제공한다.
*   **PC (Web/App)**: 키보드 단축키(`Cmd+Enter`), 마우스 드래그 앤 드롭 최적화. 와이드 화면 활용.
*   **Mobile (iOS/Android)**: 한 손 조작에 최적화된 터치 인터페이스.
*   **Watch (Post-MVP)**: 손목에서 핵심 투두 확인 및 체크.
*   **Widget (Post-MVP)**: 홈 화면 위젯을 통해 앱 실행 없이 투두 상태 확인 및 빠른 체크.

## 3. UI/Design Requirements
*   **Stack Visual**: 실제 종이나 카드가 쌓인 듯한 뎁스(Depth)감과 그림자(Shadow) 표현.
*   **Animations**: 카드가 이동하고 쌓이는 물리적인 움직임 구현 (Spring Animation 등 활용).
