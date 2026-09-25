import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';
import sharp from 'sharp';
import { routeTarget, safeProjectDirectory, safeProjectFile, validateRoute } from './safe-paths.mjs';
import { assertFrontMatterTypes, assertSafeEditorialBody, assertSafeUrl, escapeHtml } from './content-security.mjs';
import { validateGeneratedMedia, validateMediaInventory } from './media-security.mjs';
import { mergeProductionConfig, parseYamlStrict, validateRuntimeConfig } from './secure-config.mjs';

const root = process.cwd();
const fixtureId = String(process.pid);
const expectThrow = (operation, message) => assert.throws(operation, undefined, message);

const fixtureContentRoot = path.join(root, 'inside-llsg/business-episodes/items');
for (const name of fs.readdirSync(fixtureContentRoot)) {
  if (name.startsWith('security-')) fs.rmSync(path.join(fixtureContentRoot, name), { recursive: true, force: true });
}
const baselineMedia = await validateMediaInventory(root);
assert.equal(baselineMedia.fixedPaths.size, 5, 'Genau fünf unveränderlich freigegebene Markenassets werden erwartet');
assert.ok(baselineMedia.fixedPaths.has('/assets/images/social-preview.jpg'), 'Social Preview muss als geprüftes Markenasset freigegeben sein');

expectThrow(() => safeProjectDirectory(root, root, 'test'), 'Projektwurzel darf kein Ausgabeordner sein');
expectThrow(() => safeProjectDirectory(root, path.dirname(root), 'test'), 'Elternpfad darf kein Ausgabeordner sein');
assert.equal(safeProjectDirectory(root, path.join(root, '_preview'), 'test'), path.join(root, '_preview'));
expectThrow(() => safeProjectFile(root, path.join(root, 'package.json'), 'test', '.html'), 'Falsche Dateiendung muss abgewiesen werden');

for (const route of ['/', '/404.html', '/projects/llsg-foundation-p2p/', '/xray/gate-2/']) assert.equal(validateRoute(route), route);
for (const route of ['/../../escape/', '//host/', '/Mixed/', '/path?query/', '/path#fragment/', 'https://example.org/']) {
  expectThrow(() => validateRoute(route), `Unsichere Route wurde akzeptiert: ${route}`);
}

const outputRoot = path.join(root, '_preview');
assert.equal(routeTarget(outputRoot, '/projects/'), path.join(outputRoot, 'projects/index.html'));

function collectUses(value, result = []) {
  if (Array.isArray(value)) value.forEach(item => collectUses(item, result));
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) key === 'uses' ? result.push(item) : collectUses(item, result);
  return result;
}

const workflowDirectory = path.join(root, '.github/workflows');
for (const workflowName of fs.readdirSync(workflowDirectory).filter(name => /\.ya?ml$/.test(name))) {
  const workflow = `.github/workflows/${workflowName}`;
  const source = fs.readFileSync(path.join(root, workflow), 'utf8');
  const uses = collectUses(YAML.parse(source, { uniqueKeys: true }));
  assert.ok(uses.length, `${workflow}: keine Actions gefunden`);
  for (const action of uses) if (!String(action).startsWith('./')) assert.match(action, /^[^@\s]+@[0-9a-f]{40}$/, `${workflow}: Action ist nicht auf einen Commit-SHA fixiert: ${action}`);
}

const unpinnedWorkflow = YAML.parse('jobs:\n  test:\n    steps:\n      - uses: actions/checkout@main\n');
assert.throws(() => {
  for (const action of collectUses(unpinnedWorkflow)) assert.match(action, /^[^@\s]+@[0-9a-f]{40}$/);
}, 'Kurzform einer ungepinnten Action muss erkannt werden');

