import { createFileRoute } from '@tanstack/react-router'
import { Calculator, TrendingUp, PiggyBank } from 'lucide-react'

import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/app/')({
  component: CalculatorPage,
})

function CalculatorPage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Calculator className="h-10 w-10 text-emerald-500" />,
      title: 'Přehled nákladů',
      description:
        'Sledujte všechny náklady na chov - krmivo, veterinární péči, vybavení a další.',
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-emerald-500" />,
      title: 'Příjmy a zisky',
      description:
        'Evidujte příjmy z prodeje masa, vajec, živých zvířat a dotací.',
    },
    {
      icon: <PiggyBank className="h-10 w-10 text-emerald-500" />,
      title: 'Náklady na zvíře',
      description:
        'Zjistěte přesné náklady na jedno zvíře pro lepší plánování.',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t.nav.calculator}</h1>
        <p className="mt-2 text-muted-foreground">
          Finanční kalkulačka pro drobné chovatele králíků a drůbeže.
        </p>
      </div>

      {/* Placeholder content - will be replaced with actual calculator in Phase 5 */}
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-muted-foreground/25 bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">
          Kalkulačka bude implementována v další fázi vývoje.
        </p>
      </div>
    </div>
  )
}
