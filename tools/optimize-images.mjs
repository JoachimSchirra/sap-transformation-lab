import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { assertNoSymlinkComponents } from './safe-paths.mjs';

const root = process.cwd();
const inputDir = path.join(root, '_media-source');
const outputDir = path.join(root, 'assets/images/generated');
const stagingDir = path.join(root, 'assets/images/.generated-staging');
const backupDir = path.join(root, 'assets/images/.generated-backup');
const widths = [480, 800, 1200, 1600];
const allowed = new Set(['.png', '.jpg', '.jpeg', '.tif', '.tiff', '.webp']);
const maxSourceBytes = 25 * 1024 * 1024;
const maxDimension = 12000;
const maxPixels = 60_000_000;

assertNoSymlinkComponents(root, inputDir, '_media-source');
assertNoSymlinkComponents(root, path.dirname(outputDir), 'assets/images');
await fs.mkdir(inputDir, { recursive: true });
const entries = await fs.readdir(inputDir, { withFileTypes: true });
const manifest = Object.create(null);
const plans = [];

for (const entry of entries) {
  if (entry.isSymbolicLink()) throw new Error(`${entry.name}: symbolische Links sind als Medienquelle nicht zulässig`);
  if (!entry.isFile()) continue;
  if (entry.name === '.gitkeep') continue;
  if (!allowed.has(path.extname(entry.name).toLowerCase())) throw new Error(`${entry.name}: Dateiformat ist nicht freigegeben`);
  const source = path.join(inputDir, entry.name);
  const base = path.basename(entry.name, path.extname(entry.name)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!base) throw new Error(`${entry.name}: Dateiname enthält keinen sicheren Slug`);
  if (manifest[base]) throw new Error(`${entry.name}: normalisierter Dateiname kollidiert mit einem anderen Bild`);
  const sourceSize = (await fs.stat(source)).size;
  if (sourceSize > maxSourceBytes) throw new Error(`${entry.name}: Quelldatei ist größer als 25 MB`);
  const metadata = await sharp(source).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`${entry.name}: Bildabmessungen konnten nicht gelesen werden`);
  if (metadata.width > maxDimension || metadata.height > maxDimension || metadata.width * metadata.height > maxPixels) {
    throw new Error(`${entry.name}: Bildabmessungen überschreiten das Sicherheitslimit`);
  }
  const targetWidths = widths.filter(width => width <= metadata.width);
  if (!targetWidths.length) targetWidths.push(metadata.width);
  manifest[base] = { width: metadata.width, height: metadata.height, variants: [] };
  plans.push({ source, base, metadata, targetWidths });
}

for (const directory of [stagingDir, backupDir]) {
  assertNoSymlinkComponents(root, directory, directory);
  await fs.rm(directory, { recursive: true, force: true });
}
await fs.mkdir(stagingDir, { recursive: true });

for (const { source, base, targetWidths } of plans) {
  for (const width of targetWidths) {
    for (const format of ['webp', 'avif']) {
      const filename = `${base}-${width}.${format}`;
      const pipeline = sharp(source, { limitInputPixels: maxPixels, failOn: 'warning' }).rotate().resize({ width, withoutEnlargement: true });
      await (format === 'webp' ? pipeline.webp({ quality: 82 }) : pipeline.avif({ quality: 50 })).toFile(path.join(stagingDir, filename));
      manifest[base].variants.push({ format, width, path: `/assets/images/generated/${filename}` });
    }
  }
}

await fs.writeFile(path.join(stagingDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
let previousMoved = false;
try {
  if (await fs.stat(outputDir).then(() => true).catch(() => false)) {
    assertNoSymlinkComponents(root, outputDir, 'bestehender Medienoutput');
    await fs.rename(outputDir, backupDir);
    previousMoved = true;
  }
  await fs.rename(stagingDir, outputDir);
  if (previousMoved) await fs.rm(backupDir, { recursive: true, force: true });
} catch (error) {
  if (previousMoved && !(await fs.stat(outputDir).then(() => true).catch(() => false))) await fs.rename(backupDir, outputDir);
  throw error;
}
console.log(`Optimierte Bildsätze: ${Object.keys(manifest).length}`);
