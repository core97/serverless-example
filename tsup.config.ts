import { defineConfig } from 'tsup';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { resolve } from 'node:path';
import { globSync } from 'glob';

// Find all API handler files
const apiHandlers = globSync('src/*/presentation/api/*.api.ts');

// Create entry points object with clean names
// Example: src/book/presentation/api/book.api.ts -> handlers/book-book
const entry = apiHandlers.reduce((acc, file) => {
  const match = file.match(/src\/([^/]+)\/presentation\/api\/([^/]+)\.api\.ts/);
  if (match) {
    const [, module, handler] = match;
    const entryName = `handlers/${module}-${handler}`;
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
