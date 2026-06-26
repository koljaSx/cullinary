import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      'node_modules/**',
      '.pnpm-store/**',
      '.vite/**',
      'dist/**',
      'out/**',
    ],
    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.test.tsx'],
  },
});
