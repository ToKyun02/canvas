import { useAppStore } from '@/stores';
import { COMMANDS } from '@/stores/commands';
import { matchCombo } from '@/utils/keyCombo';
import { useEffect } from 'react';

export function useGlobalShortcuts() {
  const store = useAppStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      const inEditableContext = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      const hasModifier = e.metaKey || e.ctrlKey;

      for (const cmd of COMMANDS) {
        if (!cmd.shortcut) continue;
        if (inEditableContext && !hasModifier) continue;
        if (!matchCombo(cmd.shortcut, e)) continue;
        if (cmd.isDisabled?.(store)) continue;
        e.preventDefault();
        cmd.execute(store);
        break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [store]);
}
