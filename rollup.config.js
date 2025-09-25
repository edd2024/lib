import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { execSync } from 'child_process';

function generateEntries() {
  execSync('node scripts/generate-entries.js', { stdio: 'inherit' });
}

export default [
  {
    input: 'src/js/modules.js',
    output: [
      { file: 'dist/lib.js', format: 'iife', name: 'Lib' },
      { file: 'dist/lib.min.js', format: 'iife', name: 'Lib', plugins: [terser()] }
    ],
    plugins: [{ buildStart: generateEntries }]
  },
  {
    input: 'src/css/modules.css',
    output: { file: 'dist/lib.css' },
    plugins: [postcss({ extract: true, minimize: false })]
  },
  {
    input: 'src/css/modules.css',
    output: { file: 'dist/lib.min.css' },
    plugins: [postcss({ extract: true, minimize: true, plugins: [require('autoprefixer'), require('cssnano')] })]
  }
];
