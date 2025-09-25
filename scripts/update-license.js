import fs from 'fs';

const file = 'LICENSE.txt';
let license = fs.readFileSync(file, 'utf8');
const year = new Date().getFullYear();

// Replace all {{YEAR}} placeholders with current year
license = license.replace(/{{YEAR}}/g, year);

fs.writeFileSync(file, license);
console.log(`✅ LICENSE.txt updated with year ${year}`);
