import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Query to get the animal count for the current user
export const getAnimalCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return undefined;

    const calculatorData = await ctx.db
      .query("calculatorData")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    return calculatorData?.animalCount;
  },
});

// Query to get all expense items for the current user
export const getExpenses = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const expenses = await ctx.db
      .query("expenseItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    // Sort by order field after fetching
    return expenses.sort((a, b) => a.order - b.order);
  },
});

// Query to get all income items for the current user
export const getIncomes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const incomes = await ctx.db
      .query("incomeItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    // Sort by order field after fetching
    return incomes.sort((a, b) => a.order - b.order);
  },
});

// Mutation to save or update animal count
export const saveAnimalCount = mutation({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingData = await ctx.db
      .query("calculatorData")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existingData) {
      await ctx.db.patch(existingData._id, { animalCount: args.count });
      return existingData._id;
    } else {
      return await ctx.db.insert("calculatorData", {
        userId,
        animalCount: args.count,
      });
    }
  },
});

// Mutation to save or update an expense item
export const saveExpenseItem = mutation({
  args: {
    itemId: v.string(),
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.optional(v.boolean()),
    isCustom: v.optional(v.boolean()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingItem = await ctx.db
      .query("expenseItems")
      .withIndex("by_user_and_id", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .first();
    
    if (existingItem) {
      await ctx.db.patch(existingItem._id, {
        name: args.name,
        value: args.value,
        note: args.note,
        isMonthly: args.isMonthly,
        isCustom: args.isCustom,
        order: args.order,
      });
      return existingItem._id;
    } else {
      return await ctx.db.insert("expenseItems", {
        userId,
        itemId: args.itemId,
        name: args.name,
        value: args.value,
        note: args.note,
        isMonthly: args.isMonthly,
        isCustom: args.isCustom,
        order: args.order,
      });
    }
  },
});

// Mutation to save or update an income item
export const saveIncomeItem = mutation({
  args: {
    itemId: v.string(),
    name: v.string(),
    value: v.optional(v.number()),
    note: v.string(),
    isMonthly: v.optional(v.boolean()),
    isCustom: v.optional(v.boolean()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingItem = await ctx.db
      .query("incomeItems")
      .withIndex("by_user_and_id", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .first();
    
    if (existingItem) {
      await ctx.db.patch(existingItem._id, {
        name: args.name,
        value: args.value,
        note: args.note,
        isMonthly: args.isMonthly,
        isCustom: args.isCustom,
        order: args.order,
      });
      return existingItem._id;
    } else {
      return await ctx.db.insert("incomeItems", {
        userId,
        itemId: args.itemId,
        name: args.name,
        value: args.value,
        note: args.note,
        isMonthly: args.isMonthly,
        isCustom: args.isCustom,
        order: args.order,
      });
    }
  },
});

// Mutation to delete a custom expense item
export const deleteExpenseItem = mutation({
  args: {
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db
      .query("expenseItems")
      .withIndex("by_user_and_id", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .first();
    
    if (item) {
      await ctx.db.delete(item._id);
      return true;
    }
    return false;
  },
});

// Mutation to delete a custom income item
export const deleteIncomeItem = mutation({
  args: {
    itemId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db
      .query("incomeItems")
      .withIndex("by_user_and_id", (q) => 
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .first();
    
    if (item) {
      await ctx.db.delete(item._id);
      return true;
    }
    return false;
  },
});

// Initialize default calculator items for a new user
export const initializeCalculatorForUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // Check if user already has calculator data
    const existingData = await ctx.db
      .query("calculatorData")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    if (existingData) {
      // User already has calculator data
      return false;
    }
    
    // Create calculator data
    await ctx.db.insert("calculatorData", {
      userId,
      animalCount: undefined,
    });
    
    // Initialize default expense items
    const defaultExpenses = [
      { id: 'feed', name: 'Měsíční náklady na krmení', isMonthly: true, order: 0 },
      { id: 'equipment', name: 'Roční náklady na vybavení', order: 1 },
      { id: 'equipment-monthly', name: 'Měsíční náklady na vybavení', isMonthly: true, order: 2 },
      { id: 'vet', name: 'Měsíční náklady na veterinární péči', isMonthly: true, order: 3 },
      { id: 'animals', name: 'Roční náklady na pořízení zvířat', order: 4 },
      { id: 'animals-monthly', name: 'Měsíční náklady na pořízení zvířat', isMonthly: true, order: 5 },
    ];
    
    for (const expense of defaultExpenses) {
      await ctx.db.insert("expenseItems", {
        userId,
        itemId: expense.id,
        name: expense.name,
        value: undefined,
        note: '',
        isMonthly: expense.isMonthly || false,
        isCustom: false,
        order: expense.order,
      });
    }
    
    // Initialize default income items
    const defaultIncomes = [
      { id: 'meat', name: 'Měsíční příjmy z prodeje masa', isMonthly: true, order: 0 },
      { id: 'eggs-consumption', name: 'Měsíční příjmy z prodeje vajec pro spotřebu', isMonthly: true, order: 1 },
      { id: 'eggs-hatching', name: 'Roční příjem z prodeje násadových vajec', order: 2 },
      { id: 'eggs-hatching-monthly', name: 'Měsíční příjem z prodeje násadových vajec', isMonthly: true, order: 3 },
      { id: 'animals-yearly', name: 'Roční příjem z prodeje živých zvířat', order: 4 },
      { id: 'animals-monthly', name: 'Měsíční příjem z prodeje živých zvířat', isMonthly: true, order: 5 },
      { id: 'other-income', name: 'Měsíční příjem z vedlejší živočišné produkce', isMonthly: true, order: 6 },
      { id: 'subsidies', name: 'Měsíční příjem z pobíraných dotací', isMonthly: true, order: 7 },
    ];
    
    for (const income of defaultIncomes) {
      await ctx.db.insert("incomeItems", {
        userId,
        itemId: income.id,
        name: income.name,
        value: undefined,
        note: '',
        isMonthly: income.isMonthly || false,
        isCustom: false,
        order: income.order,
      });
    }
    
    return true;
  },
});