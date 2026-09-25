import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const OUTPUT_DIRECTORIES = new Set(['_preview', '_artifacts', '_site', '_serve']);

function isWithin(parent, candidate, allowSame = false) {
  const relative = path.relative(parent, candidate);
  if (allowSame && relative === '') return true;
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function existingAncestor(candidate) {
  let current = candidate;
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return current;
}

export function assertNoSymlinkComponents(root, candidate, label) {
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(candidate);
  if (!isWithin(resolvedRoot, resolved, true)) throw new Error(`${label} verlässt das Projektverzeichnis: ${resolved}`);
  let current = resolvedRoot;
  for (const segment of path.relative(resolvedRoot, resolved).split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    if (!fs.existsSync(current)) continue;
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`${label} enthält einen symbolischen Link: ${current}`);
  }
  const rootAncestor = existingAncestor(resolvedRoot);
  const rootRealAncestor = fs.realpathSync(rootAncestor);
  const resolvedAncestor = existingAncestor(resolved);
  const ancestorReal = fs.realpathSync(resolvedAncestor);
  const expectedAncestorReal = path.resolve(rootRealAncestor, path.relative(rootAncestor, resolvedAncestor));
  if (ancestorReal !== expectedAncestorReal) throw new Error(`${label} besitzt einen externen realen Pfad: ${ancestorReal}`);
  return resolved;
}

export function safeProjectDirectory(root, candidate, label) {
  const resolvedRoot = fs.realpathSync(path.resolve(root));
  const resolved = path.resolve(candidate);
  const forbidden = new Set([path.parse(resolved).root, resolvedRoot, path.resolve(os.homedir())]);
  if (forbidden.has(resolved) || !isWithin(resolvedRoot, resolved) || !OUTPUT_DIRECTORIES.has(path.basename(resolved)) || path.dirname(resolved) !== resolvedRoot) {
    throw new Error(`${label} muss eines der freigegebenen Projekt-Ausgabeverzeichnisse sein: ${[...OUTPUT_DIRECTORIES].join(', ')}`);
  }
  return assertNoSymlinkComponents(resolvedRoot, resolved, label);
}

export function safeProjectFile(root, candidate, label, extension) {
  const resolvedRoot = fs.realpathSync(path.resolve(root));
  const resolved = path.resolve(candidate);
  const artifacts = path.join(resolvedRoot, '_artifacts');
  if (!isWithin(artifacts, resolved) || path.dirname(resolved) !== artifacts) {
    throw new Error(`${label} muss unmittelbar im freigegebenen _artifacts-Verzeichnis liegen: ${resolved}`);
  }
  if (extension && path.extname(resolved).toLowerCase() !== extension.toLowerCase()) {
    throw new Error(`${label} muss die Dateiendung ${extension} besitzen: ${resolved}`);
  }
  assertNoSymlinkComponents(resolvedRoot, artifacts, label);
  return assertNoSymlinkComponents(resolvedRoot, resolved, label);
}

export function validateRoute(route, label = 'Permalink') {
  if (route === '/') return route;
  if (route === '/404.html') return route;
  if (typeof route !== 'string' || route.includes('\\') || /%(?:2e|2f|5c)/i.test(route) || !/^\/[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*\/$/.test(route)) {
    throw new Error(`${label} ist keine sichere interne Route: ${String(route)}`);
  }
  return route;
}

export function validateInternalUrl(value, label = 'URL') {
  if (typeof value !== 'string') throw new Error(`${label} muss eine interne URL sein`);
  return validateRoute(value, label);
}

export function validateLayoutName(name, allowed, label = 'Layout') {
  if (typeof name !== 'string' || !/^[a-z][a-z0-9-]*$/.test(name) || !allowed.has(name)) {
    throw new Error(`${label} ist nicht freigegeben: ${String(name)}`);
  }
  return name;
}

export function routeTarget(outputRoot, route) {
  validateRoute(route);
  const relative = route === '/' ? 'index.html' : route === '/404.html' ? '404.html' : `${route.slice(1)}index.html`;
  const target = path.resolve(outputRoot, relative);
  if (!isWithin(outputRoot, target)) throw new Error(`Route verlässt das Ausgabeverzeichnis: ${route}`);
  assertNoSymlinkComponents(path.dirname(outputRoot), outputRoot, 'Ausgabeverzeichnis');
  assertNoSymlinkComponents(outputRoot, target, `Route ${route}`);
  return target;
}

export function assertRegularFile(root, candidate, label) {
  const resolved = assertNoSymlinkComponents(root, candidate, label);
  const stat = fs.statSync(resolved);
  if (!stat.isFile()) throw new Error(`${label} ist keine reguläre Datei: ${resolved}`);
  return resolved;
}
