import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const binDir = path.join(root, 'node_modules', '.bin');

function modeHasExec(mode) {
  return (mode & 0o111) !== 0;
}

function chmodExec(filePath) {
  const st = fs.statSync(filePath);
  if (modeHasExec(st.mode)) return;

  const newMode = st.mode | 0o111;
  fs.chmodSync(filePath, newMode);
}

try {
  if (!fs.existsSync(binDir)) {
    console.log('[fixNodeBinPermissions] node_modules/.bin not found - skipping');
    process.exit(0);
  }

  const entries = fs.readdirSync(binDir);
  const candidates = entries
    .map((name) => path.join(binDir, name))
    .filter((p) => {
      try {
        const st = fs.lstatSync(p);
        return st.isFile();
      } catch {
        return false;
      }
    });

  const focused = candidates.filter((p) => /(^|\\|\/)(vite|eslint|tsc|webpack|next|nuxt)/i.test(p));
  const all = focused.length > 0 ? focused : candidates;

  for (const filePath of all) {
    try {
      chmodExec(filePath);
    } catch (err) {
      console.warn('[fixNodeBinPermissions] chmod failed for', filePath, err?.message || err);
    }
  }

  console.log(`[fixNodeBinPermissions] Updated exec permissions for ${all.length} file(s) in .bin`);
  process.exit(0);
} catch (err) {
  console.warn('[fixNodeBinPermissions] unexpected error:', err?.message || err);
  process.exit(0);
}

