import { getLabelScenePosition, sceneToScreen } from '@/features/canvas/labels/coords';
import { NodeLabel } from '@/features/canvas/labels/NodeLabel';
import { stateFromFabricObject } from '@/features/canvas/utils/nodes';
import { getNodeById } from '@/features/canvas/utils/selection';
import { useAppStore } from '@/stores';
import { getObjectTopLeft } from '@/stores/nodes/fabric';
import type * as fabric from 'fabric';
import { useEffect, useReducer } from 'react';

type NodeLabelsOverlayProps = {
  canvas: fabric.Canvas | null;
};

function getLabelAnchorPosition(canvas: fabric.Canvas, nodeId: string, storePosition: { x: number; y: number }) {
  const object = getNodeById(canvas, nodeId);
  if (!object) return storePosition;

  return getObjectTopLeft(object);
}

export function NodeLabelsOverlay({ canvas }: NodeLabelsOverlayProps) {
  const nodes = useAppStore((s) => s.nodes);
  const nodeOrder = useAppStore((s) => s.nodeOrder);
  const zoom = useAppStore((s) => s.zoom);
  const position = useAppStore((s) => s.position);
  const selectedIds = useAppStore((s) => s.selectedIds);
  const updateNode = useAppStore((s) => s.updateNode);
  const setSelectedIds = useAppStore((s) => s.setSelectedIds);
  const setNode = useAppStore((s) => s.setNode);

  const [, forceRender] = useReducer((value: number) => value + 1, 0);

  const isVisible = useAppStore((s) => s.isVisibleNodeLabels);

  useEffect(() => {
    if (!canvas) return;

    const rerender = () => forceRender();

    canvas.on('object:moving', rerender);
    canvas.on('object:resizing', rerender);
    canvas.on('object:modified', rerender);

    return () => {
      canvas.off('object:moving', rerender);
      canvas.off('object:resizing', rerender);
      canvas.off('object:modified', rerender);
    };
  }, [canvas]);

  if (!canvas) return null;

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {nodeOrder.map((id) => {
        const node = nodes[id];
        if (!node || !node.visibility) return null;

        const anchor = getLabelAnchorPosition(canvas, id, node.position);
        const scenePos = getLabelScenePosition(anchor);
        const screenPos = sceneToScreen(scenePos, zoom, position);

        return (
          <NodeLabel
            key={id}
            nodeId={id}
            canvas={canvas}
            label={node.label}
            x={screenPos.x}
            y={screenPos.y}
            zoom={zoom}
            selected={selectedIds.includes(id)}
            locked={node.locked}
            nodePosition={anchor}
            onLabelChange={(label) => updateNode(id, { label })}
            onNodeMove={(nextPosition) => updateNode(id, { position: nextPosition })}
            onSelect={() => setSelectedIds([id])}
            onDragEnd={() => {
              const object = getNodeById(canvas, id);
              if (object) {
                const state = stateFromFabricObject(object);
                const current = useAppStore.getState().nodes[id];
                if (state && current) {
                  setNode({ ...state, label: current.label });
                }
              }
            }}
          />
        );
      })}
    </div>
  );
}
