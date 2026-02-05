# PRD: Todo OS (`/todo`)

## 0. 한 줄 정의
> **Todo OS는 만다라트(Mandalart) 기법을 기반으로 핵심 목표를 달성하기 위한 실행 중심의 할 일 관리 시스템이다.**

## 1. 핵심 철학
- **Goal-Oriented**: 단순 나열식 할 일이 아닌, 상위 목표(Core Goal)와 연결된 과제를 수행한다.
- **Visual Focus**: 만다라트 차트를 통해 목표 달성 현황을 한눈에 파악한다.
- **Actionable**: 계획(Plan)에서 끝나는 것이 아니라, 매일의 실행(Do)을 강조한다.

## 2. 주요 기능 (Draft)
### 2.1 Dashboard (`/todo`)
- 오늘의 핵심 과제 요약
- 현재 진행 중인 만다라트 목표 상태 표시
- 주간 성취도 그래프

### 2.2 Mandalart Editor (`/todo/mandalart`)
- 9x9 만다라트 차트 시각화 및 편집
- Core Goal -> Sub Goal -> Tasks 계층 구조 관리
- 목표별 색상 및 아이콘 커스텀

### 2.3 Task List (`/todo/tasks`)
- 만다라트에서 파생된 투두 리스트
- 날짜별/우선순위별 보기
- 완료 체크 및 성취감 부여를 위한 마이크로 인터랙션

## 3. 데이터 구조 (Draft)
- **CoreGoal**: 만다라트의 중심 목표
- **SubGoal**: 8개의 하위 목표
- **ActionItem**: 각 하위 목표를 달성기 위한 구체적 실행 과제 (투두)

---
*상세 스펙은 추후 구체화 예정*
