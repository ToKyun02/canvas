import { APP_STORAGE_KEY } from '@/stores/persistence/appStorage';

const LEGACY_DOCUMENT_STORAGE_KEY = 'canvas-document-v1';

/** canvas-document-v1 → canvas-app-v1 1회 마이그레이션 */
export function migrateLegacyStorageKeys() {
  if (typeof localStorage === 'undefined') return;

  if (localStorage.getItem(APP_STORAGE_KEY)) return;

  const legacy = localStorage.getItem(LEGACY_DOCUMENT_STORAGE_KEY);
  if (!legacy) return;

  localStorage.setItem(APP_STORAGE_KEY, legacy);
  localStorage.removeItem(LEGACY_DOCUMENT_STORAGE_KEY);
}
