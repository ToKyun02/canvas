import type { CanvasNodeState } from './types';
import type * as fabric from 'fabric';

export function readScaledSize(object: fabric.FabricObject) {
  return {
    width: (object.width ?? 0) * (object.scaleX ?? 1),
    height: (object.height ?? 0) * (object.scaleY ?? 1),
  };
}

export function readBaseNodeFields(object: fabric.FabricObject) {
  const { width, height } = readScaledSize(object);

  return {
    position: {
      x: object.left ?? 0,
      y: object.top ?? 0,
    },
    size: { width, height },
    rotation: object.angle ?? 0,
    visibility: object.visible ?? true,
    locked: object.selectable === false,
    opacity: object.opacity ?? 1,
  };
}

export function applyBaseNodeFields(object: fabric.FabricObject, state: CanvasNodeState) {
  object.set({
    left: state.position.x,
    top: state.position.y,
    width: state.size.width,
    height: state.size.height,
    scaleX: 1,
    scaleY: 1,
    angle: state.rotation,
    visible: state.visibility,
    selectable: !state.locked,
    evented: !state.locked,
    opacity: state.opacity,
  });
}
