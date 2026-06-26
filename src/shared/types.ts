export type Decision = 'reject' | 'keep' | 'edit';

export type OutputBucket = '_edit' | '_keep' | '_reject';

export type AssetType = 'raw+jpeg' | 'raw' | 'jpeg';

export type AssetFileRole = 'raw' | 'jpeg' | 'sidecar';

export type RawImageExtension =
  | '.cr2'
  | '.cr3'
  | '.nef'
  | '.arw'
  | '.raf'
  | '.rw2'
  | '.orf'
  | '.dng';

export type JpegExtension = '.jpg' | '.jpeg';

export type SidecarExtension = '.xmp';

export type SupportedImageExtension = JpegExtension | RawImageExtension;

export type AssetFileExtension = SupportedImageExtension | SidecarExtension;

export interface AssetFile {
  extension: AssetFileExtension;
  modifiedAtMs: number;
  name: string;
  path: string;
  role: AssetFileRole;
  sizeBytes: number;
}

export interface AssetPreview {
  kind: 'jpeg' | 'raw-embedded' | 'unavailable';
  url?: string;
}

export interface ImageAsset {
  basename: string;
  decision?: Decision;
  displayName: string;
  files: AssetFile[];
  id: string;
  preview: AssetPreview;
  type: AssetType;
}

export interface FolderScanResult {
  assets: ImageAsset[];
  folderPath: string;
  generatedAt: string;
  session?: ReviewSessionSnapshot;
  unsupportedFiles: string[];
}

export interface ReviewSessionSnapshot {
  activeAssetId?: string;
  decisions: Record<string, Decision>;
  folderPath: string;
  savedAt: string;
  version: 1;
}

export interface SaveDecisionRequest {
  activeAssetId: string;
  assetIds: string[];
  decisions: Record<string, Decision>;
  folderPath: string;
}

export interface MovePlanRequest {
  decisions: Record<string, Decision>;
  folderPath: string;
}

export type ConflictResolution = 'skip' | 'rename';

export interface MovePlanFile {
  conflict: boolean;
  destinationPath: string;
  extension: string;
  name: string;
  resolvedDestinationPath?: string;
  sourcePath: string;
}

export interface MovePlanItem {
  assetId: string;
  conflict: boolean;
  decision: Decision;
  files: MovePlanFile[];
  resolution?: ConflictResolution;
  status: 'ready' | 'conflict';
}

export interface MovePlan {
  createdAt: string;
  folderPath: string;
  items: MovePlanItem[];
}

export interface CullinaryApi {
  chooseFolder: () => Promise<FolderScanResult | null>;
  createMovePlan: (request: MovePlanRequest) => Promise<MovePlan>;
  loadSession: (folderPath: string) => Promise<ReviewSessionSnapshot | null>;
  rescanFolder: (folderPath: string) => Promise<FolderScanResult>;
  saveDecision: (
    request: SaveDecisionRequest,
  ) => Promise<ReviewSessionSnapshot>;
}
