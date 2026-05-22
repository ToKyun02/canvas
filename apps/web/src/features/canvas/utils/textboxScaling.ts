import { getNodeType } from '@/features/canvas/utils/nodes';
import {
  ActiveSelection,
  Control,
  Textbox,
  controlsUtils,
  type ControlCursorCallback,
  type FabricObject,
  type TPointerEvent,
  type Transform,
} from 'fabric';

const SCALE_EPSILON = 0.0001;
const RESIZING = 'resizing';

const { changeObjectWidth, wrapWithFireEvent, wrapWithFixedAnchor } = controlsUtils;

export function isTextboxNode(object: FabricObject) {
  return object instanceof Textbox || getNodeType(object) === 'text';
}

const widthResizeCursor: ControlCursorCallback = () => 'ew-resize';

function preserveTextboxFontSize(textbox: Textbox) {
  const fontSize = textbox.fontSize ?? 14;
  textbox.set({ scaleX: 1, scaleY: 1, fontSize });
}

function afterTextboxWidthChange(textbox: Textbox) {
  preserveTextboxFontSize(textbox);
  textbox.initDimensions();
  preserveTextboxFontSize(textbox);
  textbox.setCoords();
}

function withTextboxWidthChange(
  handler: (eventData: TPointerEvent, transform: Transform, x: number, y: number) => boolean,
) {
  return (eventData: TPointerEvent, transform: Transform, x: number, y: number) => {
    const changed = handler(eventData, transform, x, y);

    if (changed && transform.target instanceof Textbox) {
      afterTextboxWidthChange(transform.target);
    }

    return changed;
  };
}

const changeTextboxWidth = wrapWithFireEvent(
  RESIZING,
  wrapWithFixedAnchor(withTextboxWidthChange(changeObjectWidth)),
);

export function configureTextboxControls(textbox: Textbox) {
  textbox.set({
    lockScalingFlip: true,
    lockRotation: true,
    lockScalingX: false,
    lockScalingY: false,
  });
  textbox.setControlsVisibility({
    tl: false,
    tr: false,
    bl: false,
    br: false,
    mt: false,
    mb: false,
    ml: true,
    mr: true,
    mtr: false,
  });
  textbox.controls = {
    ...textbox.controls,
    ml: new Control({
      x: -0.5,
      y: 0,
      actionHandler: changeTextboxWidth,
      cursorStyleHandler: widthResizeCursor,
      actionName: RESIZING,
    }),
    mr: new Control({
      x: 0.5,
      y: 0,
      actionHandler: changeTextboxWidth,
      cursorStyleHandler: widthResizeCursor,
      actionName: RESIZING,
    }),
  };
}

export function configureSelectionMoveOnly(selection: ActiveSelection) {
  selection.set({
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
  });
  selection.setControlsVisibility({
    tl: false,
    tr: false,
    bl: false,
    br: false,
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    mtr: false,
  });
}

export function normalizeTextboxScale(object: FabricObject) {
  if (!(object instanceof Textbox)) return false;

  const scaleX = object.scaleX ?? 1;
  const scaleY = object.scaleY ?? 1;
  const hasScaleX = Math.abs(scaleX - 1) >= SCALE_EPSILON;
  const hasScaleY = Math.abs(scaleY - 1) >= SCALE_EPSILON;

  if (!hasScaleX && !hasScaleY) return false;

  const fontSize = object.fontSize ?? 14;
  const minWidth = object.minWidth ?? 20;

  if (hasScaleX) {
    object.set({
      width: Math.max((object.width ?? 0) * scaleX, minWidth),
    });
  }

  preserveTextboxFontSize(object);
  object.initDimensions();
  preserveTextboxFontSize(object);
  object.setCoords();

  return true;
}

export function normalizeTextboxScalesInTarget(target: FabricObject) {
  if (target instanceof ActiveSelection) {
    return false;
  }

  return normalizeTextboxScale(target);
}
