import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { assertNoSymlinkComponents } from './safe-paths.mjs';

const MAX_PUBLIC_BYTES = Math.floor(1.5 * 1024 * 1024);
const MAX_DIMENSION = 12000;
const MAX_PIXELS = 60_000_000;
const VARIANT_FORMATS = new Set(['webp', 'avif']);
const METADATA_FIELDS = ['exif', 'icc', 'iptc', 'xmp'];
const FIXED_BRAND_ASSETS = Object.freeze({
  '/assets/images/favicon.svg': Object.freeze({ format: 'svg', width: 64, height: 64, sha256: 'ff2fba0635e08ee785b65f59dc689eb8268fa49e9de3dea438570cbe5b252bd9' }),
  '/assets/images/llsg-logo.optimized.png': Object.freeze({ format: 'png', width: 1152, height: 768, sha256: '2790fef89c5fd5fc029784d6fef2d44e0176d6f6ea068e09257eeeea1f35e038' }),
  '/assets/images/llsg-logo.png': Object.freeze({ format: 'png', width: 1152, height: 768, sha256: '463c2fc1103fb7b0f992f12a2e9892bfeaecb09b920eafb247f72a21c229dcae' }),
  '/assets/images/llsg-logo.webp': Object.freeze({ format: 'webp', width: 1152, height: 768, sha256: '9ad5420743aa54300a54e8de5f23306ad0d5d57ac12f79074520a502d7daefe1' }),
  '/assets/images/social-preview.jpg': Object.freeze({ format: 'jpeg', width: 1200, height: 630, sha256: 'a3bfe09e599e949e407d3e5e9a1363421c0c745501fd1fc4e79bb4c0d6858685' })
});

function assertExactKeys(value, allowed, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}: Objekt erwartet`);
  for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error(`${label}.${key}: unbekannter Schlüssel`);
}

function assertSafeRecord(value, label = 'manifest') {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSafeRecord(item, `${label}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') throw new Error(`${label}: nicht unterstützter Wert`);
  for (const [key, item] of Object.entries(value)) {
    if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error(`${label}.${key}: verbotener Schlüssel`);
    if (item && typeof item === 'object') assertSafeRecord(item, `${label}.${key}`);
  }
}

async function decodeAndInspect(root, file, label) {
  assertNoSymlinkComponents(root, file, label);
  const stat = await fs.stat(file);
  if (!stat.isFile()) throw new Error(`${label}: keine reguläre Datei`);
  if (stat.size > MAX_PUBLIC_BYTES) throw new Error(`${label}: größer als 1,5 MB`);
  const image = sharp(file, { limitInputPixels: MAX_PIXELS, failOn: 'warning' });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error(`${label}: Bildabmessungen fehlen`);
  if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION || metadata.width * metadata.height > MAX_PIXELS) {
    throw new Error(`${label}: Bildabmessungen überschreiten das Sicherheitslimit`);
  }
  for (const field of METADATA_FIELDS) if (metadata[field]?.length) throw new Error(`${label}: unerlaubte ${field.toUpperCase()}-Metadaten`);
  await sharp(file, { limitInputPixels: MAX_PIXELS, failOn: 'warning' }).resize({ width: 1, height: 1, fit: 'inside' }).toBuffer();
  return metadata;
}

export async function validateFixedBrandAssets(root) {
  const directory = path.join(root, 'assets/images');
  assertNoSymlinkComponents(root, directory, 'Markenasset-Verzeichnis');
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const allowedNames = new Set(Object.keys(FIXED_BRAND_ASSETS).map(item => path.basename(item)));
  for (const entry of entries) {
    if (entry.name === 'generated' && entry.isDirectory() && !entry.isSymbolicLink()) continue;
    if (entry.isSymbolicLink() || !entry.isFile() || !allowedNames.has(entry.name)) {
      throw new Error(`assets/images/${entry.name}: nicht in der unveränderlichen Markenasset-Allowlist`);
    }
  }
  for (const [publicPath, expected] of Object.entries(FIXED_BRAND_ASSETS)) {
    const file = path.join(root, publicPath.slice(1));
    const metadata = await decodeAndInspect(root, file, publicPath);
    const digest = createHash('sha256').update(await fs.readFile(file)).digest('hex');
    if (metadata.format !== expected.format || metadata.width !== expected.width || metadata.height !== expected.height || digest !== expected.sha256) {
      throw new Error(`${publicPath}: Markenasset stimmt nicht mit Format, Abmessungen und SHA-256-Allowlist überein`);
    }
  }
  return new Set(Object.keys(FIXED_BRAND_ASSETS));
}

