import { useQuery } from '@tanstack/react-query'
import { useMutation } from 'convex/react'
import { convexQuery } from '@convex-dev/react-query'
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { api } from '../../convex/_generated/api'

// Types derived from Convex validators
export interface ExpenseItem {
  _id: string
  _creationTime: number
  userId: string
  itemId: string
  name: string
  value?: number
  note: string
  isMonthly: boolean
  isCustom: boolean
  order: number
}

export interface IncomeItem {
  _id: string
  _creationTime: number
  userId: string
  itemId: string
  name: string
  value?: number
  note: string
  isMonthly: boolean
  isCustom: boolean
  order: number
}

export interface CalculatorData {
  animalCount: number | null
  expenses: Array<ExpenseItem>
  incomes: Array<IncomeItem>
  isInitialized: boolean
}

// Monthly calculation exclusions (these are auto-calculated from yearly values)
const MONTHLY_EXPENSE_EXCLUSIONS = ['equipment-monthly', 'animals-monthly']
const MONTHLY_INCOME_EXCLUSIONS = ['eggs-hatching-monthly', 'animals-monthly']

// Yearly to monthly mappings for auto-calculation
const YEARLY_TO_MONTHLY_EXPENSE_MAP: Record<string, string> = {
  equipment: 'equipment-monthly',
  animals: 'animals-monthly',
}
const YEARLY_TO_MONTHLY_INCOME_MAP: Record<string, string> = {
  'eggs-hatching': 'eggs-hatching-monthly',
  'animals-yearly': 'animals-monthly',
}

