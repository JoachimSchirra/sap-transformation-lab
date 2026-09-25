import fs from 'node:fs';
import path from 'node:path';
import { validateRoute } from './safe-paths.mjs';
import { mergeProductionConfig, parseYamlStrict, readYamlStrict, validateRuntimeConfig } from './secure-config.mjs';
import { assertFrontMatterTypes, assertSafeEditorialBody, isTrustedTemplatePage } from './content-security.mjs';
import { assertEditorialImagePath, assertFixedBrandAssetPath, validateMediaInventory } from './media-security.mjs';

const root = path.resolve(process.cwd());
const issues = [];
const warnings = [];
const productionCheck = process.argv.includes('--production');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['.git', '_site', '_preview', '_artifacts', 'artifacts', 'node_modules'].includes(entry.name)) return [];
    const item = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(item) : [item];
  });
}

function read(file) { return fs.readFileSync(file, 'utf8'); }
function relative(file) { return path.relative(root, file).replaceAll(path.sep, '/'); }
function readJson(file) {
  try { return JSON.parse(read(file)); }
  catch (error) { issues.push(`${relative(file)}: ungültiges JSON (${error.message})`); return null; }
}
function frontMatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/);
  if (!match) return {};
  try { return parseYamlStrict(match[1], 'Front Matter'); }
  catch (error) { issues.push(`Ungültiges YAML-Front-Matter: ${error.message}`); return {}; }
}

function readYaml(file) {
  try { return readYamlStrict(file); }
  catch (error) { issues.push(`${relative(file)}: ungültiges YAML (${error.message})`); return {}; }
}

function validRoute(route) {
  try { validateRoute(route); return true; } catch { return false; }
}

function decodeEntities(value) {
  return String(value).replace(/&#x([0-9a-f]+);?/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);?/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&colon;?/gi, ':').replace(/&tab;?/gi, '\t').replace(/&newline;?/gi, '\n');
}

function validatePlainData(value, label) {
  if (typeof value === 'string') {
    const normalized = decodeEntities(value).replace(/[\u0000-\u0020\u007f]+/g, '').toLowerCase();
    if (/[<>]|\{[{%]/.test(value)) issues.push(`${label}: aktives Markup oder Liquid ist in strukturierten Redaktionsdaten nicht zulässig`);
    if (normalized.includes('javascript:') || normalized.includes('data:text/html')) issues.push(`${label}: aktives URL-Schema ist nicht zulässig`);
  } else if (Array.isArray(value)) value.forEach((item, index) => validatePlainData(item, `${label}[${index}]`));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) issues.push(`${label}.${key}: verbotener Schlüssel`);
      validatePlainData(item, `${label}.${key}`);
    }
  }
}

let mediaInventory = { generatedPaths: new Set(), fixedPaths: new Set() };
try { mediaInventory = await validateMediaInventory(root); }
catch (error) { issues.push(`Public-Medieninventar: ${error.message}`); }

function validatePublicImage(image, label) {
  if (!image) return;
  try { assertEditorialImagePath(image, mediaInventory, label); }
  catch (error) { issues.push(error.message); }
}

const files = walk(root);
const markdownFiles = files.filter(file => file.endsWith('.md') && !relative(file).startsWith('docs/'));
const publicCodeFiles = files.filter(file => /\.(?:md|html|js|css|json)$/.test(file)
  && !relative(file).startsWith('docs/') && !relative(file).startsWith('tools/')
  && !['README.md', 'DESIGN-STUDY.md', 'NEXT-PROTOTYPE-BACKLOG.md', 'IMPLEMENTATION-STATUS.md'].includes(relative(file)));

