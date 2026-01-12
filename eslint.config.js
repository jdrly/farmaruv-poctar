//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [...tanstackConfig]

// eslint.config.js
ignores: [
  'convex/_generated/**',
  '.cursor/**',
  'to-rewrite/**',
  '.specstory/**',
  'node_modules/**',
]
