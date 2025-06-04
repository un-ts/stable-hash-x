import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'stable-hash-x': new URL('src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    coverage: {
      enabled: true,
      include: ['src'],
    },
  },
})
