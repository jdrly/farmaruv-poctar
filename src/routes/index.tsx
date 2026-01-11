import { createFileRoute, redirect } from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Leaf, Calculator, TrendingUp, PiggyBank } from 'lucide-react'

import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/prihlaseni' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <p className="text-emerald-400">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const features = [
    {
      icon: <Calculator className="h-10 w-10 text-emerald-400" />,
      title: 'Přehled nákladů',
      description:
        'Sledujte všechny náklady na chov - krmivo, veterinární péči, vybavení a další.',
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-emerald-400" />,
      title: 'Příjmy a zisky',
      description:
        'Evidujte příjmy z prodeje masa, vajec, živých zvířat a dotací.',
    },
    {
      icon: <PiggyBank className="h-10 w-10 text-emerald-400" />,
      title: 'Náklady na zvíře',
      description:
        'Zjistěte přesné náklady na jedno zvíře pro lepší plánování.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950">
      {/* Hero section */}
      <section className="relative overflow-hidden px-6 py-20 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
              {t.common.appName}
            </h1>
          </div>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70">
            Finanční kalkulačka pro drobné chovatele králíků a drůbeže.
            Sledujte náklady, příjmy a zjistěte skutečný zisk z vašeho chovu.
          </p>

          <button
            onClick={() => navigate({ to: '/' })}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/40"
          >
            {t.nav.calculator}
          </button>
        </div>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-emerald-500/30 hover:bg-white/10"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
