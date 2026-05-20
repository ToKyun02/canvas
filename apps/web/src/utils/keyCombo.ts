const isMac = typeof navigator !== 'undefined' ? /Mac|iPhone|iPad/.test(navigator.platform) : false;

export function matchCombo(combo: string, e: KeyboardEvent): boolean {
  const parts = combo.toLowerCase().split('+');

  const needsMod = parts.includes('mod');
  const needsShift = parts.includes('shift');
  const needsAlt = parts.includes('alt');
  const key = parts.filter((p) => !['mod', 'shift', 'alt'].includes(p))[0];

  const modPressed = isMac ? e.metaKey : e.ctrlKey;

  return needsMod === modPressed && needsShift === e.shiftKey && needsAlt === e.altKey && e.key.toLowerCase() === key;
}

const KEY_DISPLAY: Record<string, string> = {
  mod: isMac ? '⌘' : 'Ctrl',
  shift: isMac ? '⇧' : 'Shift',
  alt: isMac ? '⌥' : 'Alt',
  delete: '⌫',
  escape: 'Esc',
  enter: '↵',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
};

export function formatCombo(combo: string): string[] {
  return combo.split('+').map((k) => KEY_DISPLAY[k.toLowerCase()] ?? k.toUpperCase());
}
