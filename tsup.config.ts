import { defineConfig } from 'tsup';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { resolve } from 'node:path';
import { globSync } from 'glob';

// Find all API handler files
const httpHandlers = globSync('src/*/presentation/functions/http/*.http.ts');

// Find all cron handler files
const cronHandlers = globSync('src/*/presentation/functions/cron/*.cron.ts');

// Create entry points object with clean names
const entry = [...httpHandlers, ...cronHandlers].reduce((acc, file) => {
  const httpMatch = file.match(/src\/([^/]+)\/presentation\/functions\/http\/([^/]+)\.http\.ts/);
  const cronMatch = file.match(/src\/([^/]+)\/presentation\/functions\/cron\/([^/]+)\.cron\.ts/);

  if (httpMatch) {
    const [, module, handler] = httpMatch;
    const entryName = `${module}/functions/http/${handler}`;
    acc[entryName] = file;
  } else if (cronMatch) {
    const [, module, handler] = cronMatch;
    const entryName = `${module}/functions/cron/${handler}`;
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
  sourcemap: true, // external source maps (keeps bundle size small, still works with source-map-support)
  splitting: false,
  treeshake: true,
}));
