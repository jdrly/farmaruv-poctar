import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Calculator, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'

import { AnimalCountInput, ItemTable, SummaryCard } from '@/components/calculator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCalculator } from '@/hooks/useCalculator'
import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/app/')({
  component: CalculatorPage,
})

function CalculatorPage() {
  const { t } = useTranslation()
  const {
    animalCount,
    expenses,
    incomes,
    isPending,
    error,
    monthlyExpenses,
    yearlyExpenses,
    monthlyIncome,
    yearlyIncome,
    monthlyProfit,
    yearlyProfit,
    monthlyPerAnimal,
    yearlyPerAnimal,
    saveAnimalCount,
    updateExpenseValue,
    updateIncomeValue,
    addCustomExpense,
    addCustomIncome,
    deleteExpense,
    deleteIncome,
    renameExpense,
    renameIncome,
    formatCurrency,
    monthlyExpenseExclusions,
    monthlyIncomeExclusions,
  } = useCalculator()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleAddCustomExpense() {
    try {
      await addCustomExpense(t.calculator.customItemPlaceholder)
      setErrorMessage(null)
    } catch {
      setErrorMessage(t.calculator.errorSaving)
    }
  }

  async function handleAddCustomIncome() {
    try {
      await addCustomIncome(t.calculator.customItemPlaceholder)
      setErrorMessage(null)
    } catch {
      setErrorMessage(t.calculator.errorSaving)
    }
  }

  async function handleDeleteExpense(itemId: string) {
    try {
      await deleteExpense(itemId)
      setErrorMessage(null)
    } catch {
      setErrorMessage(t.calculator.errorDeleting)
    }
  }

  async function handleDeleteIncome(itemId: string) {
    try {
      await deleteIncome(itemId)
      setErrorMessage(null)
    } catch {
      setErrorMessage(t.calculator.errorDeleting)
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
          <Calculator className="h-8 w-8 text-emerald-600" />
          {t.calculator.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{t.calculator.description}</p>
      </div>

      {/* Error Display */}
      {(error || errorMessage) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.common.error}</AlertTitle>
          <AlertDescription>
            {errorMessage ?? error?.message ?? t.calculator.errorInitializing}
          </AlertDescription>
        </Alert>
      )}

      {/* Animal Count */}
      <Card>
        <CardContent className="pt-6">
          <AnimalCountInput
            value={animalCount}
            onChange={saveAnimalCount}
            isLoading={isPending}
          />
        </CardContent>
      </Card>

      {/* Expenses and Income Tables */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-600" />
              {t.calculator.expenses}
            </CardTitle>
            <CardDescription>{t.calculator.expensesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ItemTable
              items={expenses}
              isLoading={isPending}
              readOnlyItemIds={monthlyExpenseExclusions}
              onValueChange={updateExpenseValue}
              onNameChange={renameExpense}
              onDelete={handleDeleteExpense}
              onAddCustom={handleAddCustomExpense}
            />
          </CardContent>
        </Card>

        {/* Income */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              {t.calculator.income}
            </CardTitle>
            <CardDescription>{t.calculator.incomeDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ItemTable
              items={incomes}
              isLoading={isPending}
              readOnlyItemIds={monthlyIncomeExclusions}
              onValueChange={updateIncomeValue}
              onNameChange={renameIncome}
              onDelete={handleDeleteIncome}
              onAddCustom={handleAddCustomIncome}
            />
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <SummaryCard
        monthlyExpenses={monthlyExpenses}
        yearlyExpenses={yearlyExpenses}
        monthlyIncome={monthlyIncome}
        yearlyIncome={yearlyIncome}
        monthlyProfit={monthlyProfit}
        yearlyProfit={yearlyProfit}
        monthlyPerAnimal={monthlyPerAnimal}
        yearlyPerAnimal={yearlyPerAnimal}
        formatCurrency={formatCurrency}
        isLoading={isPending}
      />
    </div>
  )
}
