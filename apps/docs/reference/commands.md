# 단축키 & 커맨드

Canvas 에디터의 전체 커맨드 목록입니다. `Mod` = `Ctrl`(Windows/Linux) / `Cmd`(macOS).

## 도구 (tools)

| ID | 라벨 | 단축키 | 설명 |
|----|------|--------|------|
| `tool.move` | 이동 | `V` | 선택·이동 도구 |
| `tool.text` | 텍스트 | `T` | 텍스트 노드 배치 |

## 히스토리 (history)

| ID | 라벨 | 단축키 | 조건 |
|----|------|--------|------|
| `history.undo` | 실행 취소 | `Mod+Z` | canUndo |
| `history.redo` | 복원 | `Mod+Shift+Z` | canRedo |

## 선택 (selections)

| ID | 라벨 | 단축키 | 조건 |
|----|------|--------|------|
| `selection.selectAll` | 전체 선택 | `Mod+A` | — |
| `selection.clearSelection` | 선택 해제 | `Escape` | — |
| `selection.deleteSelection` | 삭제 | `Delete` | 선택 있음 |
| `selection.deleteSelectionByBackspace` | 삭제 | `Backspace` | 선택 있음 |

## 뷰 (views)

| ID | 라벨 | 단축키 |
|----|------|--------|
| `views.zoomIn` | 확대 | `Mod+=` |
| `views.zoomOut` | 축소 | `Mod+-` |
| `views.zoomToFit` | 화면에 맞추기 | `Mod+0` |

## 에디터 (editor)

| ID | 라벨 | 단축키 |
|----|------|--------|
| `editor.togglePropertiesSidebar` | 속성 패널 토글 | `Mod+/` |
| `editor.toggleNodeLabelsVisibility` | 노드 라벨 토글 | `Mod+.` |

## 커맨드 추가 방법

1. `stores/commands/index.ts`의 `COMMANDS` 배열에 `Command` 객체 추가
2. 또는 `NODE_DEFINITIONS`에 노드를 등록하면 도구 커맨드 자동 생성

```typescript
{
  id: 'my.command',
  label: '내 커맨드',
  shortcut: 'mod+shift+k',
  group: 'editor',
  execute: (store) => { /* ... */ },
}
```

3. `useGlobalShortcuts`가 자동으로 키 바인딩

## 소스 코드

정의 위치: `apps/web/src/stores/commands/index.ts`

## 관련 문서

- [캔버스 사용법](/guide/canvas-usage)
- [상태 관리](/architecture/state-management)
