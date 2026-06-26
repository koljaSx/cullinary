export interface RawPreviewRequest {
  assetId: string;
  rawPath: string;
}

export interface RawPreviewResult {
  error?: string;
  previewPath?: string;
  status: 'ready' | 'unsupported' | 'failed';
}

export class RawPreviewService {
  extractEmbeddedPreview(
    _request: RawPreviewRequest,
  ): Promise<RawPreviewResult> {
    return Promise.resolve({
      error: 'RAW embedded preview extraction is not wired yet.',
      status: 'unsupported',
    });
  }
}
