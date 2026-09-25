import fs from 'node:fs/promises';
import path from 'node:path';
import { Liquid } from 'liquidjs';
import { marked } from 'marked';
import { routeTarget, safeProjectDirectory, validateLayoutName, validateRoute } from './safe-paths.mjs';
import { assertFrontMatterTypes, assertSafeEditorialBody, assertSafeMarkdownUrls, isTrustedTemplatePage } from './content-security.mjs';
import { assertEditorialImagePath, assertFixedBrandAssetPath, validateMediaInventory } from './media-security.mjs';
import { parseYamlStrict, readYamlStrict, validateRuntimeConfig } from './secure-config.mjs';

const root = process.cwd();
const outputRoot = safeProjectDirectory(root, process.env.LLSG_PREVIEW_OUTPUT || path.join(root, '_preview'), 'LLSG_PREVIEW_OUTPUT');
const baseurl = process.env.LLSG_PREVIEW_BASEURL ?? '';
if (baseurl && !/^\/[a-z0-9][a-z0-9-]*$/.test(baseurl)) throw new Error(`Ungültige LLSG_PREVIEW_BASEURL: ${baseurl}`);

function parseDocument(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)([\s\S]*)$/);
  if (!match) return { data: {}, body: source };
  return { data: parseYamlStrict(match[1], 'Front Matter'), body: match[2] };
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    if (['.git', '_site', '_preview', 'node_modules'].includes(entry.name)) continue;
    const item = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolische Links sind im Quellbaum nicht zulässig: ${item}`);
    result.push(...(entry.isDirectory() ? await walk(item) : [item]));
  }
  return result;
}

function getValue(value, field) {
  return field.split('.').slice(1).reduce((item, key) => item?.[key], value);
}

function evaluateWhereExpression(item, variable, expression) {
  return expression.split(/\s+and\s+/).every(condition => {
    const comparison = condition.trim().match(new RegExp(`^${variable}\\.([A-Za-z0-9_]+)\\s*(==|!=)\\s*(true|false|null|'[^']*'|"[^"]*")$`));
    if (comparison) {
      const actual = item?.[comparison[1]];
      const raw = comparison[3];
      const expected = raw === 'true' ? true : raw === 'false' ? false : raw === 'null' ? null : raw.slice(1, -1);
      return comparison[2] === '==' ? actual === expected : actual !== expected;
    }
    const property = condition.trim().match(new RegExp(`^${variable}\\.([A-Za-z0-9_]+)$`));
    return property ? Boolean(item?.[property[1]]) : false;
  });
}

const config = readYamlStrict(path.join(root, '_config.yml'));
const configFailures = validateRuntimeConfig(config);
if (configFailures.length) throw new Error(`Ungültige Laufzeitkonfiguration: ${configFailures.join('; ')}`);
const mediaInventory = await validateMediaInventory(root);
assertFixedBrandAssetPath(config.social_image, mediaInventory, '_config.yml social_image');
const data = {};
for (const file of (await fs.readdir(path.join(root, '_data'))).filter(name => name.endsWith('.json'))) {
  data[path.basename(file, '.json')] = JSON.parse(await fs.readFile(path.join(root, '_data', file), 'utf8'));
}
for (const item of data.evidence || []) assertEditorialImagePath(item.image, mediaInventory, `${item.id || 'Evidence'} image`);

const engine = new Liquid({
  root: [path.join(root, '_includes')],
  extname: '.html',
  strictFilters: false,
  strictVariables: false
});
engine.registerFilter('jsonify', value => JSON.stringify(value));
engine.registerFilter('relative_url', value => `${baseurl}${value === '/' ? '/' : value || ''}`);
engine.registerFilter('absolute_url', value => `${config.url || ''}${config.baseurl || ''}${value || ''}`);
engine.registerFilter('normalize_whitespace', value => String(value ?? '').replace(/\s+/g, ' ').trim());
engine.registerFilter('where', (items, key, value) => (items || []).filter(item => item?.[key] === value));
engine.registerFilter('where_exp', (items, variable, expression) => (items || []).filter(item => evaluateWhereExpression(item, variable, expression)));
engine.registerFilter('date_to_xmlschema', value => new Date(value).toISOString());
engine.registerFilter('date', (value, format) => {
  const date = value === 'now' ? new Date() : new Date(value);
  if (Number.isNaN(date.valueOf())) return value;
  return String(format).replace('%Y', date.getUTCFullYear()).replace('%m', String(date.getUTCMonth() + 1).padStart(2, '0')).replace('%d', String(date.getUTCDate()).padStart(2, '0'));
});

