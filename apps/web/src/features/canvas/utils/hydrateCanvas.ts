import { createFabricObjectFromState } from '@/features/canvas/utils/nodes';
import { getNodeId } from '@/features/canvas/utils/selection';
import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';

export function hydrateCanvasFromStore(canvas: fabric.Canvas) {
  const { nodes, nodeOrder } = useAppStore.getState();

  for (const id of nodeOrder) {
    const state = nodes[id];
    if (!state) continue;

    const exists = canvas.getObjects().some((candidate) => getNodeId(candidate) === id);
    if (exists) continue;

    const object = createFabricObjectFromState(state);
    if (object) {
      canvas.add(object);
    }
  }

  canvas.requestRenderAll();
}
