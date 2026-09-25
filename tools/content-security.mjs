import { marked } from 'marked';

const TRUSTED_TEMPLATE_PAGES = new Set([
  'projects/index.md', 'projects/llsg-foundation-p2p/index.md', 'projects/llsg-foundation-p2p/gate-1a/index.md',
  'projects/llsg-foundation-p2p/gate-2/index.md', 'evidence/index.md', 'journal/index.md', 'search/index.md',
  'inside-llsg/people/index.md', 'inside-llsg/business-episodes/index.md', 'inside-llsg/off-duty/index.md',
  'llsg/index.md', 'llsg/specialty-pharmaceuticals/index.md', 'llsg/specialty-pharmaceuticals/chronundo/index.md',
  'llsg/medical-devices-mobility/index.md', 'llsg/digital-health-connected-care/index.md', 'xray/gate-2/index.md',
  'sap-journey/index.md', 'sap-journey/business-process-design/index.md', 'sap-journey/system-map/index.md', 'sap-journey/system-architecture/index.md',
  '404.md', 'about.md', 'contact/index.md', 'evidence/standard/index.md', 'inside-llsg/index.md', 'joachim-schirra/index.md'
]);

export function isTrustedTemplatePage(relativePath) {
  return TRUSTED_TEMPLATE_PAGES.has(relativePath.replaceAll('\\', '/'));
}

function decodeEntities(value) {
  return String(value).replace(/&#x([0-9a-f]+);?/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);?/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&colon;?/gi, ':').replace(/&tab;?/gi, '\t').replace(/&newline;?/gi, '\n');
}

export function assertSafeUrl(value, label, { allowHttps = true, allowMailto = false } = {}) {
  const decoded = decodeEntities(value).trim().replace(/[\u0000-\u0020\u007f]+/g, '');
  if (decoded.startsWith('/') && !decoded.startsWith('//') && !decoded.includes('\\') && !/%(?:2e|2f|5c)/i.test(decoded)) return value;
  if (allowHttps && /^https:\/\/[A-Za-z0-9.-]+(?::\d+)?(?:[/?#]|$)/.test(decoded)) return value;
  if (allowMailto && /^mailto:[^\s@]+@[^\s@]+$/.test(decoded)) return value;
  if (/^(?:#|[a-z0-9][a-z0-9-]*\/)/i.test(decoded)) return value;
  throw new Error(`${label}: nicht freigegebene URL: ${value}`);
}

export function assertSafeEditorialBody(body, label) {
  if (/\{[{%]/.test(body)) throw new Error(`${label}: redaktionelles Liquid ist nicht zulässig`);
  if (/<\/?[a-z][^>]*>/i.test(body)) throw new Error(`${label}: rohes HTML ist nicht zulässig`);
  assertSafeMarkdownUrls(body, label);
}

export function assertSafeMarkdownUrls(body, label) {
  const tokens = marked.lexer(body, { gfm: true });
  marked.walkTokens(tokens, token => {
    if ((token.type === 'link' || token.type === 'image') && token.href) {
      assertSafeUrl(token.href, `${label}: Markdown-${token.type === 'image' ? 'Bild' : 'Link'}`);
    }
  });
  for (const definition of Object.values(tokens.links || {})) {
    if (definition?.href) assertSafeUrl(definition.href, `${label}: Markdown-Referenz`);
  }
}

const PUBLICATION_BOOLEAN_FIELDS = ['published', 'noindex', 'search_exclude', 'sitemap'];

export function assertFrontMatterTypes(data, label) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error(`${label}: Front Matter muss ein Objekt sein`);
  for (const field of PUBLICATION_BOOLEAN_FIELDS) {
    if (Object.hasOwn(data, field) && typeof data[field] !== 'boolean') {
      throw new Error(`${label}: ${field} muss boolesch sein`);
    }
  }
}

export function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
