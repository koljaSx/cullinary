/// <reference types="vite/client" />

import type { CullinaryApi } from '../shared/types';

declare global {
  interface Window {
    cullinary: CullinaryApi;
  }
}
