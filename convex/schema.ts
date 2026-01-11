import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,

  // User's animal count for per-animal calculations
  calculatorData: defineTable({
    userId: v.id('users'),
    animalCount: v.optional(v.number()),
  }).index('by_userId', ['userId']),

  // Expense line items with monthly/yearly frequency
  expenseItems: defineTable({
    userId: v.id('users'),
    itemId: v.string(),
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.boolean(),
    isCustom: v.boolean(),
    order: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_itemId', ['userId', 'itemId']),

  // Income line items with monthly/yearly frequency
  incomeItems: defineTable({
    userId: v.id('users'),
    itemId: v.string(),
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.boolean(),
    isCustom: v.boolean(),
    order: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_and_itemId', ['userId', 'itemId']),
})