export function useCalculator() {
  // Reactive query for all calculator data
  const {
    data: calculatorData,
    isPending,
    error,
  } = useQuery({
    ...convexQuery(api.calculator.getCalculatorData, {}),
    gcTime: 10000, // Unsubscribe after 10s of no observers
  })

  // Mutations
  const saveAnimalCountMutation = useMutation(api.calculator.saveAnimalCount)
  const updateExpenseValueMutation = useMutation(api.calculator.updateExpenseValue)
  const updateIncomeValueMutation = useMutation(api.calculator.updateIncomeValue)
  const updateExpenseNoteMutation = useMutation(api.calculator.updateExpenseNote)
  const updateIncomeNoteMutation = useMutation(api.calculator.updateIncomeNote)
  const addCustomExpenseMutation = useMutation(api.calculator.addCustomExpense)
  const addCustomIncomeMutation = useMutation(api.calculator.addCustomIncome)
  const deleteExpenseItemMutation = useMutation(api.calculator.deleteExpenseItem)
  const deleteIncomeItemMutation = useMutation(api.calculator.deleteIncomeItem)
  const renameExpenseItemMutation = useMutation(api.calculator.renameExpenseItem)
  const renameIncomeItemMutation = useMutation(api.calculator.renameIncomeItem)
  const initializeCalculatorMutation = useMutation(api.calculator.initializeCalculatorForUser)

  // Debounce timers
  const saveTimersRef = useRef<Record<string, NodeJS.Timeout>>({})

  // Cleanup timers on unmount
  useEffect(() => {
    const timersToCleanup = saveTimersRef.current
    return () => {
      Object.values(timersToCleanup).forEach(clearTimeout)
    }
  }, [])

  // Debounce helper
  const debounceSave = useCallback(
    (key: string, saveFunction: () => Promise<void>, delay: number = 500) => {
      if (saveTimersRef.current[key]) {
        clearTimeout(saveTimersRef.current[key])
      }

      saveTimersRef.current[key] = setTimeout(async () => {
        try {
          await saveFunction()
        } catch (err) {
          console.error(`Failed to save ${key}:`, err)
        } finally {
          delete saveTimersRef.current[key]
        }
      }, delay)
    },
    []
  )

  // Initialize calculator for new users
  useEffect(() => {
    if (
      !isPending &&
      calculatorData &&
      !calculatorData.isInitialized &&
      calculatorData.expenses.length === 0 &&
      calculatorData.incomes.length === 0
    ) {
      initializeCalculatorMutation().catch((err) => {
        console.error('Failed to initialize calculator:', err)
      })
    }
  }, [isPending, calculatorData, initializeCalculatorMutation])

  // Calculate monthly expenses (excluding auto-calculated monthly items)
  const monthlyExpenses = useMemo(() => {
    if (!calculatorData?.expenses) return 0
    return calculatorData.expenses
      .filter((expense) => expense.value != null)
      .reduce((total, expense) => {
        if (MONTHLY_EXPENSE_EXCLUSIONS.includes(expense.itemId)) {
          return total
        }
        if (expense.isMonthly || expense.isCustom) {
          return total + (expense.value ?? 0)
        } else {
          return total + (expense.value ?? 0) / 12
        }
      }, 0)
  }, [calculatorData?.expenses])

  // Calculate monthly income (excluding auto-calculated monthly items)
  const monthlyIncome = useMemo(() => {
    if (!calculatorData?.incomes) return 0
    return calculatorData.incomes
      .filter((income) => income.value != null)
      .reduce((total, income) => {
        if (MONTHLY_INCOME_EXCLUSIONS.includes(income.itemId)) {
          return total
        }
        if (income.isMonthly || income.isCustom) {
          return total + (income.value ?? 0)
        } else {
          return total + (income.value ?? 0) / 12
        }
      }, 0)
  }, [calculatorData?.incomes])

  // Derived calculations
  const yearlyExpenses = monthlyExpenses * 12
  const yearlyIncome = monthlyIncome * 12
  const monthlyProfit = monthlyIncome - monthlyExpenses
  const yearlyProfit = yearlyIncome - yearlyExpenses

  const animalCount = calculatorData?.animalCount ?? null
  const monthlyPerAnimal = animalCount && animalCount > 0 ? monthlyExpenses / animalCount : null
  const yearlyPerAnimal = animalCount && animalCount > 0 ? yearlyExpenses / animalCount : null

  // Actions
  const saveAnimalCount = useCallback(
    (count: number | null) => {
      debounceSave('animal-count', async () => {
        await saveAnimalCountMutation({ count: count ?? undefined })
      })
    },
    [debounceSave, saveAnimalCountMutation]
  )

  const updateExpenseValue = useCallback(
    (itemId: string, value: number | null) => {
      debounceSave(`expense-value-${itemId}`, async () => {
        await updateExpenseValueMutation({ itemId, value: value ?? undefined })

        // If this is a yearly item, also update its monthly counterpart
        const monthlyId = YEARLY_TO_MONTHLY_EXPENSE_MAP[itemId]
        if (monthlyId) {
          const monthlyValue = value != null ? value / 12 : undefined
          await updateExpenseValueMutation({ itemId: monthlyId, value: monthlyValue })
        }
      })
    },
    [debounceSave, updateExpenseValueMutation]
  )

  const updateIncomeValue = useCallback(
    (itemId: string, value: number | null) => {
      debounceSave(`income-value-${itemId}`, async () => {
        await updateIncomeValueMutation({ itemId, value: value ?? undefined })

        // If this is a yearly item, also update its monthly counterpart
        const monthlyId = YEARLY_TO_MONTHLY_INCOME_MAP[itemId]
        if (monthlyId) {
          const monthlyValue = value != null ? value / 12 : undefined
          await updateIncomeValueMutation({ itemId: monthlyId, value: monthlyValue })
        }
      })
    },
    [debounceSave, updateIncomeValueMutation]
  )

  const updateExpenseNote = useCallback(
    (itemId: string, note: string) => {
      debounceSave(`expense-note-${itemId}`, async () => {
        await updateExpenseNoteMutation({ itemId, note })
      })
    },
    [debounceSave, updateExpenseNoteMutation]
  )

  const updateIncomeNote = useCallback(
    (itemId: string, note: string) => {
      debounceSave(`income-note-${itemId}`, async () => {
        await updateIncomeNoteMutation({ itemId, note })
      })
    },
    [debounceSave, updateIncomeNoteMutation]
  )

  const addCustomExpense = useCallback(
    async (name: string) => {
      await addCustomExpenseMutation({ name })
    },
    [addCustomExpenseMutation]
  )

  const addCustomIncome = useCallback(
    async (name: string) => {
      await addCustomIncomeMutation({ name })
    },
    [addCustomIncomeMutation]
  )

  const deleteExpense = useCallback(
    async (itemId: string) => {
      await deleteExpenseItemMutation({ itemId })
    },
    [deleteExpenseItemMutation]
  )

  const deleteIncome = useCallback(
    async (itemId: string) => {
      await deleteIncomeItemMutation({ itemId })
    },
    [deleteIncomeItemMutation]
  )

  const renameExpense = useCallback(
    (itemId: string, name: string) => {
      debounceSave(`expense-name-${itemId}`, async () => {
        await renameExpenseItemMutation({ itemId, name })
      })
    },
    [debounceSave, renameExpenseItemMutation]
  )

  const renameIncome = useCallback(
    (itemId: string, name: string) => {
      debounceSave(`income-name-${itemId}`, async () => {
        await renameIncomeItemMutation({ itemId, name })
      })
    },
    [debounceSave, renameIncomeItemMutation]
  )

  // Format currency helper
  const formatCurrency = useCallback((value: number) => {
    return (
      value.toLocaleString('cs-CZ', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' Kč'
    )
  }, [])

  return {
    // Data
    animalCount,
    expenses: calculatorData?.expenses ?? [],
    incomes: calculatorData?.incomes ?? [],
    isInitialized: calculatorData?.isInitialized ?? false,

    // Loading state
    isPending,
    error,

    // Calculated values
    monthlyExpenses,
    yearlyExpenses,
    monthlyIncome,
    yearlyIncome,
    monthlyProfit,
    yearlyProfit,
    monthlyPerAnimal,
    yearlyPerAnimal,

    // Actions
    saveAnimalCount,
    updateExpenseValue,
    updateIncomeValue,
    updateExpenseNote,
    updateIncomeNote,
    addCustomExpense,
    addCustomIncome,
    deleteExpense,
    deleteIncome,
    renameExpense,
    renameIncome,

    // Helpers
    formatCurrency,

    // Constants for UI
    monthlyExpenseExclusions: MONTHLY_EXPENSE_EXCLUSIONS,
    monthlyIncomeExclusions: MONTHLY_INCOME_EXCLUSIONS,
  }
}