const publicText = publicCodeFiles.map(read).join('\n').toLocaleLowerCase('de');
for (const forbidden of ['nutrition', 'nahrungsergänzung', 'rejuvena']) {
  if (publicText.includes(forbidden)) issues.push(`Veralteter öffentlicher Begriff: ${forbidden}`);
}
for (const misleading of ['built and verified', '2 gates verified', 'alle geprüften nachweise', 'frei verwendbarer qualitätsbestand']) {
  if (publicText.includes(misleading)) issues.push(`Irreführende oder fachlich falsche Formulierung: ${misleading}`);
}
if (/\binnerHTML\b/.test(read(path.join(root, 'assets/js/main.js')))) issues.push('JavaScript verwendet innerHTML für dynamische Inhalte');

for (const file of files.filter(file => file.endsWith('.json'))) {
  const value = readJson(file);
  if (value && relative(file).startsWith('_data/')) validatePlainData(value, relative(file));
}

const evidence = readJson(path.join(root, '_data/evidence.json')) || [];
const evidenceById = new Map();
for (const item of evidence) {
  if (!/^[A-Z0-9]+-\d{2}$/.test(item.id || '')) issues.push(`Ungültige Evidence-ID: ${item.id}`);
  if (evidenceById.has(item.id)) issues.push(`Doppelte Evidence-ID: ${item.id}`);
  evidenceById.set(item.id, item);
  for (const key of ['project', 'gate', 'modules', 'process', 'documentType', 'claim', 'deliveryStatus', 'evidenceStatus', 'captured']) {
    if (!item[key]) issues.push(`${item.id}: Pflichtfeld ${key} fehlt`);
  }
  if (item.image && !item.alt) issues.push(`${item.id}: Screenshot ohne Alternativtext`);
  validatePublicImage(item.image, item.id);
  if (item.evidenceStatus === 'Veröffentlicht' && (!item.image || !item.alt)) issues.push(`${item.id}: veröffentlicht ohne Bild und Alternativtext`);
}

const gates = readJson(path.join(root, '_data/gates.json')) || [];
const gateIds = new Set();
const selected = gates.filter(gate => gate.selected);
if (!gates.length) issues.push('Gate Roadmap ist leer');
if (selected.length !== 1) issues.push(`Gate Roadmap benötigt genau ein initial ausgewähltes Gate (gefunden: ${selected.length})`);
let reachedPlannedGate = false;
for (const gate of gates) {
  if (!/^gate-[0-9]+[a-z]?$/.test(gate.id || '')) issues.push(`Ungültige Gate-ID: ${gate.id}`);
  if (gateIds.has(gate.id)) issues.push(`Doppelte Gate-ID: ${gate.id}`);
  gateIds.add(gate.id);
  if (!['done', 'next', 'planned'].includes(gate.phase)) issues.push(`${gate.id}: ungültige Phase ${gate.phase}`);
  if (gate.phase !== 'done') reachedPlannedGate = true;
  if (gate.phase === 'done' && reachedPlannedGate) issues.push(`${gate.id}: erreichtes Gate steht nach einem geplanten Gate`);
  for (const key of ['label', 'title', 'status', 'roadmapStatus', 'detailStatus', 'summary', 'url', 'linkLabel']) {
    if (!gate[key]) issues.push(`${gate.id}: Pflichtfeld ${key} fehlt`);
  }
  if (gate.phase === 'done' && (!Array.isArray(gate.evidenceIds) || !gate.evidenceIds.length)) issues.push(`${gate.id}: erreichtes Gate ohne Evidence-IDs`);
  if (gate.phase !== 'done' && (!Array.isArray(gate.plannedResults) || !gate.plannedResults.length)) issues.push(`${gate.id}: geplantes Gate ohne geplante Ergebnisse`);
  for (const id of gate.evidenceIds || []) if (!evidenceById.has(id)) issues.push(`${gate.id}: unbekannte Evidence-ID ${id}`);
  if (gate.phase === 'done' && !gate.testedAt) warnings.push(`${gate.id}: Testdatum muss vor Produktionsfreigabe bestätigt werden`);
  if (gate.url && !gate.url.startsWith('/')) issues.push(`${gate.id}: URL muss mit / beginnen`);
  if (gate.url && !validRoute(gate.url)) issues.push(`${gate.id}: unsichere oder ungültige interne URL ${gate.url}`);
}

