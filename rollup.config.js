import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/me-agent-sdk.js',
      format: 'umd',
      name: 'MeAgent',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
      }),
    ],
  },
  // Minified UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/me-agent-sdk.min.js',
      format: 'umd',
      name: 'MeAgent',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      production && terser(),
    ],
  },
];