expectThrow(() => parseYamlStrict('security:\n  __proto__:\n    review_approved: true\n'), '__proto__ muss abgewiesen werden');
expectThrow(() => parseYamlStrict('value: 1\nvalue: 2\n'), 'Doppelte YAML-Schlüssel müssen abgewiesen werden');
const base = { environment: 'prototype', production_ready: false, repository_public: false, contact: { enabled: false }, analytics: { enabled: false, provider: 'cloudflare', token: '' } };
const releaseCommit = 'a'.repeat(40);
const overlay = { environment: 'production', production_ready: true, repository_public: true, security: { review_approved: true, reviewed_at: '2026-09-24' }, legal: { approved: true, imprint_complete: true, privacy_complete: true, reviewed_at: '2026-09-24' }, contact: { enabled: false, email: '', linkedin: '' }, analytics: { enabled: false, provider: 'cloudflare', token: '' } };
assert.deepEqual(validateRuntimeConfig(mergeProductionConfig(base, overlay), { production: true, expectedCommit: releaseCommit }), []);
assert.ok(validateRuntimeConfig(mergeProductionConfig(base, { ...overlay, security: { ...overlay.security, reviewed_at: '2026-02-31' } }), { production: true, expectedCommit: releaseCommit }).length, 'Unmögliches Kalenderdatum muss abgewiesen werden');
assert.ok(validateRuntimeConfig(mergeProductionConfig(base, overlay), { production: true, expectedCommit: 'invalid' }).length, 'Ein ungültiger Workflow-Commit muss abgewiesen werden');
expectThrow(() => mergeProductionConfig(base, { ...overlay, unexpected: true }), 'Unbekannte Overlay-Schlüssel müssen abgewiesen werden');
assert.ok(validateRuntimeConfig({ ...base, analytics: { ...base.analytics, enabled: 'false' } }).length, 'String false muss abgewiesen werden');

for (const value of ['javascript:alert(1)', 'java&#x73;cript:alert(1)', 'data:text/html,x', '//evil.example/']) expectThrow(() => assertSafeUrl(value, 'test'), `Unsichere URL akzeptiert: ${value}`);
assert.equal(assertSafeUrl('/projects/', 'test'), '/projects/');
expectThrow(() => assertSafeEditorialBody("{{ '<scr' | append: 'ipt>x</script>' }}", 'test'), 'Redaktionelles Liquid muss abgewiesen werden');
expectThrow(() => assertSafeEditorialBody('<script>x</script>', 'test'), 'Redaktionelles HTML muss abgewiesen werden');
expectThrow(() => assertSafeEditorialBody('[Text][id]\n\n[id]: java&#x73;cript:alert(1)', 'test'), 'Entity-kodierter Markdown-Referenzlink muss abgewiesen werden');
for (const field of ['published', 'noindex', 'search_exclude', 'sitemap']) expectThrow(() => assertFrontMatterTypes({ [field]: 'false' }, 'test'), `${field} als String muss abgewiesen werden`);
assert.equal(escapeHtml('<script>'), '&lt;script&gt;');

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'llsg-path-test-'));
const project = path.join(sandbox, 'project');
const victim = path.join(sandbox, 'victim');
fs.mkdirSync(project); fs.mkdirSync(victim);
fs.writeFileSync(path.join(victim, 'sentinel.txt'), 'unchanged');
fs.symlinkSync(victim, path.join(project, '_preview'), 'dir');
expectThrow(() => safeProjectDirectory(project, path.join(project, '_preview'), 'test'), 'Symlink-Ausgabe muss abgewiesen werden');
assert.equal(fs.readFileSync(path.join(victim, 'sentinel.txt'), 'utf8'), 'unchanged');
fs.rmSync(sandbox, { recursive: true, force: true });

function runNode(script, args = [], cwd = root) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
}

function withRestoredFile(file, operation) {
  const original = fs.readFileSync(file);
  try { operation(); } finally { fs.writeFileSync(file, original); }
}

