type ShortcutTarget = EventTarget & {
  closest?: (selector: string) => unknown;
  isContentEditable?: boolean;
  nodeName?: string;
  nodeType?: number;
  parentElement?: ShortcutTarget | null;
};

const TEXT_NODE = 3;
const INTERACTIVE_TARGETS = new Set(['button', 'input', 'select', 'textarea']);
const INTERACTIVE_SELECTOR =
  'button,input,select,textarea,[role="button"],[role="textbox"]';

export function shouldIgnoreAppShortcutTarget(
  target: EventTarget | null,
): boolean {
  const element = getShortcutElement(target);

  if (!element) {
    return false;
  }

  if (element.isContentEditable) {
    return true;
  }

  if (typeof element.closest === 'function') {
    return Boolean(element.closest(INTERACTIVE_SELECTOR));
  }

  const nodeName = element.nodeName?.toLowerCase();

  return nodeName ? INTERACTIVE_TARGETS.has(nodeName) : false;
}

function getShortcutElement(target: EventTarget | null): ShortcutTarget | null {
  if (!target) {
    return null;
  }

  const candidate: ShortcutTarget = target;

  if (candidate.nodeType === TEXT_NODE) {
    return candidate.parentElement ?? null;
  }

  return candidate;
}
