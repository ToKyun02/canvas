import type { Canvas } from 'fabric';

let current: Canvas | undefined;

const isDev = import.meta.env.DEV;

export const devCanvasRegistry = {
  register(canvas: Canvas) {
    if (!isDev) return;
    current = canvas;
  },

  unregister(canvas: Canvas) {
    if (!isDev) return;
    if (current === canvas) {
      current = undefined;
    }
  },

  get current() {
    return current;
  },
};
