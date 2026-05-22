export const LABEL_GAP = 4;

export type Point = { x: number; y: number };

/** store position(= rect 좌상단) 기준. width/height와 무관 */
export function getLabelScenePosition(position: Point): Point {
  return {
    x: position.x,
    y: position.y - LABEL_GAP,
  };
}

export function sceneToScreen(
  point: Point,
  zoom: number,
  viewport: Point,
): Point {
  return {
    x: point.x * zoom + viewport.x,
    y: point.y * zoom + viewport.y,
  };
}

export function screenDeltaToScene(delta: Point, zoom: number): Point {
  return {
    x: delta.x / zoom,
    y: delta.y / zoom,
  };
}