export async function validateGeneratedMedia(root) {
  const directory = path.join(root, 'assets/images/generated');
  const manifestFile = path.join(directory, 'manifest.json');
  assertNoSymlinkComponents(root, directory, 'Public-Medienverzeichnis');
  assertNoSymlinkComponents(root, manifestFile, 'Public-Medienmanifest');
  const manifest = JSON.parse(await fs.readFile(manifestFile, 'utf8'));
  assertSafeRecord(manifest);
  const expected = new Set(['manifest.json']);

  for (const [slug, record] of Object.entries(manifest)) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error(`manifest.${slug}: unsicherer Medien-Slug`);
    assertExactKeys(record, new Set(['width', 'height', 'variants']), `manifest.${slug}`);
    if (!Number.isInteger(record.width) || record.width < 1 || record.width > MAX_DIMENSION) throw new Error(`manifest.${slug}.width: ungültig`);
    if (!Number.isInteger(record.height) || record.height < 1 || record.height > MAX_DIMENSION || record.width * record.height > MAX_PIXELS) throw new Error(`manifest.${slug}.height: ungültig`);
    if (!Array.isArray(record.variants) || !record.variants.length) throw new Error(`manifest.${slug}.variants: nichtleere Liste erwartet`);
    for (const [index, variant] of record.variants.entries()) {
      const label = `manifest.${slug}.variants[${index}]`;
      assertExactKeys(variant, new Set(['format', 'width', 'path']), label);
      if (!VARIANT_FORMATS.has(variant.format)) throw new Error(`${label}.format: nicht freigegeben`);
      if (!Number.isInteger(variant.width) || variant.width < 1 || variant.width > record.width) throw new Error(`${label}.width: ungültig`);
      const filename = `${slug}-${variant.width}.${variant.format}`;
      const expectedPath = `/assets/images/generated/${filename}`;
      if (variant.path !== expectedPath) throw new Error(`${label}.path: muss exakt ${expectedPath} sein`);
      if (expected.has(filename)) throw new Error(`${label}: doppeltes Derivat ${filename}`);
      expected.add(filename);
      const metadata = await decodeAndInspect(root, path.join(directory, filename), expectedPath);
      const decodedFormat = metadata.format === 'heif' && variant.format === 'avif' ? 'avif' : metadata.format;
      if (decodedFormat !== variant.format) throw new Error(`${label}: decodiertes Format ${metadata.format} passt nicht zu ${variant.format}`);
      if (metadata.width !== variant.width) throw new Error(`${label}: decodierte Breite ${metadata.width} passt nicht zum Manifest`);
      if (metadata.height > record.height) throw new Error(`${label}: decodierte Höhe überschreitet die Quellhöhe`);
    }
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isSymbolicLink() || !entry.isFile()) throw new Error(`assets/images/generated/${entry.name}: nur reguläre Dateien sind zulässig`);
    if (!expected.has(entry.name)) throw new Error(`assets/images/generated/${entry.name}: nicht im verwalteten Manifest enthalten`);
  }
  for (const filename of expected) {
    if (!entries.some(entry => entry.name === filename)) throw new Error(`assets/images/generated/${filename}: im Manifest aufgeführt, aber nicht vorhanden`);
  }
  return { sets: Object.keys(manifest).length, files: expected.size - 1, paths: new Set([...expected].filter(name => name !== 'manifest.json').map(name => `/assets/images/generated/${name}`)) };
}

export async function validateMediaInventory(root) {
  const [generated, fixedPaths] = await Promise.all([validateGeneratedMedia(root), validateFixedBrandAssets(root)]);
  return { generatedPaths: generated.paths, fixedPaths, sets: generated.sets, generatedFiles: generated.files };
}

export function assertEditorialImagePath(value, inventory, label) {
  if (!value) return;
  if (typeof value !== 'string' || !/^\/assets\/images\/generated\/[a-z0-9][a-z0-9-]*-[1-9][0-9]*\.(?:webp|avif)$/.test(value)) {
    throw new Error(`${label}: redaktionelle Bilder müssen optimierte Derivate unter /assets/images/generated/ sein`);
  }
  if (!inventory?.generatedPaths?.has(value)) throw new Error(`${label}: Bild ist nicht im verwalteten Medienmanifest enthalten: ${value}`);
}

export function assertFixedBrandAssetPath(value, inventory, label) {
  if (typeof value !== 'string' || !inventory?.fixedPaths?.has(value)) throw new Error(`${label}: festes Markenasset ist nicht freigegeben: ${String(value)}`);
}
