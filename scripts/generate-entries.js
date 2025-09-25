import fs from 'fs';
import path from 'path';

const jsDir = path.resolve('src/js');
const cssDir = path.resolve('src/css');

<<<<<<< HEAD
// === Generate JS Entry (safe if modules have no exports) ===
=======
// === Generate JS Entry ===
>>>>>>> 3af09dfe8ad140838f44df1b0766c67f9afd32ee
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'modules.js');
let jsImports = '';
let jsInitCalls = '';

jsFiles.forEach((file) => {
<<<<<<< HEAD
  const varName = 'mod_' + file.replace(/[^a-zA-Z0-9]/g, '_').replace(/_js$/, '');
  jsImports += `import * as ${varName} from './${file}';\n`;
  jsInitCalls += `  if (typeof ${varName}.init === 'function') { try { ${varName}.init(); } catch (e) { console.warn('init failed for ${file}:', e); } }\n`;
=======
  const name = path.basename(file, '.js');
  const funcName = `init_${name.replace(/-/g, '_')}`;
  jsImports += `import { init as ${funcName} } from './${file}';\n`;
  jsInitCalls += `  if (typeof ${funcName} === 'function') ${funcName}();\n`;
>>>>>>> 3af09dfe8ad140838f44df1b0766c67f9afd32ee
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
