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
<<<<<<< HEAD
      { file: 'dist/lib.js', format: 'iife', name: 'Lib' },
      { file: 'dist/lib.min.js', format: 'iife', name: 'Lib', plugins: [terser()] }
    ],
    plugins: [{ buildStart: generateEntries }]
=======
      {
        file: 'dist/lib.js',
        format: 'iife',
        name: 'Lib',
      },
      {
        file: 'dist/lib.min.js',
        format: 'iife',
        name: 'Lib',
        plugins: [terser()],
      },
    ],
    plugins: [
      { buildStart: generateEntries }
    ],
>>>>>>> 3af09dfe8ad140838f44df1b0766c67f9afd32ee
  },
  {
    input: 'src/css/modules.css',
    output: { file: 'dist/lib.css' },
<<<<<<< HEAD
    plugins: [postcss({ extract: true, minimize: false })]
=======
    plugins: [
      postcss({ extract: true, minimize: false })
    ],
>>>>>>> 3af09dfe8ad140838f44df1b0766c67f9afd32ee
  },
  {
    input: 'src/css/modules.css',
    output: { file: 'dist/lib.min.css' },
<<<<<<< HEAD
    plugins: [postcss({ extract: true, minimize: true, plugins: [require('autoprefixer'), require('cssnano')] })]
  }
=======
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        plugins: [require('autoprefixer'), require('cssnano')],
      }),
    ],
  },
>>>>>>> 3af09dfe8ad140838f44df1b0766c67f9afd32ee
];
