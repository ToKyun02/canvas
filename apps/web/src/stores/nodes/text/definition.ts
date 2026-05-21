import { Textbox } from 'fabric';
import type { NodeDefinition } from '../types';
import { createTextNodeState, type TextNodeState } from './index';

export const textNodeDefinition = {
  type: 'text',
  tool: 'text',
  label: '텍스트',
  shortcut: 't',
  icon: 'letter-t',
  cursor: 'crosshair',
  drawingMode: 'click-or-drag',

  createState: createTextNodeState,

  createFabricObject: (state) => {
    const textState = state as TextNodeState;

    return new Textbox(textState.text, {
      left: textState.position.x,
      top: textState.position.y,
      width: textState.size.width,
      fontSize: textState.fontSize,
      fill: textState.color ?? undefined,
      backgroundColor: textState.fill ?? undefined,
      data: { nodeId: textState.id, nodeType: textState.type },
    });
  },

  onPlaced: (object, canvas) => {
    canvas.setActiveObject(object);

    if (object instanceof Textbox) {
      object.enterEditing();
      object.selectAll();
    }
  },
} satisfies NodeDefinition;
