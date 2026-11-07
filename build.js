// Vercel / 本番デプロイ用ビルドスクリプト
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('[Build] Starting standalone static site build for Vercel...');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 再帰的ディレクトリーコピー
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ルート直下のコピー対象ファイル
const filesToCopy = [
  'index.html',
  'bundled.js',
  'sw.js',
  'manifest.json',
  'icon-192.svg',
  'icon-512.svg',
  'apple-touch-icon.png',
  'favicon.ico',
  'robots.txt',
  'audio_map.json',
  'audio_phrases.json'
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Build] Copied ${file} -> dist/`);
  }
}

// フォルダのコピー (css, js, data)
copyDirRecursive(path.join(__dirname, 'css'), path.join(distDir, 'css'));
copyDirRecursive(path.join(__dirname, 'js'), path.join(distDir, 'js'));
copyDirRecursive(path.join(__dirname, 'data'), path.join(distDir, 'data'));
console.log('[Build] Copied folders (css, js, data) -> dist/');

console.log('[Build] Static site production build completed successfully with exit code 0!');
process.exit(0);
