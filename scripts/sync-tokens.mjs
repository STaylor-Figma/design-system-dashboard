import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dest = join(here, '..', 'assets', 'tokens.css');
const require = createRequire(import.meta.url);

let pkgDir;
try {
  pkgDir = dirname(require.resolve('@unified_design_system/design-tokens/package.json'));
} catch (err) {
  console.error('@unified_design_system/design-tokens is not installed. Run "npm install" (and check Cloudsmith auth).');
  process.exit(1);
}

const src = join(pkgDir, 'dist', 'css', 'tokens.css');
if (!existsSync(src)) {
  console.error(`Package is installed but ${src} is missing.`);
  console.error('Run "npm run tokens" inside packages/design-tokens (or "npm run tokens" at the UDS monorepo root), then re-run sync:tokens.');
  process.exit(1);
}

mkdirSync(dirname(dest), { recursive: true });

try {
  copyFileSync(src, dest);
} catch (err) {
  console.error(`Failed to copy ${src} -> ${dest}: ${err.message}`);
  console.error('Verify that the assets/ directory is writable.');
  process.exit(1);
}

const written = statSync(dest);
const original = statSync(src);
if (written.size !== original.size || written.size === 0) {
  console.error(`Copy verification failed: ${dest} is ${written.size} bytes, expected ${original.size}.`);
  process.exit(1);
}

console.log(`Synced ${src} -> ${dest} (${written.size} bytes)`);
