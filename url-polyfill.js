// Polyfill URL.parse for Node.js versions prior to v22
const urlModule = require('url');

function parse(url, base) {
  try {
    return new URL(url, base);
  } catch {
    return null;
  }
}

if (typeof URL !== 'undefined' && !URL.parse) {
  URL.parse = parse;
}
if (typeof globalThis !== 'undefined' && globalThis.URL && !globalThis.URL.parse) {
  globalThis.URL.parse = parse;
}
if (urlModule.URL && !urlModule.URL.parse) {
  urlModule.URL.parse = parse;
}
