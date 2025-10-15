import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// ...

export default [
  // JS config (unchanged) …
  {
    input: 'src/js/modules.js',
    output: {
      file: 'dist/lib.min.js',
      format: 'iife',
      name: 'LibBundle',
      sourcemap: false
    },
    plugins: [
      // resolve(), commonjs(), terser() etc.
    ]
  },

  // CSS: write a throwaway JS file OUTSIDE dist so no nested folder appears
  {
    input: 'src/css/modules.css',
    // Write the placeholder JS to a temp path at project root (not under dist)
    output: { file: '_noop.js', format: 'es' },
    plugins: [
      postcss({
        extract: 'dist/lib.min.css',   // final CSS path
        minimize: true,
        plugins: [autoprefixer(), cssnano()]
      })
    ]
  }
];