// scripts/build-modules.js
import fs from "fs";
import path from "path";

const cssDir = "src/css";
const jsDir = "src/js";

// 1️⃣ Auto-build modules.css dynamically
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith(".css") && f !== "modules.css");
const cssImports = cssFiles.map(f => `@import "./${f}";`).join("\n");
fs.writeFileSync(path.join(cssDir, "modules.css"), cssImports);
console.log(`✅ modules.css updated with ${cssFiles.length} CSS imports.`);

// 2️⃣ Auto-build modules.js dynamically
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith(".js") && f !== "modules.js");

const jsImports = jsFiles
  .map(f => {
    const safeName = f.replace(".js", "").replace(/[^a-zA-Z0-9_]/g, "_");
    return `import * as mod_${safeName} from "./${f}";`;
  })
  .join("\n");

const initLines = jsFiles
  .map(f => {
    const safeName = f.replace(".js", "").replace(/[^a-zA-Z0-9_]/g, "_");
    return `  if (typeof mod_${safeName}.init === 'function') { try { mod_${safeName}.init(); } catch (e) { console.warn('init failed for ${f}:', e); } }`;
  })
  .join("\n");

const jsTemplate = `${jsImports}\n\nexport function initLib() {\n${initLines}\n}\n`;

fs.writeFileSync(path.join(jsDir, "modules.js"), jsTemplate);
console.log(`✅ modules.js updated with ${jsFiles.length} JS imports.`);
