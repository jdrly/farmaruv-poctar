//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: [
      'convex/_generated/**',
      '.cursor/**',
      'to-rewrite/**',
      '.specstory/**',
      'node_modules/**',
      '*.config.js',
    ],
  },
  ...tanstackConfig,
]
