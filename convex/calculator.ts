import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { auth } from './auth'
import {
  requireAuth,
  validateMaxLength,
  validateNonEmptyString,
  validatePositiveNumber,
} from './errors'

// ============ VALIDATORS (exported for frontend type inference) ============

// Item validators for queries
export const expenseItemValidator = v.object({
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

export const incomeItemValidator = v.object({
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

// Combined calculator data validator
export const calculatorDataValidator = v.object({
  animalCount: v.union(v.number(), v.null()),
  expenses: v.array(expenseItemValidator),
  incomes: v.array(incomeItemValidator),
  isInitialized: v.boolean(),
})

// ============ DEFAULT ITEMS ============

// Default expense items for new users
const DEFAULT_EXPENSES = [
  { id: 'feed', name: 'Měsíční náklady na krmení', isMonthly: true, order: 0 },
  {
    id: 'equipment',
    name: 'Roční náklady na vybavení',
    isMonthly: false,
    order: 1,
  },
  {
    id: 'equipment-monthly',
    name: 'Měsíční náklady na vybavení',
    isMonthly: true,
    order: 2,
  },
  {
    id: 'vet',
    name: 'Měsíční náklady na veterinární péči',
    isMonthly: true,
    order: 3,
  },
  {
    id: 'animals',
    name: 'Roční náklady na pořízení zvířat',
    isMonthly: false,
    order: 4,
  },
  {
    id: 'animals-monthly',
    name: 'Měsíční náklady na pořízení zvířat',
    isMonthly: true,
    order: 5,
  },
] as const

// Default income items for new users
const DEFAULT_INCOMES = [
  {
    id: 'meat',
    name: 'Měsíční příjmy z prodeje masa',
    isMonthly: true,
    order: 0,
  },
  {
    id: 'eggs-consumption',
    name: 'Měsíční příjmy z prodeje vajec pro spotřebu',
    isMonthly: true,
    order: 1,
  },
  {
    id: 'eggs-hatching',
    name: 'Roční příjem z prodeje násadových vajec',
    isMonthly: false,
    order: 2,
  },
  {
    id: 'eggs-hatching-monthly',
    name: 'Měsíční příjem z prodeje násadových vajec',
    isMonthly: true,
    order: 3,
  },
  {
    id: 'animals-yearly',
    name: 'Roční příjem z prodeje živých zvířat',
    isMonthly: false,
    order: 4,
  },
  {
    id: 'animals-monthly',
    name: 'Měsíční příjem z prodeje živých zvířat',
    isMonthly: true,
    order: 5,
  },
  {
    id: 'other-income',
    name: 'Měsíční příjem z vedlejší živočišné produkce',
    isMonthly: true,
    order: 6,
  },
  {
    id: 'subsidies',
    name: 'Měsíční příjem z pobíraných dotací',
    isMonthly: true,
    order: 7,
  },
] as const

// ============ QUERIES ============

// Combined query to get all calculator data in one call (reduces round trips)
export const getCalculatorData = query({
  args: {},
  returns: calculatorDataValidator,
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)

    if (!userId) {
      return {
        animalCount: null,
        expenses: [],
        incomes: [],
        isInitialized: false,
      }
    }

    const [calculatorData, expenses, incomes] = await Promise.all([
      ctx.db
        .query('calculatorData')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .first(),
      ctx.db
        .query('expenseItems')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .collect(),
      ctx.db
        .query('incomeItems')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .collect(),
    ])

    return {
      animalCount: calculatorData?.animalCount ?? null,
      expenses: expenses.sort((a, b) => a.order - b.order),
      incomes: incomes.sort((a, b) => a.order - b.order),
      isInitialized: calculatorData !== null,
    }
  },
})

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
  returns: v.array(expenseItemValidator),
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
    requireAuth(userId)

    // Validate animal count is not negative
    validatePositiveNumber(args.count, 'Počet zvířat')

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
    requireAuth(userId)

    // Validate inputs
    validateNonEmptyString(args.itemId, 'ID položky')
    validateNonEmptyString(args.name, 'Název')
    validateMaxLength(args.name, 200, 'Název')
    validateMaxLength(args.note, 1000, 'Poznámka')
    validatePositiveNumber(args.value, 'Hodnota')

    const existingItem = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
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
    requireAuth(userId)

    // Validate inputs
    validateNonEmptyString(args.itemId, 'ID položky')
    validateNonEmptyString(args.name, 'Název')
    validateMaxLength(args.name, 200, 'Název')
    validateMaxLength(args.note, 1000, 'Poznámka')
    validatePositiveNumber(args.value, 'Hodnota')

    const existingItem = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
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
    requireAuth(userId)

    const item = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
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
    requireAuth(userId)

    const item = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
      .first()

    if (item) {
      await ctx.db.delete(item._id)
      return true
    }
    return false
  },
})