const gatesFile = path.join(root, '_data/gates.json');
withRestoredFile(gatesFile, () => {
  const gates = JSON.parse(fs.readFileSync(gatesFile, 'utf8'));
  gates[0].title = 'Unsafe<script>globalThis.audit=1</script>';
  fs.writeFileSync(gatesFile, JSON.stringify(gates));
  assert.notEqual(runNode('tools/validate-content.mjs').status, 0, 'Aktives Markup in Gate-Daten muss den Build stoppen');
});

const xrayFile = path.join(root, '_data/xray_gate_2.json');
withRestoredFile(xrayFile, () => {
  const xray = JSON.parse(fs.readFileSync(xrayFile, 'utf8'));
  xray[0].proof = 'UNKNOWN-99';
  fs.writeFileSync(xrayFile, JSON.stringify(xray));
  assert.notEqual(runNode('tools/validate-content.mjs').status, 0, 'Unbekannte Evidence-Referenz muss den Build stoppen');
});

const unpublishedDir = path.join(root, 'inside-llsg/business-episodes/items/security-unpublished');
const unpublishedFile = path.join(unpublishedDir, 'index.md');
fs.mkdirSync(unpublishedDir, { recursive: true });
try {
  fs.writeFileSync(unpublishedFile, `---\nlayout: page\ntitle: Nicht publiziert\ndescription: Sicherheitsfixture\npublished: false\npermalink: /security-unpublished/\n---\nAUDIT_UNPUBLISHED_SENTINEL_8_2\n`);
  assert.equal(runNode('tools/build-preview.mjs').status, 0, 'Preview mit unpublished Fixture muss kontrolliert bauen');
  assert.equal(fs.existsSync(path.join(root, '_preview/security-unpublished/index.html')), false, 'published:false darf keine Route erzeugen');
  const generated = fs.readFileSync(path.join(root, '_preview/index.html'), 'utf8');
  assert.doesNotMatch(generated, /AUDIT_UNPUBLISHED_SENTINEL_8_2/, 'published:false darf nicht in öffentliche Ausgabe gelangen');
} finally { fs.rmSync(unpublishedDir, { recursive: true, force: true }); }

const unsafeDir = path.join(root, 'inside-llsg/business-episodes/items/security-liquid');
const unsafeFile = path.join(unsafeDir, 'index.md');
fs.mkdirSync(unsafeDir, { recursive: true });
try {
  fs.writeFileSync(unsafeFile, `---\nlayout: page\ntitle: Unsicher\ndescription: Sicherheitsfixture\npermalink: /security-liquid/\n---\n{{ '<scr' | append: 'ipt>alert(1)</scr' | append: 'ipt>' }}\n`);
  assert.notEqual(runNode('tools/validate-content.mjs').status, 0, 'Redaktionelles Liquid muss den Validator stoppen');
  assert.notEqual(runNode('tools/build-preview.mjs').status, 0, 'Redaktionelles Liquid muss auch den Builder stoppen');
} finally { fs.rmSync(unsafeDir, { recursive: true, force: true }); }

const e2eRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'llsg-v821-e2e-'));
fs.cpSync(root, e2eRoot, {
  recursive: true,
  filter: source => {
    const rel = path.relative(root, source).replaceAll(path.sep, '/');
    return rel === '' || (!rel.startsWith('node_modules') && !rel.startsWith('_preview') && !rel.startsWith('_artifacts')
      && !/inside-llsg\/business-episodes\/items\/security-/.test(rel) && rel !== '.security-regression.lock');
  }
});
fs.symlinkSync(path.join(root, 'node_modules'), path.join(e2eRoot, 'node_modules'), 'dir');
const e2eGeneratedDir = path.join(e2eRoot, 'assets/images/generated');
for (const entry of fs.readdirSync(e2eGeneratedDir)) if (entry !== 'manifest.json') fs.rmSync(path.join(e2eGeneratedDir, entry), { recursive: true, force: true });
fs.writeFileSync(path.join(e2eGeneratedDir, 'manifest.json'), '{}\n');

