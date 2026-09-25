import fs from 'node:fs/promises';
import path from 'node:path';
import { safeProjectDirectory, safeProjectFile } from './safe-paths.mjs';

const root = process.cwd();
const previewRoot = safeProjectDirectory(root, process.env.LLSG_PREVIEW_SITE || path.join(root, '_preview'), 'LLSG_PREVIEW_SITE');
const packageJson = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const artifactDir = safeProjectDirectory(root, process.env.LLSG_ARTIFACT_DIR || path.join(root, '_artifacts'), 'LLSG_ARTIFACT_DIR');
const output = safeProjectFile(root, process.env.LLSG_SINGLE_OUTPUT || path.join(artifactDir, `LLSG-Website-Designstudie-v${packageJson.version}-EINE-DATEI.html`), 'LLSG_SINGLE_OUTPUT', '.html');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => {
    const item = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symbolischer Link im Vorschauartefakt: ${item}`);
    return entry.isDirectory() ? walk(item) : [item];
  }))).flat();
}

function routeFor(file) {
  const relative = path.relative(previewRoot, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative === '404.html') return '/404.html';
  return `/${relative.replace(/index\.html$/, '')}`;
}

function titleFor(html) {
  const match = html.match(/<title>(.*?)<\/title>/s);
  return (match?.[1] || 'SAP Transformation Lab').replace(/\s*\|\s*SAP Transformation Lab$/, '');
}

const htmlFiles = (await walk(previewRoot)).filter(file => file.endsWith('.html') && path.basename(file) !== 'START_HERE.html').sort();
const routes = [];
for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  const main = html.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1];
  if (main == null) throw new Error(`${file}: main#main fehlt`);
  routes.push({ route: routeFor(file), title: titleFor(html), main });
}

const css = await fs.readFile(path.join(previewRoot, 'assets/css/main.css'), 'utf8');
const siteJs = await fs.readFile(path.join(previewRoot, 'assets/js/main.js'), 'utf8');
let html = await fs.readFile(path.join(previewRoot, 'index.html'), 'utf8');

html = html.replace(/<link rel="stylesheet"[^>]+>/, `<style>\n${css}\n</style>`);
html = html.replace(/<script src="[^"]*\/assets\/js\/main\.js" defer><\/script>/, '');
html = html.replace(/<main id="main">[\s\S]*?<\/main>/, `<main id="main"><div id="route-content"></div></main>\n${routes.map(item => `<template data-route="${item.route}">${item.main}</template>`).join('\n')}`);

const imageFiles = (await walk(path.join(previewRoot, 'assets/images'))).filter(file => /\.(?:png|jpe?g|webp|avif|svg)$/i.test(file));
for (const file of imageFiles) {
  const extension = path.extname(file).toLowerCase();
  const mime = extension === '.svg' ? 'image/svg+xml' : extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : extension === '.avif' ? 'image/avif' : `image/${extension.slice(1)}`;
  const data = (await fs.readFile(file)).toString('base64');
  const url = `/${path.relative(previewRoot, file).replaceAll(path.sep, '/')}`;
  html = html.split(url).join(`data:${mime};base64,${data}`);
}

html = html.replace(/href="(\/[^"#?]*)"/g, (match, route) => route.startsWith('/assets/') ? match : `href="#${route}"`);

const titles = Object.fromEntries(routes.map(item => [item.route, item.title]));
const routerJs = `
${siteJs}
(function () {
  const titles = ${JSON.stringify(titles)};
  const outlet = document.getElementById('route-content');
  const templates = new Map(Array.from(document.querySelectorAll('template[data-route]')).map(template => [template.dataset.route, template]));
  function normalizeRoute() {
    let route = location.hash.slice(1) || '/';
    if (!route.startsWith('/')) route = '/' + route;
    if (route !== '/' && route !== '/404.html' && !route.endsWith('/')) route += '/';
    return templates.has(route) ? route : '/404.html';
  }
  function render() {
    const route = normalizeRoute();
    outlet.replaceChildren(templates.get(route).content.cloneNode(true));
    window.LLSG?.initPage(outlet);
    document.title = (route === '/' ? '' : titles[route] + ' | ') + 'SAP Transformation Lab';
    document.querySelectorAll('.main-navigation a').forEach(link => {
      const target = (link.getAttribute('href') || '').replace(/^#/, '');
      const active = target === route || (target !== '/' && route.startsWith(target));
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  window.addEventListener('hashchange', render);
  render();
})();`;

html = html.replace('</body>', `<script>\n${routerJs}\n</script>\n</body>`);
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, html);
console.log(JSON.stringify({ input: previewRoot, output, routes: routes.length, bytes: Buffer.byteLength(html) }));
