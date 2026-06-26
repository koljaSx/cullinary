#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const packageJson = JSON.parse(
  readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
);
const electronRange =
  packageJson.devDependencies?.electron ?? packageJson.dependencies?.electron;
const electronVersion = electronRange?.match(/\d+\.\d+\.\d+(?:[-\w.]+)?/)?.[0];
const platform = process.env.npm_config_platform ?? process.platform;
const arch = process.env.npm_config_arch ?? process.arch;
const zipName = electronVersion
  ? `electron-v${electronVersion}-${platform}-${arch}.zip`
  : undefined;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function findElectronZipDir(cacheRoot) {
  if (!zipName || !existsSync(cacheRoot)) {
    return undefined;
  }

  const queue = [cacheRoot];
  let visited = 0;

  while (queue.length > 0 && visited < 5000) {
    const currentDir = queue.shift();
    visited += 1;

    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);

      if (entry.isFile() && entry.name === zipName) {
        return currentDir;
      }

      if (entry.isDirectory()) {
        queue.push(entryPath);
      }
    }
  }

  return undefined;
}

if (!electronVersion || !zipName) {
  fail('Could not infer the Electron version from package.json.');
}

const cacheRoot =
  process.env.ELECTRON_CACHE ??
  (platform === 'darwin'
    ? path.join(os.homedir(), 'Library', 'Caches', 'electron')
    : path.join(os.homedir(), '.cache', 'electron'));

const electronZipDir =
  process.env.ELECTRON_ZIP_DIR ?? findElectronZipDir(cacheRoot);
const env = { ...process.env };
const localForgeBin = path.join(
  projectRoot,
  'node_modules',
  '.bin',
  'electron-forge',
);
const npmExecPath = process.env.npm_execpath;
const forgeCommand = existsSync(localForgeBin)
  ? process.execPath
  : npmExecPath && /\.(?:c|m)?js$/.test(npmExecPath)
    ? process.execPath
    : (npmExecPath ?? 'pnpm');
const forgeArgs = existsSync(localForgeBin)
  ? [localForgeBin, 'package']
  : [
      ...(npmExecPath && /\.(?:c|m)?js$/.test(npmExecPath)
        ? [npmExecPath]
        : []),
      'exec',
      'electron-forge',
      'package',
    ];

if (electronZipDir) {
  env.ELECTRON_ZIP_DIR = electronZipDir;
  console.log(
    `Using cached Electron ZIP: ${path.join(electronZipDir, zipName)}`,
  );
} else {
  console.warn(
    `No cached ${zipName} found under ${cacheRoot}; Electron Forge may try to download it.`,
  );
}

const forgeResult = spawnSync(forgeCommand, forgeArgs, {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
});

if (forgeResult.status !== 0) {
  process.exit(forgeResult.status ?? 1);
}

if (platform === 'darwin') {
  const appPath = path.join(
    projectRoot,
    'out',
    `Cullinary-${platform}-${arch}`,
    'Cullinary.app',
  );

  if (!existsSync(appPath)) {
    fail(`Expected packaged app at ${appPath}, but it was not created.`);
  }

  const signResult = spawnSync(
    'codesign',
    ['--force', '--deep', '--sign', '-', appPath],
    {
      cwd: projectRoot,
      stdio: 'inherit',
    },
  );

  if (signResult.status !== 0) {
    process.exit(signResult.status ?? 1);
  }

  const verifyResult = spawnSync(
    'codesign',
    ['--verify', '--deep', '--strict', appPath],
    {
      cwd: projectRoot,
      stdio: 'inherit',
    },
  );

  if (verifyResult.status !== 0) {
    process.exit(verifyResult.status ?? 1);
  }

  console.log(`Packaged and ad-hoc signed ${appPath}`);
}