const referenceDir = path.join(e2eRoot, 'inside-llsg/business-episodes/items/security-reference-link');
const referenceFile = path.join(referenceDir, 'index.md');
fs.mkdirSync(referenceDir, { recursive: true });
try {
  fs.writeFileSync(referenceFile, `---\nlayout: page\ntitle: Referenzlink\ndescription: Sicherheitsfixture\npermalink: /security-reference-link/\n---\n[Text][audit]\n\n[audit]: java&#x73;cript:alert(1)\n`);
  assert.notEqual(runNode('tools/validate-content.mjs', [], e2eRoot).status, 0, 'Markdown-Referenzlink muss den Validator stoppen');
  assert.notEqual(runNode('tools/build-preview.mjs', [], e2eRoot).status, 0, 'Markdown-Referenzlink muss auch den Builder stoppen');
} finally { fs.rmSync(referenceDir, { recursive: true, force: true }); }

const typedFrontMatterDir = path.join(e2eRoot, `inside-llsg/business-episodes/items/security-frontmatter-type-${fixtureId}`);
const typedFrontMatterFile = path.join(typedFrontMatterDir, 'index.md');
fs.rmSync(typedFrontMatterDir, { recursive: true, force: true });
fs.mkdirSync(typedFrontMatterDir, { recursive: true });
try {
  for (const field of ['published', 'noindex', 'search_exclude', 'sitemap']) {
    fs.writeFileSync(typedFrontMatterFile, `---\nlayout: page\ntitle: Typprüfung\ndescription: Sicherheitsfixture\n${field}: "false"\npermalink: /security-frontmatter-type-${fixtureId}/\n---\nAUDIT_FRONTMATTER_TYPE_SENTINEL\n`);
    assert.notEqual(runNode('tools/validate-content.mjs', [], e2eRoot).status, 0, `${field} als String muss den Validator stoppen`);
    assert.notEqual(runNode('tools/build-preview.mjs', [], e2eRoot).status, 0, `${field} als String muss den Builder stoppen`);
  }
} finally { fs.rmSync(typedFrontMatterDir, { recursive: true, force: true }); }
assert.equal(fs.existsSync(typedFrontMatterDir), false, 'Front-Matter-Fixture muss unmittelbar entfernt sein');

const mediaSandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'llsg-media-test-'));
const mediaSource = path.join(mediaSandbox, '_media-source');
const mediaOutput = path.join(mediaSandbox, 'assets/images/generated');
fs.mkdirSync(mediaSource, { recursive: true });
fs.mkdirSync(mediaOutput, { recursive: true });
fs.writeFileSync(path.join(mediaOutput, 'sentinel.txt'), 'old-managed-output');
const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
try {
  fs.writeFileSync(path.join(mediaSource, 'A B.png'), tinyPng);
  fs.writeFileSync(path.join(mediaSource, 'a-b.png'), tinyPng);
  const collision = spawnSync(process.execPath, [path.join(root, 'tools/optimize-images.mjs')], { cwd: mediaSandbox, encoding: 'utf8' });
  assert.notEqual(collision.status, 0, 'Normalisierte Medienkollision muss scheitern');
  assert.equal(fs.readFileSync(path.join(mediaOutput, 'sentinel.txt'), 'utf8'), 'old-managed-output', 'Fehlgeschlagene Vorprüfung darf Output nicht verändern');
  fs.rmSync(path.join(mediaSource, 'A B.png'));
  const success = spawnSync(process.execPath, [path.join(root, 'tools/optimize-images.mjs')], { cwd: mediaSandbox, encoding: 'utf8' });
  assert.equal(success.status, 0, success.stderr);
  await validateGeneratedMedia(mediaSandbox);
  assert.equal(fs.existsSync(path.join(mediaOutput, 'sentinel.txt')), false, 'Atomarer Austausch muss Altdateien entfernen');
  assert.ok(fs.existsSync(path.join(mediaOutput, 'a-b-1.webp')), 'Bereinigtes WebP-Derivat fehlt');
  fs.rmSync(path.join(mediaSource, 'a-b.png'));
  assert.equal(spawnSync(process.execPath, [path.join(root, 'tools/optimize-images.mjs')], { cwd: mediaSandbox }).status, 0);
  await validateGeneratedMedia(mediaSandbox);
  assert.equal(fs.existsSync(path.join(mediaOutput, 'a-b-1.webp')), false, 'Zurückgezogene Medien müssen verschwinden');
} finally { fs.rmSync(mediaSandbox, { recursive: true, force: true }); }
assert.equal(fs.existsSync(typedFrontMatterDir), false, 'Medientest darf Front-Matter-Fixture nicht wiederherstellen');

