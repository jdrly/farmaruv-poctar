import { createFileRoute } from '@tanstack/react-router'
import { FileText, Info } from 'lucide-react'

import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/app/hodnoty-od-chovatelu')({
  component: BreederValuesPage,
})

function BreederValuesPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.nav.breederValues}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Typické hodnoty nákladů a příjmů od zkušených chovatelů.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Info className="h-5 w-5 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold">Informace od chovatelů</h2>
        </div>

        <div className="space-y-4 text-muted-foreground">
          <p>
            Tato stránka obsahuje typické hodnoty nákladů a příjmů nasbírané od
            zkušených chovatelů králíků a drůbeže v České republice.
          </p>
          <p>
            Hodnoty slouží jako orientační vodítko pro nastavení vaší kalkulačky
            a mohou se lišit podle regionu, velikosti chovu a způsobu hospodaření.
          </p>
        </div>

        {/* Placeholder for actual breeder values content */}
        <div className="mt-6 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 p-6 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Detailní hodnoty budou doplněny v další fázi vývoje.
          </p>
        </div>
      </div>
    </div>
  )
}
