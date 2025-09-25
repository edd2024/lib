import fs from 'fs';
<<<<<<< HEAD
const file = 'LICENSE.txt';
let license = fs.readFileSync(file, 'utf8');
const year = new Date().getFullYear();
license = license.replace(/{{YEAR}}/g, year);
=======

const file = 'LICENSE.txt';
let license = fs.readFileSync(file, 'utf8');
const year = new Date().getFullYear();

// Replace all {{YEAR}} placeholders with current year
license = license.replace(/{{YEAR}}/g, year);

>>>>>>> 3af09dfe8ad140838f44df1b0766c67f9afd32ee
fs.writeFileSync(file, license);
console.log(`✅ LICENSE.txt updated with year ${year}`);
