import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'

export default defineConfig([
  {
    input: './index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'umd',
        name: 'treeTool'
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
      },
      {
        file: 'dist/index.mjs',
        format: 'esm',
      }
    ],
    plugins: [
      esbuild({ minify: true })
    ]
  }
])