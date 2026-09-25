import fs from 'node:fs/promises';
import path from 'node:path';
import { readYamlStrict } from './secure-config.mjs';
import { safeProjectDirectory } from './safe-paths.mjs';

const root = process.cwd();
const siteRoot = safeProjectDirectory(root, process.env.LLSG_LINK_SITE || path.join(root, '_site'), 'LLSG_LINK_SITE');
const config = readYamlStrict(path.join(root, '_config.yml'));
const baseurl = config.baseurl || '';
const issues = [];

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const item = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolischer Link im Buildartefakt: ${item}`);
    result.push(...(entry.isDirectory() ? await walk(item) : [item]));
  }
  return result;
}

const files = await walk(siteRoot);
const relativeFiles = new Set(files.map(file => path.relative(siteRoot, file).replaceAll(path.sep, '/')));
for (const file of files.filter(item => item.endsWith('.html'))) {
  const html = await fs.readFile(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(raw)) continue;
    let url;
    try { url = decodeURI(raw.split(/[?#]/)[0]); } catch { issues.push(`${file}: ungültige URL-Kodierung ${raw}`); continue; }
    if (baseurl && url.startsWith(`${baseurl}/`)) url = url.slice(baseurl.length);
    if (!url.startsWith('/')) continue;
    let target = url.slice(1);
    if (!target || target.endsWith('/')) target += 'index.html';
    if (!path.extname(target)) target += '/index.html';
    if (!relativeFiles.has(target)) issues.push(`${path.relative(root, file)}: totes internes Ziel ${raw}`);
  }
}

console.log(JSON.stringify({ checkedFiles: files.length, issues }, null, 2));
process.exitCode = issues.length ? 1 : 0;
