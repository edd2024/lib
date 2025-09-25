import fs from 'fs';
const file = 'LICENSE.txt';
let license = fs.readFileSync(file, 'utf8');
const year = new Date().getFullYear();
license = license.replace(/{{YEAR}}/g, year);
fs.writeFileSync(file, license);
console.log(`✅ LICENSE.txt updated with year ${year}`);
