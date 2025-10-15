import { terser } from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import glob from 'glob';

const jsEntries = glob.sync('src/js/**/*.js');
const jsModuleEntries = glob.sync('src/js/modules/**/*.js');
const cssEntries = glob.sync('src/css/**/*.css', { ignore: ['src/css/modules/**'] });
const cssModuleEntries = glob.sync('src/css/modules/**/*.css');

export default [
  // JS bundle (all)
  {
    input: jsEntries,
    output: {
      file: 'dist/lib.min.js',
      format: 'iife',
      sourcemap: false,
      name: 'LibBundle'
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  },

  // JS modules bundle (modules only)
  {
    input: jsModuleEntries.length ? jsModuleEntries : 'src/js/empty.js',
    output: {
      file: 'dist/modules.js',
      format: 'iife',
      sourcemap: false,
      name: 'ModulesBundle'
    },
    plugins: [
      resolve(),
      commonjs(),
      // add terser() here if you want it minified too
    ]
  },

  // CSS bundle (all)
  {
    input: cssEntries,
    output: { file: 'dist/_noop.js', format: 'es' }, // no JS emitted
    plugins: [
      postcss({
        extract: 'dist/lib.min.css',
        minimize: true,
        plugins: [cssnano()],
      })
    ]
  },

  // CSS modules bundle (modules only)
  {
    input: cssModuleEntries.length ? cssModuleEntries : [],
    output: { file: 'dist/_noop2.js', format: 'es' },
    plugins: [
      postcss({
        extract: 'dist/modules.css',
        minimize: false
      })
    ]
  }
];