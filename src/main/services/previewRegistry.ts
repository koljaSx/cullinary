import { pathToFileURL } from 'node:url';

import { net, protocol } from 'electron';

const PREVIEW_SCHEME = 'cullinary-preview';

export class PreviewRegistry {
  private readonly previews = new Map<string, string>();

  register(assetId: string, filePath: string): string {
    this.previews.set(assetId, filePath);
    return `${PREVIEW_SCHEME}://asset/${encodeURIComponent(assetId)}`;
  }

  get(assetId: string): string | undefined {
    return this.previews.get(assetId);
  }

  clear(): void {
    this.previews.clear();
  }
}

export function registerPreviewProtocol(
  previewRegistry: PreviewRegistry,
): void {
  protocol.handle(PREVIEW_SCHEME, (request) => {
    const url = new URL(request.url);
    const assetId = decodeURIComponent(url.pathname.replace(/^\//, ''));
    const previewPath = previewRegistry.get(assetId);

    if (!previewPath) {
      return new Response('Preview not found', { status: 404 });
    }

    return net.fetch(pathToFileURL(previewPath).toString());
  });
}

export function registerPreviewSchemeAsPrivileged(): void {
  protocol.registerSchemesAsPrivileged([
    {
      privileges: {
        bypassCSP: false,
        secure: true,
        standard: true,
        stream: true,
        supportFetchAPI: true,
      },
      scheme: PREVIEW_SCHEME,
    },
  ]);
}
