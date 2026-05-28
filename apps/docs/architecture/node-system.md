# 노드 시스템

Canvas 에디터의 확장 가능한 노드 아키텍처입니다.

## 핵심 개념

**노드** = 캔버스 위의 하나의 UI 요소 (텍스트, 향후 사각형·이미지 등)

각 노드는 두 표현을 가집니다:

1. **State** (`CanvasNodeState`) — Zustand store의 직렬화 가능한 데이터
2. **Fabric Object** — Fabric.js 캔버스 위의 렌더링 객체

## NodeDefinition

모든 노드 타입은 `NodeDefinition`을 구현합니다:

```typescript
// stores/nodes/types.ts
interface NodeDefinition {
  type: string;
  tool: string;
  label: string;
  shortcut?: string;
  icon?: string;
  cursor?: string;

  createState: (placement: NodePlacement) => BaseNodeState;
  createFabricObject: (state: BaseNodeState) => FabricObject;
  stateFromFabricObject: (object: FabricObject) => CanvasNodeState;
  applyStateToFabricObject: (object: FabricObject, state: CanvasNodeState) => void;
  onPlaced?: (object: FabricObject, canvas: Canvas) => void;
}
```

## 레지스트리

`stores/nodes/registry.ts`:

```typescript
export const NODE_DEFINITIONS = {
  text: textNodeDefinition,
} as const;

export const TOOL_TO_NODE = {
  text: textNodeDefinition,
};
```

타입 추론:

```typescript
type NodeType = keyof typeof NODE_DEFINITIONS;  // 'text'
type NodeTool = (typeof NODE_DEFINITIONS)[NodeType]['tool'];  // 'text'
```

## 텍스트 노드 예시

### 상태 (`stores/nodes/text/index.ts`)

```typescript
interface TextNodeState extends BaseNodeState {
  type: 'text';
  text: string;
  fontSize: number;
  color: string | null;
  fill: string | null;
  stroke: string | null;
}
```

### Fabric 매핑 (`stores/nodes/text/definition.ts`)

- `createFabricObject` → `new Textbox(...)`
- `stateFromFabricObject` → Textbox 속성 → TextNodeState
- `applyStateToFabricObject` → state 변경 → Textbox.set(...)
- `onPlaced` → 편집 모드 진입 + 전체 선택

### Fabric 메타데이터

모든 Fabric 객체에 `data: { nodeId, nodeType }`를 설정합니다. selection/sync에서 ID를 추출하는 데 사용됩니다.

## 배치 (Placement)

`features/canvas/drawing/placement.ts`의 `attachPlacement`:

1. 도구 활성화 시 canvas에 `mouse:down` 리스너 등록
2. 클릭 위치에 `createState(placement)` → `createFabricObject(state)` → `canvas.add` → `addNode(state)`
3. `onComplete` → `setTool('move')`
4. `onPlaced` 콜백 (텍스트: 편집 모드)

## Base Node Fields

`stores/nodes/base.ts`, `stores/nodes/fabric.ts`:

공통 필드(position, size, visibility, locked, opacity)를 `BaseNodeState`와 `readBaseNodeFields` / `applyBaseNodeFields` 유틸로 관리합니다.

## 노드 라벨

`features/canvas/labels/NodeLabelsOverlay.tsx`가 DOM 오버레이로 노드 ID/타입 라벨을 표시합니다. Fabric viewportTransform을 따라 좌표를 변환합니다.

## 확장 가이드

새 노드 추가 절차는 [노드 추가하기](/guide/adding-nodes)를 참고하세요.

## 관련 문서

- [프론트엔드](/architecture/frontend)
- [상태 관리](/architecture/state-management)