const allFiles = await walk(root);
const excluded = new Set(config.exclude || []);
const sourceFiles = allFiles.filter(file => {
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  return file.endsWith('.md') && !rel.startsWith('_') && !rel.startsWith('docs/') && !excluded.has(rel) && !rel.includes('/.');
});

const documents = [];
let totalContentBytes = 0;
for (const file of sourceFiles) {
  const doc = parseDocument(await fs.readFile(file, 'utf8'));
  const relativeFile = path.relative(root, file).replaceAll(path.sep, '/');
  assertFrontMatterTypes(doc.data, relativeFile);
  assertEditorialImagePath(doc.data.image, mediaInventory, `${relativeFile} image`);
  if (!doc.data.layout) continue;
  if (doc.data.published === false) continue;
  const derivedRoute = `/${relativeFile.replace(/(?:^|\/)index\.md$/, '/').replace(/\.md$/, '/')}`.replace(/\/+/g, '/');
  const route = doc.data.permalink || derivedRoute;
  validateRoute(route, `${relativeFile}: permalink`);
  if (!isTrustedTemplatePage(relativeFile)) assertSafeEditorialBody(doc.body, relativeFile);
  totalContentBytes += Buffer.byteLength(doc.body);
  if (totalContentBytes > 25 * 1024 * 1024) throw new Error('Gesamtgröße der veröffentlichten Inhalte überschreitet 25 MB');
  const searchableContent = doc.body.replace(/\{[{%][\s\S]*?[}%]\}/g, ' ').replace(/<[^>]+>/g, ' ');
  documents.push({ file, body: doc.body, content: searchableContent, trustedTemplate: isTrustedTemplatePage(relativeFile), ...doc.data, url: route });
  if (documents.length > 5000) throw new Error('Mehr als 5.000 veröffentlichte Seiten sind nicht zulässig');
}

const site = { ...config, baseurl, data, pages: documents };
const layoutCache = new Map();
const layoutNames = new Set((await fs.readdir(path.join(root, '_layouts'))).filter(name => name.endsWith('.html')).map(name => path.basename(name, '.html')));
async function layout(name) {
  validateLayoutName(name, layoutNames);
  if (!layoutCache.has(name)) {
    const source = await fs.readFile(path.join(root, '_layouts', `${name}.html`), 'utf8');
    layoutCache.set(name, parseDocument(source));
  }
  return layoutCache.get(name);
}

async function renderDocument(document) {
  const context = { site, page: document };
  const prepare = source => source.replace(/{%\s*include\s+([^\s'"%]+)\s*%}/g, "{% include '$1' %}");
  const liquidBody = document.trustedTemplate ? await engine.parseAndRender(prepare(document.body), context) : document.body;
  assertSafeMarkdownUrls(liquidBody, `${document.file}: gerendertes Markdown`);
  let content = marked.parse(liquidBody, { gfm: true });
  let layoutName = document.layout;
  const seenLayouts = new Set();
  let depth = 0;
  while (layoutName) {
    if (seenLayouts.has(layoutName)) throw new Error(`${document.file}: zyklische Layoutkette bei ${layoutName}`);
    if (++depth > 8) throw new Error(`${document.file}: Layoutkette überschreitet 8 Ebenen`);
    seenLayouts.add(layoutName);
    const current = await layout(layoutName);
    content = await engine.parseAndRender(prepare(current.body), { ...context, content });
    layoutName = current.data.layout;
  }
  return content;
}

await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(outputRoot, { recursive: true });
await fs.cp(path.join(root, 'assets'), path.join(outputRoot, 'assets'), { recursive: true });

for (const document of documents) {
  const html = await renderDocument(document);
  const target = routeTarget(outputRoot, document.url);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html);
}

await fs.copyFile(path.join(outputRoot, 'index.html'), path.join(outputRoot, 'START_HERE.html'));
await fs.writeFile(path.join(outputRoot, 'VORSCHAU_LESEN.txt'), [
  'SAP TRANSFORMATION LAB – OFFLINE-VORSCHAU',
  '',
  '1. Den ZIP-Ordner vollständig entpacken.',
  '2. START_HERE.html im Desktop-Browser öffnen.',
  '3. Für die vollständige Navigation die strukturierte Vorschau über einen lokalen Webserver öffnen.',
  '',
  'Die Einzeldatei-Gesamtvorschau ist für die komfortable visuelle Prüfung vorgesehen.',
  'Die Produktionsfreigabe erfolgt ausschließlich über den geprüften GitHub-Actions-Workflow.'
].join('\n'));

console.log(JSON.stringify({ output: outputRoot, pages: documents.length }));
