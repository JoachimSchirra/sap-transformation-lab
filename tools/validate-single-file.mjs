import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const file = path.resolve(process.env.LLSG_SINGLE_FILE || path.join(root, '_artifacts', `LLSG-Website-Designstudie-v${packageJson.version}-EINE-DATEI.html`));
const html = fs.readFileSync(file, 'utf8');
const issues = [];
const routes = new Set([...html.matchAll(/<template data-route="([^"]+)"/g)].map(match => match[1]));
const decodeAttribute = value => value.replace(/&#x([0-9a-f]+);?/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&#([0-9]+);?/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

for (const match of html.matchAll(/href="#(\/[^"#?]*)"/g)) {
  let route = match[1];
  if (route !== '/' && route !== '/404.html' && !route.endsWith('/')) route += '/';
  if (!routes.has(route)) issues.push(`Link ohne Route: ${match[1]}`);
}
for (const match of html.matchAll(/\bdata-(?:search-data|gate-data|gate-evidence-data|xray-data|xray-evidence-data)="([^"]*)"/g)) {
  try { JSON.parse(decodeAttribute(match[1])); } catch (error) { issues.push(`Ungültige eingebettete JSON-Daten: ${error.message}`); }
}
if (/\{[{%]|{%|%}/.test(html)) issues.push('Nicht aufgelöster Liquid-Ausdruck');
if (!html.includes('data:image/png;base64,') || !html.includes('data:image/webp;base64,')) issues.push('Lokale Kernbilder nicht vollständig eingebettet');
if (/<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel\s*=\s*["']?stylesheet/i.test(html)) issues.push('Einzeldatei lädt externe Skripte oder Stylesheets');
if (/@import(?:\s|\/\*[\s\S]*?\*\/)*(?:url\s*\(|["'])/i.test(html)) issues.push('Einzeldatei enthält eine CSS-@import-Ressource');
for (const match of html.matchAll(/<(?:img|source|audio|video)\b[^>]*\b(?:src|srcset)\s*=\s*["']([^"']+)/gi)) {
  if (!match[1].startsWith('data:')) issues.push(`Nicht eingebettete Medienressource: ${match[1]}`);
}
for (const match of html.matchAll(/url\(([^)]+)\)/gi)) {
  const value = match[1].trim().replace(/^['"]|['"]$/g, '');
  if (value && !value.startsWith('data:') && !value.startsWith('#')) issues.push(`Nicht eingebettete CSS-Ressource: ${value}`);
}
if (!html.includes('outlet.replaceChildren')) issues.push('Sicherer Einzeldatei-Router fehlt');

console.log(JSON.stringify({ file, routes: routes.size, size: fs.statSync(file).size, issues }, null, 2));
process.exitCode = issues.length ? 1 : 0;
