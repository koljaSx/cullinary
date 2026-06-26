import { describe, expect, it } from 'vitest';

import { shouldIgnoreAppShortcutTarget } from '../renderer/lib/shortcuts';

// biome-ignore lint/security/noSecrets: false positive
describe('shouldIgnoreAppShortcutTarget', () => {
  it('ignores native form and button targets', () => {
    expect(
      shouldIgnoreAppShortcutTarget(makeTarget({ nodeName: 'BUTTON' })),
    ).toBe(true);
    expect(
      shouldIgnoreAppShortcutTarget(makeTarget({ nodeName: 'input' })),
    ).toBe(true);
  });

  it('ignores text nodes inside controls', () => {
    const button = makeTarget({ nodeName: 'BUTTON' });
    const textNode = makeTarget({ nodeType: 3, parentElement: button });

    expect(shouldIgnoreAppShortcutTarget(textNode)).toBe(true);
  });

  it('ignores editable targets and allows ordinary app surfaces', () => {
    expect(
      shouldIgnoreAppShortcutTarget(makeTarget({ isContentEditable: true })),
    ).toBe(true);
    expect(shouldIgnoreAppShortcutTarget(makeTarget({ nodeName: 'DIV' }))).toBe(
      false,
    );
  });

  it('uses closest controls for nested element targets', () => {
    expect(
      shouldIgnoreAppShortcutTarget(
        makeTarget({
          closest: (selector) => (selector.includes('button') ? {} : null),
          nodeName: 'SPAN',
        }),
      ),
    ).toBe(true);
  });
});

function makeTarget(target: Partial<FakeTarget>): FakeTarget {
  return new FakeTarget(target);
}

class FakeTarget extends EventTarget {
  closest?: (selector: string) => unknown;
  isContentEditable?: boolean;
  nodeName?: string;
  nodeType?: number;
  parentElement?: FakeTarget | null;

  constructor(target: Partial<FakeTarget>) {
    super();
    Object.assign(this, target);
  }
}
