import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

export default [
  // JS: bundle the auto-generated modules.js
  {
    input: 'src/js/modules.js',
    output: {
      file: 'dist/lib.min.js',
      format: 'iife',
      name: 'LibBundle',
      sourcemap: false
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  },

  // CSS: bundle the auto-generated modules.css
  {
    input: 'src/css/modules.css',
    output: { file: 'dist/_noop.js', format: 'es' },
    plugins: [
      postcss({
        extract: 'dist/lib.min.css',
        minimize: true,
        plugins: [autoprefixer(), cssnano()]
      })
    ]
  }
];