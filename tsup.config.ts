import { defineConfig } from 'tsup';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { resolve } from 'node:path';
import { globSync } from 'glob';

// Find all API handler files
const httpHandlers = globSync('src/*/presentation/functions/http/*.http.ts');

// Create entry points object with clean names
const entry = httpHandlers.reduce((acc, file) => {
  const match = file.match(/src\/([^/]+)\/presentation\/functions\/http\/([^/]+)\.http\.ts/);
  if (match) {
    const [, module, handler] = match;
    const entryName = `${module}/functions/http/${handler}`;
    acc[entryName] = file;
  }
  return acc;
}, {} as Record<string, string>);

export default defineConfig(options => ({
  ...options,
  clean: true,
  entry,
  esbuildPlugins: [
    esbuildPluginTsc({ tsconfigPath: resolve(process.cwd(), 'tsconfig.json') }),
  ],
  format: ['cjs'],
  keepNames: true,
  minify: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  treeshake: true,
}));
