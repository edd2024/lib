import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default [
  // ... JS config unchanged
  {
    input: 'src/css/modules.css',
    output: { file: '_noop.js', format: 'es' },
    plugins: [
      postcss({
        extract: 'dist/lib.min.css',
        minimize: true,
        plugins: [
          postcssImport(),   // resolves and inlines @import files
          autoprefixer(),
          cssnano()
        ]
      })
    ]
  }
];