// Quick value-only update for expenses (optimized for rapid editing)
export const updateExpenseValue = mutation({
  args: {
    itemId: v.string(),
    value: v.optional(v.number()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validatePositiveNumber(args.value, 'Hodnota')

    const item = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
      .first()

    if (item) {
      await ctx.db.patch(item._id, { value: args.value })
      return true
    }
    return false
  },
})

// Quick value-only update for incomes (optimized for rapid editing)
export const updateIncomeValue = mutation({
  args: {
    itemId: v.string(),
    value: v.optional(v.number()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validatePositiveNumber(args.value, 'Hodnota')

    const item = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
      .first()

    if (item) {
      await ctx.db.patch(item._id, { value: args.value })
      return true
    }
    return false
  },
})

// Quick note update for expenses
export const updateExpenseNote = mutation({
  args: {
    itemId: v.string(),
    note: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validateMaxLength(args.note, 1000, 'Poznámka')

    const item = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
      .first()

    if (item) {
      await ctx.db.patch(item._id, { note: args.note })
      return true
    }
    return false
  },
})

// Quick note update for incomes
export const updateIncomeNote = mutation({
  args: {
    itemId: v.string(),
    note: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validateMaxLength(args.note, 1000, 'Poznámka')

    const item = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
      .first()

    if (item) {
      await ctx.db.patch(item._id, { note: args.note })
      return true
    }
    return false
  },
})

// Add a new custom expense item
export const addCustomExpense = mutation({
  args: {
    name: v.string(),
  },
  returns: v.id('expenseItems'),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validateNonEmptyString(args.name, 'Název')
    validateMaxLength(args.name, 200, 'Název')

    // Get existing expenses to determine order and generate unique ID
    const existingExpenses = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    const customCount = existingExpenses.filter((e) => e.isCustom).length
    const maxOrder = existingExpenses.reduce(
      (max, e) => Math.max(max, e.order),
      -1,
    )

    return await ctx.db.insert('expenseItems', {
      userId,
      itemId: `custom-expense-${customCount + 1}`,
      name: args.name,
      value: undefined,
      note: '',
      isMonthly: true,
      isCustom: true,
      order: maxOrder + 1,
    })
  },
})

// Add a new custom income item
export const addCustomIncome = mutation({
  args: {
    name: v.string(),
  },
  returns: v.id('incomeItems'),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validateNonEmptyString(args.name, 'Název')
    validateMaxLength(args.name, 200, 'Název')

    // Get existing incomes to determine order and generate unique ID
    const existingIncomes = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    const customCount = existingIncomes.filter((i) => i.isCustom).length
    const maxOrder = existingIncomes.reduce(
      (max, i) => Math.max(max, i.order),
      -1,
    )

    return await ctx.db.insert('incomeItems', {
      userId,
      itemId: `custom-income-${customCount + 1}`,
      name: args.name,
      value: undefined,
      note: '',
      isMonthly: true,
      isCustom: true,
      order: maxOrder + 1,
    })
  },
})

// Rename a custom expense item
export const renameExpenseItem = mutation({
  args: {
    itemId: v.string(),
    name: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validateNonEmptyString(args.name, 'Název')
    validateMaxLength(args.name, 200, 'Název')

    const item = await ctx.db
      .query('expenseItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
      .first()

    if (item && item.isCustom) {
      await ctx.db.patch(item._id, { name: args.name })
      return true
    }
    return false
  },
})

// Rename a custom income item
export const renameIncomeItem = mutation({
  args: {
    itemId: v.string(),
    name: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx)
    requireAuth(userId)

    validateNonEmptyString(args.name, 'Název')
    validateMaxLength(args.name, 200, 'Název')

    const item = await ctx.db
      .query('incomeItems')
      .withIndex('by_userId_and_itemId', (q) =>
        q.eq('userId', userId).eq('itemId', args.itemId),
      )
      .first()

    if (item && item.isCustom) {
      await ctx.db.patch(item._id, { name: args.name })
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
    requireAuth(userId)

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
