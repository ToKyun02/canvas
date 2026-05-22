import type { AppState } from '@/stores/commands/types';

export const APP_STORAGE_KEY = 'canvas-app-v1';
export const APP_STORAGE_VERSION = 2;

/**
 * localStorage persist 대상 필드.
 * 새 항목은 적절한 그룹에 key를 추가하면 자동으로 저장/복원됩니다.
 */
export const PERSIST_GROUPS = {
  document: ['nodes', 'nodeOrder'] as const,
  preferences: ['isPropertiesSidebarOpen'] as const,
} as const;

type PersistedKey = {
  [Group in keyof typeof PERSIST_GROUPS]: (typeof PERSIST_GROUPS)[Group][number];
}[keyof typeof PERSIST_GROUPS];

export type PersistedAppState = Pick<AppState, PersistedKey>;

const PERSISTED_KEYS = Object.values(PERSIST_GROUPS).flat() as PersistedKey[];

const DEFAULTS: PersistedAppState = {
  nodes: {},
  nodeOrder: [],
  isPropertiesSidebarOpen: true,
};

export function partializeAppState(state: AppState): PersistedAppState {
  return Object.fromEntries(PERSISTED_KEYS.map((key) => [key, state[key]])) as PersistedAppState;
}