const project = readJson(path.join(root, '_data/project_status.json')) || {};
for (const key of ['projectId', 'projectName', 'deliveryStatus', 'evidenceStatus', 'currentGateId', 'lastReachedGateId', 'nextGateId', 'updated']) {
  if (!project[key]) issues.push(`project_status.json: Pflichtfeld ${key} fehlt`);
}
for (const key of ['currentGateId', 'lastReachedGateId', 'nextGateId']) if (project[key] && !gateIds.has(project[key])) issues.push(`project_status.json: unbekanntes Gate in ${key}`);
if (project.currentGateId !== project.lastReachedGateId) issues.push('Projektstatus: currentGateId und lastReachedGateId widersprechen sich');
if (selected[0]?.id !== project.currentGateId) issues.push('Projektstatus und initial ausgewähltes Gate widersprechen sich');

const routes = new Map();
const descriptions = new Map();
for (const file of markdownFiles) {
  const text = read(file);
  const meta = frontMatter(text);
  try { assertFrontMatterTypes(meta, relative(file)); }
  catch (error) { issues.push(error.message); }
  validatePlainData(meta, `${relative(file)} front matter`);
  if (!meta.layout && !relative(file).startsWith('journal/entries/') && !relative(file).includes('/items/')) continue;
  const route = meta.permalink || `/${relative(file).replace(/(?:^|\/)index\.md$/, '/').replace(/\.md$/, '/')}`.replace(/\/+/g, '/');
  if (!validRoute(route)) issues.push(`${relative(file)}: unsicherer oder ungültiger Permalink ${route}`);
  if (routes.has(route)) issues.push(`${relative(file)}: doppelter Permalink ${route}`);
  routes.set(route, relative(file));
  if (meta.search_exclude !== true && meta.noindex !== true) {
    if (!meta.title) issues.push(`${relative(file)}: Titel fehlt`);
    if (!meta.description) issues.push(`${relative(file)}: individuelle Meta-Description fehlt`);
    else if (descriptions.has(meta.description)) issues.push(`${relative(file)}: doppelte Meta-Description mit ${descriptions.get(meta.description)}`);
    else descriptions.set(meta.description, relative(file));
  }
  const slugParts = relative(file).split('/').slice(0, -1);
  for (const slug of slugParts) if (slug && !/^[_a-z0-9][-_a-z0-9]*$/.test(slug)) issues.push(`${relative(file)}: nicht normalisierter Verzeichnis-Slug ${slug}`);
  if (meta.image && !meta.image_alt) issues.push(`${relative(file)}: Bild ohne image_alt`);
  if (meta.noindex === true && meta.sitemap !== false) issues.push(`${relative(file)}: noindex-Inhalt muss auch sitemap:false setzen`);
  validatePublicImage(meta.image, relative(file));
  const headingLevels = [...text.replace(/^---[\s\S]*?---\s*/m, '').matchAll(/^(#{1,6})\s+/gm)].map(match => match[1].length);
  for (let index = 1; index < headingLevels.length; index += 1) if (headingLevels[index] > headingLevels[index - 1] + 1) issues.push(`${relative(file)}: Überschriftensprung H${headingLevels[index - 1]} → H${headingLevels[index]}`);

  if (!isTrustedTemplatePage(relative(file))) {
    const body = text.replace(/^---[\s\S]*?---\s*/m, '');
    try { assertSafeEditorialBody(body, relative(file)); }
    catch (error) { issues.push(error.message); }
  }
}

const knownRoutes = new Set([...routes.keys(), '/assets/css/main.css', '/assets/js/main.js']);
for (const gate of gates) if (gate.url && !knownRoutes.has(gate.url)) issues.push(`${gate.id}: Zielroute existiert nicht: ${gate.url}`);
const latest = readJson(path.join(root, '_data/latest.json')) || [];
for (const [index, item] of latest.entries()) {
  if (!validRoute(item.url)) issues.push(`latest[${index}]: ungültige interne URL ${item.url}`);
  else if (!knownRoutes.has(item.url)) issues.push(`latest[${index}]: Zielroute existiert nicht: ${item.url}`);
}
const xray = readJson(path.join(root, '_data/xray_gate_2.json')) || [];
for (const [index, step] of xray.entries()) if (!evidenceById.has(step.proof)) issues.push(`xray_gate_2[${index}]: unbekannte Evidence-ID ${step.proof}`);
if (markdownFiles.length > 5000) issues.push('Ressourcenlimit: mehr als 5.000 Markdown-Dateien');
if (files.length > 20000) issues.push('Ressourcenlimit: mehr als 20.000 Projektdateien');
for (const file of [...markdownFiles, ...files.filter(item => item.endsWith('.json'))]) {
  if (fs.statSync(file).size > 2 * 1024 * 1024) issues.push(`${relative(file)}: Inhaltsdatei größer als 2 MB`);
}
for (const file of publicCodeFiles.filter(file => /\.(?:md|html)$/.test(file))) {
  const text = read(file);
  const rel = relative(file);
  if (/\bon[a-z]+\s*=\s*["']/i.test(text)) issues.push(`${rel}: Inline-Eventhandler sind nicht zulässig`);
  if (/(?:javascript|data\s*:\s*text\/html)\s*:/i.test(text)) issues.push(`${rel}: aktive URL-Schemata sind nicht zulässig`);
  if (/<(?:iframe|object|embed|base|form)\b|<button\b[^>]*\bformaction\s*=/i.test(text)) issues.push(`${rel}: aktives oder einbettendes HTML-Element ist nicht zulässig`);
  if (rel !== '_layouts/default.html' && /<(?:style|link|meta|svg|math)\b|\sstyle\s*=|\bsrcdoc\s*=/i.test(text)) issues.push(`${rel}: aktives Styling oder eingebettetes Markup ist nicht zulässig`);
  if (/<script\b/i.test(text)) {
    const allowedScripts = new Set(['_layouts/default.html', '_includes/analytics.html']);
    if (!allowedScripts.has(rel)) issues.push(`${rel}: Script-Element außerhalb der geprüften Allowlist`);
  }
  for (const match of text.matchAll(/['"](\/[a-zA-Z0-9_./-]+\/?)(?:['"]|\s*\|\s*(?:relative_url|absolute_url))/g)) {
    const route = match[1];
    if (route.startsWith('/assets/')) continue;
    if (!knownRoutes.has(route) && !knownRoutes.has(route.replace(/\.html$/, '/'))) warnings.push(`${relative(file)}: interne Route prüfen: ${route}`);
  }
  for (const match of text.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    if (!/\balt=(?:"[^"]*"|'[^']*')/i.test(attributes)) issues.push(`${relative(file)}: Bild ohne alt-Attribut`);
    if (!/\bwidth=/i.test(attributes) || !/\bheight=/i.test(attributes)) issues.push(`${relative(file)}: Bild ohne feste Breite/Höhe`);
  }
}

for (const file of files.filter(file => /\.(?:png|jpe?g|webp|avif|gif|svg)$/i.test(file))) {
  const size = fs.statSync(file).size;
  if (size > 1.5 * 1024 * 1024) issues.push(`${relative(file)}: Bild größer als 1,5 MB`);
  if (path.extname(file).toLowerCase() === '.svg' && relative(file) !== 'assets/images/favicon.svg') issues.push(`${relative(file)}: öffentliches SVG ist nicht freigegeben`);
}

const pagesCms = read(path.join(root, '.pages.yml'));
if (/\btype:\s*list\b/.test(pagesCms)) issues.push('.pages.yml: ungültiger Feldtyp list; string + list:true verwenden');
for (const requiredType of ['people', 'products', 'projects', 'project_status', 'portfolio_roadmap', 'business_episodes', 'off_duty', 'journal', 'evidence', 'gates']) {
  if (!new RegExp(`name:\\s*${requiredType}\\b`).test(pagesCms)) issues.push(`.pages.yml: Inhaltstyp ${requiredType} fehlt`);
}
const editorialImagePattern = '^/assets/images/generated/[a-z0-9][a-z0-9-]*-[1-9][0-9]*\\.(webp|avif)$';
const cmsImageFields = [];
function collectCmsImageFields(value) {
  if (Array.isArray(value)) value.forEach(collectCmsImageFields);
  else if (value && typeof value === 'object') {
    if (value.name === 'image') cmsImageFields.push(value);
    Object.values(value).forEach(collectCmsImageFields);
  }
}
collectCmsImageFields(readYaml(path.join(root, '.pages.yml')));
if (cmsImageFields.length !== 6) issues.push(`.pages.yml: genau 6 redaktionelle image-Felder erwartet (gefunden: ${cmsImageFields.length})`);
for (const field of cmsImageFields) if (field.type !== 'string' || field.pattern !== editorialImagePattern) issues.push('.pages.yml: image-Feld erzwingt den manifestierten Derivatpfad nicht');

const css = read(path.join(root, 'assets/css/main.css'));
const braceBalance = [...css].reduce((sum, character) => sum + (character === '{' ? 1 : character === '}' ? -1 : 0), 0);
if (braceBalance !== 0) issues.push(`CSS-Klammerbilanz: ${braceBalance}`);
if (/overflow-x:\s*clip/.test(css)) issues.push('CSS darf Layoutfehler nicht global mit overflow-x: clip verdecken');

const productionConfigPath = path.join(root, '_config.production.yml');
const baseConfig = readYaml(path.join(root, '_config.yml'));
try { assertFixedBrandAssetPath(baseConfig.social_image, mediaInventory, '_config.yml social_image'); }
catch (error) { issues.push(error.message); }
let config = baseConfig;
try { if (productionCheck && fs.existsSync(productionConfigPath)) config = mergeProductionConfig(baseConfig, readYaml(productionConfigPath)); }
catch (error) { issues.push(`Produktionssperre: ${error.message}`); }
const expectedCommit = process.env.GITHUB_SHA || process.env.LLSG_EXPECTED_RELEASE_COMMIT || '';
for (const failure of validateRuntimeConfig(config, { production: productionCheck, expectedCommit })) issues.push(`Produktionssperre: ${failure}`);
if (productionCheck) {
  if (config.contact?.enabled === true && !config.contact?.email && !config.contact?.linkedin) issues.push('Produktionssperre: Kontakt ist aktiviert, aber ohne Ziel');
  if (config.analytics?.enabled === true && (config.analytics?.provider !== 'cloudflare' || !config.analytics?.token)) issues.push('Produktionssperre: Analytics-Konfiguration ist unvollständig oder nicht freigegeben');
  if (gates.some(gate => gate.phase === 'done' && !gate.testedAt)) issues.push('Produktionssperre: Testdatum eines erreichten Gates fehlt');
  const placeholders = publicText.match(/portrait folgt|profil in ausarbeitung|produktfoto folgt|produktvisualisierung folgt|konzeptvisual folgt|original screenshot einsetzen/g) || [];
  if (placeholders.length) issues.push(`Produktionssperre: ${placeholders.length} sichtbare Platzhalter vorhanden`);
}

console.log(JSON.stringify({ checkedFiles: files.length, routes: routes.size, evidence: evidence.length, gates: gates.length, productionCheck, warnings: [...new Set(warnings)], issues: [...new Set(issues)] }, null, 2));
process.exitCode = issues.length ? 1 : 0;
