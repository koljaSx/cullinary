import type {
  AssetFileExtension,
  Decision,
  JpegExtension,
  OutputBucket,
  RawImageExtension,
  SidecarExtension,
  SupportedImageExtension,
} from './types';

export const JPEG_EXTENSIONS: readonly JpegExtension[] = ['.jpg', '.jpeg'];

export const RAW_IMAGE_EXTENSIONS: readonly RawImageExtension[] = [
  '.cr2',
  '.cr3',
  '.nef',
  '.arw',
  '.raf',
  '.rw2',
  '.orf',
  '.dng',
];

export const SUPPORTED_IMAGE_EXTENSIONS: readonly SupportedImageExtension[] = [
  ...JPEG_EXTENSIONS,
  ...RAW_IMAGE_EXTENSIONS,
];

export const SIDECAR_EXTENSIONS: readonly SidecarExtension[] = ['.xmp'];

export const OUTPUT_BUCKETS: Record<Decision, OutputBucket> = {
  edit: '_edit',
  keep: '_keep',
  reject: '_reject',
};

export const SESSION_FILE_NAME = '_cullinary-session.json';

const SUPPORTED_IMAGE_EXTENSION_SET: ReadonlySet<string> = new Set<string>(
  SUPPORTED_IMAGE_EXTENSIONS,
);
const RAW_IMAGE_EXTENSION_SET: ReadonlySet<string> = new Set<string>(
  RAW_IMAGE_EXTENSIONS,
);
const JPEG_EXTENSION_SET: ReadonlySet<string> = new Set<string>(
  JPEG_EXTENSIONS,
);
const SIDECAR_EXTENSION_SET: ReadonlySet<string> = new Set<string>(
  SIDECAR_EXTENSIONS,
);

export function normalizeExtension(extension: string): string {
  return extension.toLowerCase();
}

export function isSupportedImageExtension(extension: string): boolean {
  return toSupportedImageExtension(extension) !== null;
}

export function isRawImageExtension(extension: string): boolean {
  return toRawImageExtension(extension) !== null;
}

export function isJpegExtension(extension: string): boolean {
  return toJpegExtension(extension) !== null;
}

export function isSidecarExtension(extension: string): boolean {
  return toSidecarExtension(extension) !== null;
}

export function toAssetFileExtension(
  extension: string,
): AssetFileExtension | null {
  const normalizedExtension = normalizeExtension(extension);

  if (
    isSupportedImageExtensionValue(normalizedExtension) ||
    isSidecarExtensionValue(normalizedExtension)
  ) {
    return normalizedExtension;
  }

  return null;
}

export function toSupportedImageExtension(
  extension: string,
): SupportedImageExtension | null {
  const normalizedExtension = normalizeExtension(extension);

  return isSupportedImageExtensionValue(normalizedExtension)
    ? normalizedExtension
    : null;
}

export function toRawImageExtension(
  extension: string,
): RawImageExtension | null {
  const normalizedExtension = normalizeExtension(extension);

  return isRawImageExtensionValue(normalizedExtension)
    ? normalizedExtension
    : null;
}

export function toJpegExtension(extension: string): JpegExtension | null {
  const normalizedExtension = normalizeExtension(extension);

  return isJpegExtensionValue(normalizedExtension) ? normalizedExtension : null;
}

export function toSidecarExtension(extension: string): SidecarExtension | null {
  const normalizedExtension = normalizeExtension(extension);

  return isSidecarExtensionValue(normalizedExtension)
    ? normalizedExtension
    : null;
}

function isSupportedImageExtensionValue(
  extension: string,
): extension is SupportedImageExtension {
  return SUPPORTED_IMAGE_EXTENSION_SET.has(extension);
}

function isRawImageExtensionValue(
  extension: string,
): extension is RawImageExtension {
  return RAW_IMAGE_EXTENSION_SET.has(extension);
}

function isJpegExtensionValue(extension: string): extension is JpegExtension {
  return JPEG_EXTENSION_SET.has(extension);
}

function isSidecarExtensionValue(
  extension: string,
): extension is SidecarExtension {
  return SIDECAR_EXTENSION_SET.has(extension);
}
