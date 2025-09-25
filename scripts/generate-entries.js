import fs from 'fs';
import path from 'path';

const jsDir = path.resolve('src/js');
const cssDir = path.resolve('src/css');

// === Generate JS Entry ===
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'modules.js');
let jsImports = '';
let jsInitCalls = '';

jsFiles.forEach((file) => {
  const name = path.basename(file, '.js');
  const funcName = `init_${name.replace(/-/g, '_')}`;
  jsImports += `import { init as ${funcName} } from './${file}';\n`;
  jsInitCalls += `  if (typeof ${funcName} === 'function') ${funcName}();\n`;
});

const jsContent = `${jsImports}
export function initLib() {
${jsInitCalls}}\n`;

fs.writeFileSync(path.join(jsDir, 'modules.js'), jsContent);
console.log('modules.js generated ✅');

// === Generate CSS Entry ===
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && f !== 'modules.css');
let cssImports = cssFiles.map(file => `@import './${file}';`).join('\n');
fs.writeFileSync(path.join(cssDir, 'modules.css'), cssImports);
console.log('modules.css generated ✅');
