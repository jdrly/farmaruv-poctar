import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { auth } from './auth'

// Default expense items for new users
const DEFAULT_EXPENSES = [
  { id: 'feed', name: 'Měsíční náklady na krmení', isMonthly: true, order: 0 },
  { id: 'equipment', name: 'Roční náklady na vybavení', isMonthly: false, order: 1 },
  { id: 'equipment-monthly', name: 'Měsíční náklady na vybavení', isMonthly: true, order: 2 },
  { id: 'vet', name: 'Měsíční náklady na veterinární péči', isMonthly: true, order: 3 },
  { id: 'animals', name: 'Roční náklady na pořízení zvířat', isMonthly: false, order: 4 },
  { id: 'animals-monthly', name: 'Měsíční náklady na pořízení zvířat', isMonthly: true, order: 5 },
] as const

// Default income items for new users
const DEFAULT_INCOMES = [
  { id: 'meat', name: 'Měsíční příjmy z prodeje masa', isMonthly: true, order: 0 },
  { id: 'eggs-consumption', name: 'Měsíční příjmy z prodeje vajec pro spotřebu', isMonthly: true, order: 1 },
  { id: 'eggs-hatching', name: 'Roční příjem z prodeje násadových vajec', isMonthly: false, order: 2 },
  { id: 'eggs-hatching-monthly', name: 'Měsíční příjem z prodeje násadových vajec', isMonthly: true, order: 3 },
  { id: 'animals-yearly', name: 'Roční příjem z prodeje živých zvířat', isMonthly: false, order: 4 },
  { id: 'animals-monthly', name: 'Měsíční příjem z prodeje živých zvířat', isMonthly: true, order: 5 },
  { id: 'other-income', name: 'Měsíční příjem z vedlejší živočišné produkce', isMonthly: true, order: 6 },
  { id: 'subsidies', name: 'Měsíční příjem z pobíraných dotací', isMonthly: true, order: 7 },
] as const

// Expense/Income item validator for returns
const itemValidator = v.object({
  _id: v.id('expenseItems'),
  _creationTime: v.number(),
  userId: v.id('users'),
  itemId: v.string(),
  name: v.string(),
  value: v.optional(v.number()),
  note: v.string(),
  isMonthly: v.boolean(),
  isCustom: v.boolean(),
  order: v.number(),
})

const incomeItemValidator = v.object({
  _id: v.id('incomeItems'),
  _creationTime: v.number(),
  userId: v.id('users'),
  itemId: v.string(),
  name: v.string(),
  value: v.optional(v.number()),
  note: v.string(),
  isMonthly: v.boolean(),
  isCustom: v.boolean(),
  order: v.number(),
})

// ============ QUERIES ============

export const getAnimalCount = query({
  args: {},
  returns: v.union(v.number(), v.null()),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) return null

    const calculatorData = await ctx.db
      .query('calculatorData')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()

    return calculatorData?.animalCount ?? null
  },
})

export const getExpenses = query({
  args: {},
  returns: v.array(itemValidator),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) return []

    const expenses = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    return expenses.sort((a, b) => a.order - b.order)
  },
})

export const getIncomes = query({
  args: {},
  returns: v.array(incomeItemValidator),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) return []

    const incomes = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    return incomes.sort((a, b) => a.order - b.order)
  },
})

// ============ MUTATIONS ============

export const saveAnimalCount = mutation({
  args: {
    count: v.optional(v.number()),
  },
  returns: v.id('calculatorData'),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const existingData = await ctx.db
      .query('calculatorData')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()

    if (existingData) {
      await ctx.db.patch(existingData._id, { animalCount: args.count })
      return existingData._id
    }

    return await ctx.db.insert('calculatorData', {
      userId,
      animalCount: args.count,
    })
  },
})

export const saveExpenseItem = mutation({
  args: {
    itemId: v.string(),
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.boolean(),
    isCustom: v.boolean(),
    order: v.number(),
  },
  returns: v.id('expenseItems'),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const existingItem = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId_and_itemId', (q) => q.eq('userId', userId).eq('itemId', args.itemId))
      .first()

    if (existingItem) {
      await ctx.db.patch(existingItem._id, {
        name: args.name,
        value: args.value,
        note: args.note,
        isMonthly: args.isMonthly,
        isCustom: args.isCustom,
        order: args.order,
      })
      return existingItem._id
    }

    return await ctx.db.insert('expenseItems', {
      userId,
      itemId: args.itemId,
      name: args.name,
      value: args.value,
      note: args.note,
      isMonthly: args.isMonthly,
      isCustom: args.isCustom,
      order: args.order,
    })
  },
})

export const saveIncomeItem = mutation({
  args: {
    itemId: v.string(),
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.boolean(),
    isCustom: v.boolean(),
    order: v.number(),
  },
  returns: v.id('incomeItems'),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const existingItem = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId_and_itemId', (q) => q.eq('userId', userId).eq('itemId', args.itemId))
      .first()

    if (existingItem) {
      await ctx.db.patch(existingItem._id, {
        name: args.name,
        value: args.value,
        note: args.note,
        isMonthly: args.isMonthly,
        isCustom: args.isCustom,
        order: args.order,
      })
      return existingItem._id
    }

    return await ctx.db.insert('incomeItems', {
      userId,
      itemId: args.itemId,
      name: args.name,
      value: args.value,
      note: args.note,
      isMonthly: args.isMonthly,
      isCustom: args.isCustom,
      order: args.order,
    })
  },
})

export const deleteExpenseItem = mutation({
  args: {
    itemId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const item = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId_and_itemId', (q) => q.eq('userId', userId).eq('itemId', args.itemId))
      .first()

    if (item) {
      await ctx.db.delete(item._id)
      return true
    }
    return false
  },
})

export const deleteIncomeItem = mutation({
  args: {
    itemId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const item = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId_and_itemId', (q) => q.eq('userId', userId).eq('itemId', args.itemId))
      .first()

    if (item) {
      await ctx.db.delete(item._id)
      return true
    }
    return false
  },
})

export const initializeCalculatorForUser = mutation({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Check if user already has calculator data
    const existingData = await ctx.db
      .query('calculatorData')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first()

    if (existingData) {
      // User already has calculator data initialized
      return false
    }

    // Create calculator data
    await ctx.db.insert('calculatorData', {
      userId,
      animalCount: undefined,
    })

    // Initialize default expense items
    for (const expense of DEFAULT_EXPENSES) {
      await ctx.db.insert('expenseItems', {
        userId,
        itemId: expense.id,
        name: expense.name,
        value: undefined,
        note: '',
        isMonthly: expense.isMonthly,
        isCustom: false,
        order: expense.order,
      })
    }

    // Initialize default income items
    for (const income of DEFAULT_INCOMES) {
      await ctx.db.insert('incomeItems', {
        userId,
        itemId: income.id,
        name: income.name,
        value: undefined,
        note: '',
        isMonthly: income.isMonthly,
        isCustom: false,
        order: income.order,
      })
    }

    return true
  },
})
