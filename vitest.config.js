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
      // Add explicit include patterns for your test files
      include: [
        '**/*.spec.ts',
        '**/*.spec.vue',
        'tests/**/*.{ts,vue}',
        'src/**/*.{spec,test}.{ts,vue}',
      ],
      // Configure test file naming patterns
      fileNameMatcher: '*.{spec,test}.{ts,vue}',
    },
  }),
)
