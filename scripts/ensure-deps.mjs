// Installs dependencies automatically if node_modules is missing or stale,
// so `npm run dev` / `npm run build` work without a manual `npm install`.

import { existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const hasNext = existsSync('node_modules/next/package.json');
const stale =
  hasNext &&
  existsSync('package-lock.json') &&
  statSync('package.json').mtimeMs > statSync('package-lock.json').mtimeMs;

if (hasNext && !stale) process.exit(0);

console.log(hasNext ? '\n📦 package.json changed, updating dependencies...\n' : '\n📦 First run: installing dependencies...\n');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(npm, ['install', '--no-audit', '--no-fund'], { stdio: 'inherit', shell: true });

if (result.status !== 0) {
  console.error('\n❌ Dependency installation failed.\n');
  process.exit(result.status ?? 1);
}
