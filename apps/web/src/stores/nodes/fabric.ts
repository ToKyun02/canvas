import {
  configureSelectionMoveOnly,
  configureTextboxControls,
  isTextboxNode,
} from '@/features/canvas/utils/textboxScaling';
import type * as fabric from 'fabric';
import { ActiveSelection } from 'fabric';
import type { CanvasNodeState } from './types';

export function readScaledSize(object: fabric.FabricObject) {
  return {
    width: (object.width ?? 0) * (object.scaleX ?? 1),
    height: (object.height ?? 0) * (object.scaleY ?? 1),
  };
}

export function getObjectTopLeft(object: fabric.FabricObject) {
  return object.translateToOriginPoint(object.getCenterPoint(), 'left', 'top');
}

export function getObjectSceneBounds(object: fabric.FabricObject) {
  const { width, height } = readScaledSize(object);
  const topLeft = getObjectTopLeft(object);

  return {
    x: topLeft.x,
    y: topLeft.y,
    width,
    height,
  };
}

export function configureNodeTransform(object: fabric.FabricObject) {
  if (isTextboxNode(object)) {
    configureTextboxControls(object as fabric.Textbox);
    return;
  }

  if (object instanceof ActiveSelection) {
    configureSelectionMoveOnly(object);
    return;
  }

  object.set({
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
  });
  object.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    tl: false,
    tr: false,
    bl: false,
    br: false,
    mtr: false,
  });
}

export function readBaseNodeFields(object: fabric.FabricObject) {
  const { width, height } = readScaledSize(object);
  const { x, y } = getObjectTopLeft(object);

  return {
    position: { x, y },
    size: { width, height },
    visibility: object.visible ?? true,
    locked: object.selectable === false,
    opacity: object.opacity ?? 1,
  };
}

export function applyBaseNodeFields(object: fabric.FabricObject, state: CanvasNodeState) {
  object.set({
    originX: 'left',
    originY: 'top',
    left: state.position.x,
    top: state.position.y,
    width: state.size.width,
    height: state.size.height,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    visible: state.visibility,
    selectable: !state.locked,
    evented: !state.locked,
    opacity: state.opacity,
  });
  configureNodeTransform(object);
}
