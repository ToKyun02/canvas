import { attachDragPlacement, attachPlacement } from '@/features/canvas/drawing/placement';
import { resetMoveCursor } from '@/features/canvas/utils/cursor';
import { useAppStore } from '@/stores';
import { getNodeDefinition, isNodeTool } from '@/stores/nodes/registry';
import type * as fabric from 'fabric';
import { useEffect } from 'react';

export function useDrawingTools(canvas: fabric.Canvas | null) {
  const tool = useAppStore((s) => s.tool);
  const setTool = useAppStore((s) => s.setTool);

  useEffect(() => {
    if (!canvas) return;

    if (tool === 'move') {
      resetMoveCursor(canvas);
      return;
    }

    if (!isNodeTool(tool)) return;

    const definition = getNodeDefinition(tool);
    const onComplete = () => setTool('move');

    if (definition.drawingMode === 'click-or-drag') {
      return attachPlacement(canvas, definition, { onComplete });
    }

    return attachDragPlacement(canvas, definition, { onComplete });
  }, [canvas, tool, setTool]);
}
