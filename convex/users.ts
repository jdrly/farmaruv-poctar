import { v } from 'convex/values'
import { query } from './_generated/server'
import { auth } from './auth'

export const currentUser = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      phone: v.optional(v.string()),
      phoneVerificationTime: v.optional(v.number()),
      image: v.optional(v.string()),
      isAnonymous: v.optional(v.boolean()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    if (!userId) return null
    return await ctx.db.get(userId)
  },
})

export const isAuthenticated = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx)
    return userId !== null
  },
})
