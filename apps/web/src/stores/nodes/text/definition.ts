import { applyBaseNodeFields, readBaseNodeFields } from '../fabric';
import { getNodeId } from '@/features/canvas/utils/selection';
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

  stateFromFabricObject: (object) => {
    const textbox = object as Textbox;
    const id = getNodeId(object);

    if (!id) {
      throw new Error('Text node is missing nodeId');
    }

    return {
      id,
      type: 'text',
      label: 'text',
      ...readBaseNodeFields(object),
      text: textbox.text ?? '',
      fontSize: textbox.fontSize ?? 14,
      color: typeof textbox.fill === 'string' ? textbox.fill : null,
      fill: textbox.backgroundColor ?? null,
      stroke: typeof textbox.stroke === 'string' ? textbox.stroke : null,
    } satisfies TextNodeState;
  },

  applyStateToFabricObject: (object, state) => {
    const textState = state as TextNodeState;
    const textbox = object as Textbox;

    applyBaseNodeFields(textbox, textState);
    textbox.set({
      text: textState.text,
      fontSize: textState.fontSize,
      fill: textState.color ?? undefined,
      backgroundColor: textState.fill ?? undefined,
      stroke: textState.stroke ?? undefined,
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
