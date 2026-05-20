import { Point, util, type TMat2D } from 'fabric';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 8;

function clampZoom(zoom: number) {
  return Math.min(Math.max(+zoom.toFixed(2), MIN_ZOOM), MAX_ZOOM);
}

export function zoomAtPoint(
  zoom: number,
  position: { x: number; y: number },
  pointer: { x: number; y: number },
  factor: number,
) {
  const nextZoom = clampZoom(zoom * factor);
  if (nextZoom === zoom) {
    return { zoom, position };
  }

  const vpt: TMat2D = [zoom, 0, 0, zoom, position.x, position.y];
  const before = new Point(pointer.x, pointer.y);
  const scenePoint = before.transform(util.invertTransform(vpt));

  const nextVpt: TMat2D = [nextZoom, 0, 0, nextZoom, position.x, position.y];
  const after = scenePoint.transform(nextVpt);
  nextVpt[4] += before.x - after.x;
  nextVpt[5] += before.y - after.y;

  return {
    zoom: nextZoom,
    position: { x: nextVpt[4], y: nextVpt[5] },
  };
}

export function getViewportCenter(canvasSize: { width: number; height: number }) {
  return { x: canvasSize.width / 2, y: canvasSize.height / 2 };
}
