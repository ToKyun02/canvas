import { cn } from '@/lib/utils';
import type * as fabric from 'fabric';
import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { screenDeltaToScene } from './coords';
import { moveNodeOnCanvas } from './moveNodeOnCanvas';

const DRAG_THRESHOLD = 3;

type NodeLabelProps = {
  nodeId: string;
  canvas: fabric.Canvas;
  label: string;
  x: number;
  y: number;
  zoom: number;
  selected: boolean;
  locked: boolean;
  nodePosition: { x: number; y: number };
  onLabelChange: (label: string) => void;
  onNodeMove: (position: { x: number; y: number }) => void;
  onSelect: () => void;
  onDragEnd: () => void;
};

export function NodeLabel({
  nodeId,
  canvas,
  label,
  x,
  y,
  zoom,
  selected,
  locked,
  nodePosition,
  onLabelChange,
  onNodeMove,
  onSelect,
  onDragEnd,
}: NodeLabelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origPosition: { x: number; y: number };
    dragging: boolean;
  } | null>(null);

  const commitLabel = useCallback(() => {
    const next = draft.trim() || label;
    if (next !== label) {
      onLabelChange(next);
    }
    setEditing(false);
  }, [draft, label, onLabelChange]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (locked || editing) return;

    event.stopPropagation();
    event.preventDefault();

    onSelect();

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origPosition: nodePosition,
      dragging: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.dragging && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) {
      return;
    }

    if (!drag.dragging) {
      drag.dragging = true;
    }

    const sceneDelta = screenDeltaToScene({ x: deltaX, y: deltaY }, zoom);
    const nextPosition = {
      x: drag.origPosition.x + sceneDelta.x,
      y: drag.origPosition.y + sceneDelta.y,
    };

    moveNodeOnCanvas(canvas, nodeId, nextPosition);
    onNodeMove(nextPosition);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.dragging) {
      onDragEnd();
    }

    dragRef.current = null;
  };

  const onDoubleClick = (event: ReactPointerEvent<HTMLElement>) => {
    if (locked) return;

    event.stopPropagation();
    setDraft(label);
    setEditing(true);
  };

  const style = {
    left: x,
    top: y,
    transform: 'translate(0, -100%)',
  } as const;

  if (editing) {
    return (
      <input
        className="pointer-events-auto absolute z-20 min-w-16 rounded border border-indigo-400 bg-white px-1.5 py-0.5 text-xs text-gray-900 shadow-sm outline-none dark:border-indigo-500 dark:bg-gray-900 dark:text-gray-100"
        style={style}
        value={draft}
        autoFocus
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commitLabel}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === 'Enter') {
            commitLabel();
          }
          if (event.key === 'Escape') {
            setDraft(label);
            setEditing(false);
          }
        }}
        onPointerDown={(event) => event.stopPropagation()}
      />
    );
  }

  return (
    <span
      className={cn(
        'pointer-events-auto absolute z-10 max-w-48 select-none truncate rounded px-1 py-0.5 text-xs',
        locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        selected
          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300'
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
      )}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
      data-node-id={nodeId}
    >
      {label}
    </span>
  );
}
