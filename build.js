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

// コピー対象ファイル・フォルダ
const filesToCopy = [
  'index.html',
  'bundled.js',
  'sw.js',
  'manifest.json',
  'icon-192.svg',
  'icon-512.svg',
  'apple-touch-icon.png',
  'favicon.ico',
  'robots.txt'
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[Build] Copied ${file} -> dist/`);
  }
}

// css/ ディレクトリがあればコピー
const cssDir = path.join(__dirname, 'css');
if (fs.existsSync(cssDir)) {
  const destCssDir = path.join(distDir, 'css');
  if (!fs.existsSync(destCssDir)) fs.mkdirSync(destCssDir, { recursive: true });
  for (const f of fs.readdirSync(cssDir)) {
    fs.copyFileSync(path.join(cssDir, f), path.join(destCssDir, f));
  }
  console.log('[Build] Copied css/ -> dist/css/');
}

console.log('[Build] Static site production build completed successfully with exit code 0!');
process.exit(0);
