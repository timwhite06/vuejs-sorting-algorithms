import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: [
        '**/*.spec.ts',
        '**/*.spec.vue',
        'tests/**/*.{ts,vue}',
        'src/**/*.{spec,test}.{ts,vue}',
      ],
      fileNameMatcher: '*.{spec,test}.{ts,vue}',
      coverage: {
        reporter: ['text', 'json', 'json-summary', 'lcov'],
      },
    },
  }),
)
