import fs from 'node:fs/promises';
import path from 'node:path';
import { safeProjectDirectory } from './safe-paths.mjs';
import { readYamlStrict } from './secure-config.mjs';

const root = process.cwd();
const siteRoot = safeProjectDirectory(root, path.join(root, '_site'), '_site');
const serveRoot = safeProjectDirectory(root, path.join(root, '_serve'), '_serve');
const config = readYamlStrict(path.join(root, '_config.yml'));
const segment = String(config.baseurl || '').replace(/^\//, '');
if (!/^[a-z0-9][a-z0-9-]*$/.test(segment)) throw new Error(`Unsichere oder leere baseurl: ${config.baseurl}`);
async function rejectSymlinks(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const item = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolischer Link im Jekyll-Artefakt: ${item}`);
    if (entry.isDirectory()) await rejectSymlinks(item);
  }
}
await rejectSymlinks(siteRoot);
await fs.rm(serveRoot, { recursive: true, force: true });
await fs.mkdir(serveRoot, { recursive: true });
await fs.cp(siteRoot, path.join(serveRoot, segment), { recursive: true });
console.log(`Lokaler Prüfbaum: /${segment}/`);
