import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  
  // Store user calculations
  calculatorData: defineTable({
    userId: v.id("users"),
    animalCount: v.optional(v.number()),
  }).index("by_user", ["userId"]),
  
  // Store expense items
  expenseItems: defineTable({
    userId: v.id("users"),
    itemId: v.string(), // e.g., "feed", "equipment", "custom-expense-1"
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.optional(v.boolean()),
    isCustom: v.optional(v.boolean()),
    order: v.number(), // To maintain the display order
  }).index("by_user", ["userId"])
    .index("by_user_and_id", ["userId", "itemId"]),
  
  // Store income items
  incomeItems: defineTable({
    userId: v.id("users"),
    itemId: v.string(), // e.g., "meat", "eggs-consumption", "custom-income-1"
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.optional(v.boolean()),
    isCustom: v.optional(v.boolean()),
    order: v.number(), // To maintain the display order
  }).index("by_user", ["userId"])
    .index("by_user_and_id", ["userId", "itemId"]),
  
  // For backward compatibility
  numbers: defineTable({
    value: v.number(),
  }),
});
