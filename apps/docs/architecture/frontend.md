# 프론트엔드 아키텍처

`apps/web` React SPA의 구조와 핵심 패턴입니다.

## 기술 선택

| 영역 | 선택 | 이유 |
|------|------|------|
| 빌드 | Vite 6 | 빠른 HMR, ESM 네이티브 |
| 라우팅 | TanStack Router | 타입 안전 파일 기반 라우팅 |
| 스타일 | Tailwind CSS 4 | 유틸리티 퍼스트, `@tailwindcss/vite` |
| 캔버스 | Fabric.js 7 | 객체 기반 2D 캔버스, Textbox 등 |
| 상태 | Zustand | 경량, slice 합성, persist/devtools |

## 라우트 구조

```
src/routes/
├── __root.tsx          # 루트 레이아웃 + Devtools
├── index.tsx           # / (홈)
└── canvas/
    ├── route.tsx       # /canvas 레이아웃 (SidebarProvider)
    └── index.tsx       # /canvas/ (에디터 페이지)
```

TanStack Router Vite 플러그인이 `routeTree.gen.ts`를 자동 생성합니다.

## Canvas 컴포넌트

`components/canvas/index.tsx`는 Fabric Canvas의 React 래퍼입니다:

```tsx
export function Canvas({ className }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const domRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useFabricCanvas(domRef, { onCanvas: setCanvas, containerRef });
  useGlobalShortcuts();
  useCanvasCamera(canvas);
  useCanvasViewportWheel({ canvasContainerRef: containerRef, canvas });
  useCanvasHydration(canvas);
  useDrawingTools(canvas);
  useCanvasSelection(canvas);
  useCanvasNodes(canvas);

  return (
    <div ref={containerRef} className={`relative touch-none overscroll-none ${className ?? 'h-full w-full'}`}>
      <canvas ref={domRef} />
      <NodeLabelsOverlay canvas={canvas} />
    </div>
  );
}
```

각 hook은 단일 책임을 가집니다:

| Hook | 책임 |
|------|------|
| `useFabricCanvas` | Canvas 인스턴스 생성/해제, ResizeObserver로 canvasSize 동기화 |
| `useGlobalShortcuts` | 전역 단축키 → `COMMANDS` 실행 |
| `useCanvasCamera` | zoom, pan 상태 → viewportTransform |
| `useCanvasViewportWheel` | 휠 이벤트 → 줌/팬 |
| `useCanvasHydration` | persist 상태 → Fabric 객체 복원 |
| `useDrawingTools` | 도구별 노드 배치 (placement) |
| `useCanvasSelection` | Fabric selection ↔ `selectedIds`, 삭제 요청 처리 |
| `useCanvasNodes` | nodes 변경 ↔ Fabric sync (이동·리사이즈·편집·삭제) |

## Features 모듈

```
features/
├── canvas/
│   ├── hooks/       # 캔버스 관련 hooks
│   ├── utils/       # zoom, selection, sync, cursor, textboxScaling 등
│   ├── labels/      # 노드 라벨 오버레이 (NodeLabelsOverlay, NodeLabel)
│   └── drawing/     # placement (노드 배치)
└── shortcuts/
    └── hooks/       # useGlobalShortcuts
```

## UI 컴포넌트

- `components/ui/` — shadcn/ui (Button, Sidebar, Input, theme-mode-toggle 등)
- `components/canvas/zoomLevel.tsx`, `position.tsx` — 좌상단 줌·팬 좌표 HUD
- `components/propertiesSidebar/` — 우측 속성 패널 (현재 placeholder 메뉴만)
- `components/themeProvider.tsx` — 다크/라이트 테마

`/canvas/` 페이지(`routes/canvas/index.tsx`)는 `ModeToggle`, `ZoomLevel`, `Position`, `Canvas`를 조합합니다.

## 전역 단축키

`Canvas` 컴포넌트에서 `useGlobalShortcuts()`를 호출합니다. 이 hook이 `COMMANDS` 배열을 순회하며 `keydown` 이벤트를 처리하고, `keyCombo.ts`로 `mod+z` 등 플랫폼별 키 매핑을 처리합니다.

## 개발 도구

- **TanStack Router Devtools** — 라우트 디버깅
- **Zustand devtools** — Redux DevTools 연동
- **`window.devCanvas`** — DEV 모드 콘솔 디버깅 API (`global-injection.ts`)
  - `store.app` — Zustand store
  - `canvas` — 현재 Fabric Canvas
  - `getSelectedNodeIds()`, `getNodeById(id)`, `getNodes()`, `getNodeOrder()`

## 관련 문서

- [상태 관리](/architecture/state-management)
- [노드 시스템](/architecture/node-system)
