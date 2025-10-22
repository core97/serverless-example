import { defineConfig } from 'tsup';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { resolve } from 'node:path';

export default defineConfig(options => ({
  ...options,
  clean: true,
  entry: ['./src/main.ts'],
  esbuildPlugins: [
    esbuildPluginTsc({ tsconfigPath: resolve(process.cwd(), 'tsconfig.json') }),
  ],
  format: ['esm'],
  keepNames: true,
  minify: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  treeshake: true,
}));
