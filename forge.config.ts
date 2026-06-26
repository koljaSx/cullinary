import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { VitePlugin } from '@electron-forge/plugin-vite';
import type { ForgeConfig } from '@electron-forge/shared-types';

const electronZipDir = process.env.ELECTRON_ZIP_DIR;

const config: ForgeConfig = {
  makers: [new MakerZIP({}, ['darwin'])],
  packagerConfig: {
    appBundleId: 'app.cullinary.local',
    asar: true,
    ...(electronZipDir ? { electronZipDir } : {}),
    executableName: 'Cullinary',
    icon: 'assets/app-icon',
  },
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      build: [
        {
          config: 'vite.main.config.ts',
          entry: 'src/main/main.ts',
          target: 'main',
        },
        {
          config: 'vite.preload.config.ts',
          entry: 'src/preload/preload.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          config: 'vite.renderer.config.ts',
          name: 'main_window',
        },
      ],
    }),
  ],
  rebuildConfig: {},
};

export default config;
