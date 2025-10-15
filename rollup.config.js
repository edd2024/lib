import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default [
  {
    input: 'src/js/modules.js',
    output: {
      file: 'dist/lib.min.js',
      format: 'iife',
      name: 'LibBundle',
      sourcemap: false
    },
    plugins: [
      // resolve(), commonjs(), terser() ...
    ]
  },
  {
    input: 'src/css/modules.css',
    output: { file: '_noop.js', format: 'es' },
    plugins: [
      postcss({
        extract: 'dist/lib.min.css',
        minimize: true,
        plugins: [autoprefixer(), cssnano()]
      })
    ]
  }
];