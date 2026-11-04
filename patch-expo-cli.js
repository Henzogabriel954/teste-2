const fs = require('fs');
const path = require('path');

const polyfillRequire = "require(require('path').resolve(__dirname, '" + path.resolve(__dirname, 'url-polyfill.js').replace(/\\/g, '/') + "'));\n";

const targetFiles = [
  path.resolve(__dirname, 'node_modules/expo/bin/cli'),
  path.resolve(__dirname, 'node_modules/expo/node_modules/@expo/cli/bin/cli.js'),
  path.resolve(__dirname, 'node_modules/@expo/cli/bin/cli.js')
];

targetFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('url-polyfill')) {
      const lines = content.split('\n');
      if (lines[0].startsWith('#!')) {
        lines.splice(1, 0, polyfillRequire);
      } else {
        lines.unshift(polyfillRequire);
      }
      fs.writeFileSync(file, lines.join('\n'), 'utf8');
      console.log('Patched:', file);
    }
  }
});
