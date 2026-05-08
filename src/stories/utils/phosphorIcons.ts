import * as Ph from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';

// Filter the namespace to only icon components (functions whose name matches a
// Phosphor icon — they all start with a capital letter and are not utility
// exports like IconContext, IconBase, IconWeight, etc.)
const EXCLUDED = new Set(['IconContext', 'IconBase', 'SSR']);

export const ICON_MAP: Record<string, Icon> = Object.fromEntries(
  Object.entries(Ph).filter(
    ([key, val]) =>
      val != null &&
      /^[A-Z]/.test(key) &&
      !key.endsWith('Icon') &&
      !EXCLUDED.has(key),
  ),
) as Record<string, Icon>;

export const ICON_NAMES = ['(none)', ...Object.keys(ICON_MAP).sort()] as const;
export type IconName = (typeof ICON_NAMES)[number];
