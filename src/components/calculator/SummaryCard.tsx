import { TrendingDown, TrendingUp, DollarSign, PiggyBank } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'

interface SummaryCardProps {
  monthlyExpenses: number
  yearlyExpenses: number
  monthlyIncome: number
  yearlyIncome: number
  monthlyProfit: number
  yearlyProfit: number
  monthlyPerAnimal: number | null
  yearlyPerAnimal: number | null
  formatCurrency: (value: number) => string
  isLoading?: boolean
}

export function SummaryCard({
  monthlyExpenses,
  yearlyExpenses,
  monthlyIncome,
  yearlyIncome,
  monthlyProfit,
  yearlyProfit,
  monthlyPerAnimal,
  yearlyPerAnimal,
  formatCurrency,
  isLoading = false,
}: SummaryCardProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Card className="border-0 bg-muted/30">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          {t.calculator.summary}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Expenses & Income Row */}
        <div className="grid grid-cols-2 gap-4">
          <SummaryItem
            title={t.calculator.totalMonthlyExpenses}
            value={formatCurrency(monthlyExpenses)}
            variant="expense"
            icon={<TrendingDown className="h-4 w-4" />}
          />
          <SummaryItem
            title={t.calculator.totalYearlyExpenses}
            value={formatCurrency(yearlyExpenses)}
            variant="expense"
            icon={<TrendingDown className="h-4 w-4" />}
          />
          <SummaryItem
            title={t.calculator.totalMonthlyIncome}
            value={formatCurrency(monthlyIncome)}
            variant="income"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <SummaryItem
            title={t.calculator.totalYearlyIncome}
            value={formatCurrency(yearlyIncome)}
            variant="income"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Per Animal Row */}
        <div className="grid grid-cols-2 gap-4">
          <SummaryItem
            title={t.calculator.monthlyPerAnimal}
            value={monthlyPerAnimal !== null ? formatCurrency(monthlyPerAnimal) : t.calculator.noAnimalCount}
            variant="neutral"
            icon={<PiggyBank className="h-4 w-4" />}
          />
          <SummaryItem
            title={t.calculator.yearlyPerAnimal}
            value={yearlyPerAnimal !== null ? formatCurrency(yearlyPerAnimal) : t.calculator.noAnimalCount}
            variant="neutral"
            icon={<PiggyBank className="h-4 w-4" />}
          />
        </div>

        {/* Balance Row */}
        <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <h3 className="mb-4 font-semibold">{t.calculator.overallStatus}</h3>
          <div className="grid grid-cols-2 gap-4">
            <BalanceItem
              title={t.calculator.monthlyBalance}
              value={monthlyProfit}
              formatCurrency={formatCurrency}
            />
            <BalanceItem
              title={t.calculator.yearlyBalance}
              value={yearlyProfit}
              formatCurrency={formatCurrency}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SummaryItemProps {
  title: string
  value: string
  variant: 'expense' | 'income' | 'neutral'
  icon: React.ReactNode
}

function SummaryItem({ title, value, variant, icon }: SummaryItemProps) {
  const bgClass = {
    expense: 'bg-amber-100/50 dark:bg-amber-900/20',
    income: 'bg-emerald-100/50 dark:bg-emerald-900/20',
    neutral: 'bg-violet-100/50 dark:bg-violet-900/20',
  }[variant]

  const iconClass = {
    expense: 'text-amber-600 dark:text-amber-400',
    income: 'text-emerald-600 dark:text-emerald-400',
    neutral: 'text-violet-600 dark:text-violet-400',
  }[variant]

  return (
    <div className={cn('rounded-lg p-4', bgClass)}>
      <div className="mb-1 flex items-center gap-2">
        <span className={iconClass}>{icon}</span>
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

interface BalanceItemProps {
  title: string
  value: number
  formatCurrency: (value: number) => string
}

function BalanceItem({ title, value, formatCurrency }: BalanceItemProps) {
  const isPositive = value >= 0

  return (
    <div>
      <h4 className="mb-1 text-sm font-medium text-muted-foreground">{title}</h4>
      <p
        className={cn(
          'text-xl font-bold',
          isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
        )}
      >
        {formatCurrency(value)}
      </p>
    </div>
  )
}
