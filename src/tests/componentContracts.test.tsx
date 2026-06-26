import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { DecisionBadge } from '../renderer/components/DecisionBadge';
import { Filmstrip } from '../renderer/components/Filmstrip';
import { MetadataSidebar } from '../renderer/components/MetadataSidebar';
import { ReviewSurface } from '../renderer/components/ReviewSurface';
import type { Decision, ImageAsset } from '../shared/types';

describe('renderer component contracts', () => {
  it('shows decision overlays with accessible labels for the accepted decision language', () => {
    const labelsByDecision: Record<Decision, string> = {
      edit: 'Edit',
      keep: 'Keep',
      reject: 'Reject',
    };
    const decisions: Decision[] = ['edit', 'keep', 'reject'];

    for (const decision of decisions) {
      const markup = renderToStaticMarkup(
        <DecisionBadge decision={decision} />,
      );

      expect(markup).toContain(`>${labelsByDecision[decision]}<`);
    }
  });

  it('keeps the main review surface focused on the image and current decision', () => {
    const markup = renderToStaticMarkup(
      <ReviewSurface
        asset={makeAsset('asset-a', { decision: 'edit' })}
        loupeEnabled={false}
      />,
    );

    expect(markup).toContain('alt="asset-a"');
    expect(markup).toContain('Edit');
  });

  it('shows a clear empty review state before a folder is selected', () => {
    const markup = renderToStaticMarkup(<ReviewSurface loupeEnabled={false} />);

    expect(textContent(markup)).toContain('Choose a folder to begin sorting.');
  });

  it('renders the whole review session as thumbnail buttons without visible filenames', () => {
    const assets = [
      makeAsset('wide-shot'),
      makeAsset('close-up', { decision: 'keep' }),
      makeAsset('portrait'),
    ];
    const markup = renderToStaticMarkup(
      <Filmstrip
        assets={assets}
        currentAssetId="close-up"
        onSelectAsset={vi.fn()}
      />,
    );

    expect(markup.match(/<button/g)).toHaveLength(3);
    expect(markup).toContain('aria-label="Show wide-shot"');
    expect(markup).toContain('aria-label="Show close-up"');
    expect(markup).toContain('aria-label="Show portrait"');
    expect(markup).toContain('Keep');
    expect(textContent(markup)).not.toContain('wide-shot');
    expect(textContent(markup)).not.toContain('close-up');
    expect(textContent(markup)).not.toContain('portrait');
  });

  it('eagerly loads the current thumbnail and lazily loads the rest of the filmstrip', () => {
    const markup = renderToStaticMarkup(
      <Filmstrip
        assets={[makeAsset('first'), makeAsset('second'), makeAsset('third')]}
        currentAssetId="second"
        onSelectAsset={vi.fn()}
      />,
    );

    expect(markup.match(/loading="eager"/g)).toHaveLength(1);
    expect(markup.match(/loading="lazy"/g)).toHaveLength(2);
    expect(markup.match(/decoding="async"/g)).toHaveLength(3);
  });

  it('keeps metadata hidden until toggled and limits visible fields to the v1 sidebar set', () => {
    const hiddenMarkup = renderToStaticMarkup(
      <MetadataSidebar asset={makeAsset('asset-a')} visible={false} />,
    );
    const visibleMarkup = renderToStaticMarkup(
      <MetadataSidebar
        asset={makeAsset('asset-a', { decision: 'reject' })}
        visible={true}
      />,
    );
    const visibleText = textContent(visibleMarkup);

    expect(hiddenMarkup).toBe('');
    expect(visibleText).toContain('Filename');
    expect(visibleText).toContain('asset-a');
    expect(visibleText).toContain('Asset type');
    expect(visibleText).toContain('JPEG');
    expect(visibleText).toContain('Decision');
    expect(visibleText).toContain('reject');
    expect(visibleText).toContain('Files');
    expect(visibleText).toContain('asset-a.JPG');
    expect(visibleText).not.toContain('EXIF');
    expect(visibleText).not.toContain('Camera');
    expect(visibleText).not.toContain('Lens');
  });
});

function makeAsset(
  id: string,
  options: { decision?: Decision; previewUrl?: string } = {},
): ImageAsset {
  return {
    basename: id,
    decision: options.decision,
    displayName: id,
    files: [
      {
        extension: '.jpg',
        modifiedAtMs: 0,
        name: `${id}.JPG`,
        path: `/photos/${id}.JPG`,
        role: 'jpeg',
        sizeBytes: 1024,
      },
    ],
    id,
    preview: {
      kind: 'jpeg',
      url: options.previewUrl ?? `cullinary-preview://asset/${id}`,
    },
    type: 'jpeg',
  };
}

function textContent(markup: string): string {
  return markup.replace(/<[^>]*>/g, '');
}