const generatedDir = e2eGeneratedDir;
const generatedManifest = path.join(generatedDir, 'manifest.json');
const originalManifest = fs.readFileSync(generatedManifest);
const mediaSlug = `audit-${fixtureId}`;
const directJpeg = path.join(generatedDir, `${mediaSlug}-direct.jpg`);
const managedWebp = path.join(generatedDir, `${mediaSlug}-1.webp`);
const mediaFixtureDir = path.join(e2eRoot, `inside-llsg/business-episodes/items/security-media-${fixtureId}`);
const mediaFixtureFile = path.join(mediaFixtureDir, 'index.md');
for (const item of [directJpeg, managedWebp]) fs.rmSync(item, { force: true });
fs.rmSync(mediaFixtureDir, { recursive: true, force: true });
fs.mkdirSync(mediaFixtureDir, { recursive: true });
try {
  const jpegWithMetadata = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#112233' } }).withMetadata({ orientation: 1 }).jpeg().toBuffer();
  fs.writeFileSync(directJpeg, jpegWithMetadata);
  fs.writeFileSync(mediaFixtureFile, `---\nlayout: page\ntitle: Medienprüfung\ndescription: Sicherheitsfixture\nimage: /assets/images/generated/${mediaSlug}-direct.jpg\nimage_alt: Audit\npermalink: /security-media-${fixtureId}/\n---\nMedienfixture\n`);
  assert.notEqual(runNode('tools/validate-content.mjs', [], e2eRoot).status, 0, 'Direktes JPEG außerhalb des Manifests muss den Validator stoppen');
  assert.notEqual(runNode('tools/build-preview.mjs', [], e2eRoot).status, 0, 'Direktes JPEG außerhalb des Manifests muss den Builder stoppen');
  fs.rmSync(directJpeg);
  fs.rmSync(mediaFixtureDir, { recursive: true, force: true });

  const manifest = { [mediaSlug]: { width: 1, height: 1, variants: [{ format: 'webp', width: 1, path: `/assets/images/generated/${mediaSlug}-1.webp` }] } };
  fs.writeFileSync(generatedManifest, `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(managedWebp, Buffer.from('RIFF0000WEBPnot-a-decodable-image'));
  assert.notEqual(runNode('tools/validate-content.mjs', [], e2eRoot).status, 0, 'Nicht decodierbares Manifestderivat muss den Validator stoppen');
  assert.notEqual(runNode('tools/build-preview.mjs', [], e2eRoot).status, 0, 'Nicht decodierbares Manifestderivat muss den Builder stoppen');

  const webpWithMetadata = await sharp({ create: { width: 1, height: 1, channels: 3, background: '#445566' } }).withMetadata({ orientation: 1 }).webp().toBuffer();
  fs.writeFileSync(managedWebp, webpWithMetadata);
  assert.ok((await sharp(managedWebp).metadata()).exif?.length || (await sharp(managedWebp).metadata()).icc?.length, 'Testfixture muss Metadaten enthalten');
  assert.notEqual(runNode('tools/validate-content.mjs', [], e2eRoot).status, 0, 'Manifestderivat mit EXIF/ICC muss den Validator stoppen');
  assert.notEqual(runNode('tools/build-preview.mjs', [], e2eRoot).status, 0, 'Manifestderivat mit EXIF/ICC muss den Builder stoppen');
} finally {
  fs.writeFileSync(generatedManifest, originalManifest);
  fs.rmSync(directJpeg, { force: true });
  fs.rmSync(managedWebp, { force: true });
  fs.rmSync(mediaFixtureDir, { recursive: true, force: true });
}
assert.equal(fs.existsSync(typedFrontMatterDir), false, 'Public-Medientest darf Front-Matter-Fixture nicht wiederherstellen');

const positiveMediaSource = path.join(e2eRoot, '_media-source', 'audit-v822.png');
const positiveMediaDir = path.join(e2eRoot, `inside-llsg/business-episodes/items/security-media-positive-${fixtureId}`);
const positiveMediaFile = path.join(positiveMediaDir, 'index.md');
fs.writeFileSync(positiveMediaSource, tinyPng);
assert.equal(runNode('tools/optimize-images.mjs', [], e2eRoot).status, 0, 'Echtes Optimiererderivat muss erzeugt werden');
const positiveImage = '/assets/images/generated/audit-v822-1.webp';
const positiveInventory = await validateMediaInventory(e2eRoot);
assert.ok(positiveInventory.generatedPaths.has(positiveImage), 'Echtes Derivat muss im geprüften Manifest enthalten sein');
fs.mkdirSync(positiveMediaDir, { recursive: true });
fs.writeFileSync(positiveMediaFile, `---\nlayout: page\ntitle: Manifestbild\ndescription: Positive Medienfixture\nimage: ${positiveImage}\nimage_alt: Audit\npermalink: /security-media-positive-${fixtureId}/\n---\nPositive Medienfixture\n`);
assert.equal(runNode('tools/validate-content.mjs', [], e2eRoot).status, 0, 'Manifestiertes Derivat muss den Inhaltsvalidator bestehen');
assert.equal(runNode('tools/build-preview.mjs', [], e2eRoot).status, 0, 'Manifestiertes Derivat muss den Preview-Builder bestehen');
fs.writeFileSync(positiveMediaFile, `---\nlayout: page\ntitle: Direktbild\ndescription: Negative Medienfixture\nimage: /assets/images/llsg-logo.png\nimage_alt: Audit\npermalink: /security-media-positive-${fixtureId}/\n---\nNegative Medienfixture\n`);
assert.notEqual(runNode('tools/validate-content.mjs', [], e2eRoot).status, 0, 'Front-Matter-Bild direkt unter /assets/images/ muss scheitern');
assert.notEqual(runNode('tools/build-preview.mjs', [], e2eRoot).status, 0, 'Preview muss redaktionelles Direktbild trotz Markenasset-Allowlist abweisen');
fs.rmSync(positiveMediaDir, { recursive: true, force: true });
fs.rmSync(positiveMediaSource, { force: true });
assert.equal(runNode('tools/optimize-images.mjs', [], e2eRoot).status, 0, 'Positive Medienfixture muss vollständig zurückgenommen werden');
assert.equal((await validateMediaInventory(e2eRoot)).generatedFiles, 0, 'Zurücknahme muss einen leeren verwalteten Derivatsatz herstellen');

const cssFile = path.join(e2eRoot, 'assets/css/main.css');
const originalCss = fs.readFileSync(cssFile);
try {
  for (const importRule of ['@import "https://example.invalid/a.css";', "@import url('https://example.invalid/b.css');", '@import url(https://example.invalid/c.css);']) {
    fs.writeFileSync(cssFile, Buffer.concat([originalCss, Buffer.from(`\n${importRule}\n`)]));
    const fixturePreview = runNode('tools/build-preview.mjs', [], e2eRoot);
    assert.equal(fixturePreview.status, 0, `Fixture-Vorschau muss für den nachgelagerten Single-File-Test bauen: ${fixturePreview.stderr || fixturePreview.stdout}`);
    const fixtureSingle = runNode('tools/build-single-file.mjs', [], e2eRoot);
    assert.equal(fixtureSingle.status, 0, `Fixture-Einzeldatei muss für den Validator gebaut werden: ${fixtureSingle.stderr || fixtureSingle.stdout}`);
    assert.notEqual(runNode('tools/validate-single-file.mjs', [], e2eRoot).status, 0, `CSS-Netzimport muss gestoppt werden: ${importRule}`);
  }
} finally {
  fs.writeFileSync(cssFile, originalCss);
  fs.rmSync(typedFrontMatterDir, { recursive: true, force: true });
  fs.rmSync(mediaFixtureDir, { recursive: true, force: true });
  for (const item of [directJpeg, managedWebp]) fs.rmSync(item, { force: true });
  assert.equal(fs.existsSync(typedFrontMatterDir), false, 'Front-Matter-Fixture muss vor Baseline-Wiederherstellung entfernt sein');
  assert.equal(fs.existsSync(managedWebp), false, 'Medienfixture muss vor Baseline-Wiederherstellung entfernt sein');
  fs.writeFileSync(generatedManifest, originalManifest);
  const restoredPreview = runNode('tools/build-preview.mjs', [], e2eRoot);
  assert.equal(restoredPreview.status, 0, `Bereinigte Vorschau muss wiederhergestellt werden: ${restoredPreview.stderr || restoredPreview.stdout}`);
  const restoredSingle = runNode('tools/build-single-file.mjs', [], e2eRoot);
  assert.equal(restoredSingle.status, 0, `Bereinigte Einzeldatei muss wiederhergestellt werden: ${restoredSingle.stderr || restoredSingle.stdout}`);
}
fs.rmSync(e2eRoot, { recursive: true, force: true });

assert.equal(fs.existsSync(path.join(root, 'assets/images/uploads')), false, 'Öffentlicher Rohbildordner darf nicht existieren');
assert.ok(fs.readFileSync(path.join(root, '.gitignore'), 'utf8').includes('_media-source/*'), 'Medienquellen müssen gitignored sein');
const cmsConfig = YAML.parse(fs.readFileSync(path.join(root, '.pages.yml'), 'utf8'), { uniqueKeys: true });
assert.equal(Object.hasOwn(cmsConfig, 'media'), false, 'CMS-Direktupload muss deaktiviert sein');
assert.doesNotMatch(fs.readFileSync(path.join(root, '.pages.yml'), 'utf8'), /\btype:\s*image\b/, 'CMS darf keine direkten Bilduploads anbieten');
const cmsImageFields = [];
const collectImageFields = value => {
  if (Array.isArray(value)) value.forEach(collectImageFields);
  else if (value && typeof value === 'object') {
    if (value.name === 'image') cmsImageFields.push(value);
    Object.values(value).forEach(collectImageFields);
  }
};
collectImageFields(cmsConfig);
assert.equal(cmsImageFields.length, 6, 'CMS muss alle sechs redaktionellen Bildfelder schematisieren');
for (const field of cmsImageFields) assert.equal(field.pattern, '^/assets/images/generated/[a-z0-9][a-z0-9-]*-[1-9][0-9]*\\.(webp|avif)$', 'CMS-Bildfeld muss generated-Derivatpfad erzwingen');
const runtime = fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8');
assert.doesNotMatch(runtime, /\b(?:innerHTML|outerHTML|insertAdjacentHTML|eval|document\.write)\b/, 'Unsicherer dynamischer DOM-Sink');

for (const name of fs.readdirSync(fixtureContentRoot)) {
  if (name.startsWith('security-')) fs.rmSync(path.join(fixtureContentRoot, name), { recursive: true, force: true });
}
console.log('Security regression tests: passed');
