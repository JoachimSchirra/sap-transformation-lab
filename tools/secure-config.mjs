import fs from 'node:fs';
import YAML from 'yaml';

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function assertPlain(value, location = 'root') {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertPlain(item, `${location}[${index}]`));
    return;
  }
  if (typeof value !== 'object') throw new Error(`${location}: nicht unterstützter YAML-Typ`);
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) throw new Error(`${location}.${key}: verbotener Konfigurationsschlüssel`);
    assertPlain(item, `${location}.${key}`);
  }
}

export function parseYamlStrict(source, label = 'YAML') {
  const document = YAML.parseDocument(source, { uniqueKeys: true, merge: false, maxAliasCount: 0 });
  if (document.errors.length) throw new Error(`${label}: ${document.errors.map(error => error.message).join('; ')}`);
  const value = document.toJS({ mapAsMap: false, maxAliasCount: 0 }) || {};
  assertPlain(value, label);
  return value;
}

export function readYamlStrict(file) {
  return parseYamlStrict(fs.readFileSync(file, 'utf8'), file);
}

export function ownBoolean(object, key, expected) {
  return object !== null && typeof object === 'object' && Object.hasOwn(object, key)
    && typeof object[key] === 'boolean' && object[key] === expected;
}

export function mergeKnown(base, overlay, schema, location = 'config') {
  const result = Object.create(null);
  const sourceBase = base && typeof base === 'object' && !Array.isArray(base) ? base : {};
  const sourceOverlay = overlay && typeof overlay === 'object' && !Array.isArray(overlay) ? overlay : {};
  for (const key of Object.keys(sourceOverlay)) {
    if (!Object.hasOwn(schema, key)) throw new Error(`${location}.${key}: unbekannter Konfigurationsschlüssel im Overlay`);
  }
  for (const [key, rule] of Object.entries(schema)) {
    const hasOverlay = Object.hasOwn(sourceOverlay, key);
    const hasBase = Object.hasOwn(sourceBase, key);
    if (!hasOverlay && !hasBase) continue;
    const value = hasOverlay ? sourceOverlay[key] : sourceBase[key];
    if (rule && typeof rule === 'object' && !Array.isArray(rule)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${location}.${key}: Objekt erwartet`);
      result[key] = mergeKnown(hasBase ? sourceBase[key] : {}, hasOverlay ? sourceOverlay[key] : {}, rule, `${location}.${key}`);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export const PRODUCTION_OVERLAY_SCHEMA = {
  environment: true,
  production_ready: true,
  repository_public: true,
  security: { review_approved: true, reviewed_at: true },
  legal: { approved: true, imprint_complete: true, privacy_complete: true, reviewed_at: true },
  contact: { enabled: true, email: true, linkedin: true },
  analytics: { enabled: true, provider: true, token: true }
};

function cloneSafe(value, location = 'config') {
  assertPlain(value, location);
  if (Array.isArray(value)) return value.map((item, index) => cloneSafe(item, `${location}[${index}]`));
  if (value && typeof value === 'object') {
    const result = Object.create(null);
    for (const [key, item] of Object.entries(value)) result[key] = cloneSafe(item, `${location}.${key}`);
    return result;
  }
  return value;
}

export function mergeProductionConfig(base, overlay) {
  const result = cloneSafe(base);
  const approved = mergeKnown({}, overlay, PRODUCTION_OVERLAY_SCHEMA, 'production');
  for (const [key, value] of Object.entries(approved)) result[key] = value;
  return result;
}

function isCalendarDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function validateRuntimeConfig(config, { production = false, expectedCommit = '' } = {}) {
  const failures = [];
  const booleanPaths = [
    ['production_ready', config.production_ready], ['repository_public', config.repository_public],
    ['contact.enabled', config.contact?.enabled], ['analytics.enabled', config.analytics?.enabled]
  ];
  for (const [name, value] of booleanPaths) if (typeof value !== 'boolean') failures.push(`${name} muss boolesch sein`);
  if (!['prototype', 'production'].includes(config.environment)) failures.push('environment ist ungültig');
  if (config.analytics?.provider !== 'cloudflare') failures.push('analytics.provider ist nicht freigegeben');
  if (config.analytics?.token && !/^[A-Za-z0-9_-]{20,80}$/.test(config.analytics.token)) failures.push('analytics.token hat ein ungültiges Format');
  if (production) {
    if (config.environment !== 'production') failures.push('environment muss production sein');
    if (!ownBoolean(config, 'production_ready', true)) failures.push('production_ready muss als eigene boolesche Eigenschaft true sein');
    if (!ownBoolean(config.security, 'review_approved', true)) failures.push('security.review_approved muss als eigene boolesche Eigenschaft true sein');
    for (const key of ['approved', 'imprint_complete', 'privacy_complete']) {
      if (!ownBoolean(config.legal, key, true)) failures.push(`legal.${key} muss als eigene boolesche Eigenschaft true sein`);
    }
    if (!/^[0-9a-f]{40}$/.test(expectedCommit)) failures.push('erwarteter Releasecommit (GITHUB_SHA) muss ein vollständiger Commit-SHA sein');
    for (const group of ['security', 'legal']) {
      if (!isCalendarDate(config[group]?.reviewed_at)) failures.push(`${group}.reviewed_at muss ein reales Kalenderdatum im Format YYYY-MM-DD sein`);
    }
    if (config.analytics.enabled === true && !config.analytics.token) failures.push('aktiviertes Analytics benötigt ein geprüftes Token');
  }
  return failures;
}
