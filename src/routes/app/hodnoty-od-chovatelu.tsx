import { createFileRoute } from '@tanstack/react-router'
import { Bird, Info, Rabbit } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/app/hodnoty-od-chovatelu')({
  component: BreederValuesPage,
})

interface StatItemProps {
  label: string
  value: string
  note?: string
}

function StatItem({ label, value, note }: StatItemProps) {
  return (
    <div className="space-y-1">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-base font-semibold">{value}</dd>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}

function BreederValuesPage() {
  const { t, language } = useTranslation()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t.nav.breederValues}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {language === 'cs'
            ? 'Průměrné hodnoty získané od chovatelů drůbeže a králíků v ČR.'
            : 'Average values gathered from poultry and rabbit breeders in the Czech Republic.'}
        </p>
      </div>

      {/* Data notice */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
        <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
        <p className="text-sm text-muted-foreground">
          {language === 'cs'
            ? 'Berte v potaz, že získané hodnoty jsou vypočteny na základě odpovědí získaných od 160 chovatelů drůbeže a 66 chovatelů králíků. Zároveň jsou ovlivněny extrémními hodnotami některých z respondentů. Data jsou aktuální k začátku roku 2025.'
            : 'Please note that these values are calculated based on responses from 160 poultry breeders and 66 rabbit breeders. They may also be influenced by extreme values from some respondents. Data is current as of early 2025.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Poultry Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Bird className="h-5 w-5 text-amber-600" />
              </div>
              <span>{language === 'cs' ? 'Drůbež' : 'Poultry'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {language === 'cs' ? 'Náklady' : 'Expenses'}
              </h4>
              <dl className="grid gap-4 sm:grid-cols-2">
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Měsíční náklady na krmení'
                      : 'Monthly feed costs'
                  }
                  value="1 946 Kč"
                  note={
                    language === 'cs'
                      ? 'Nejčastěji 751-1000 Kč'
                      : 'Most common: 751-1000 Kč'
                  }
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Roční náklady na vybavení'
                      : 'Annual equipment costs'
                  }
                  value="2 157 Kč"
                  note={
                    language === 'cs'
                      ? 'Klece, snášková hnízda apod.'
                      : 'Cages, nesting boxes, etc.'
                  }
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Měsíční veterinární péče'
                      : 'Monthly veterinary care'
                  }
                  value="239 Kč"
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Roční pořízení zvířat'
                      : 'Annual animal acquisition'
                  }
                  value="7 034 Kč"
                  note={
                    language === 'cs'
                      ? 'Nejčastěji 3001+ Kč'
                      : 'Most common: 3001+ Kč'
                  }
                />
              </dl>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {language === 'cs' ? 'Příjmy' : 'Income'}
              </h4>
              <dl className="grid gap-4 sm:grid-cols-2">
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Měsíční příjem z masa'
                      : 'Monthly meat income'
                  }
                  value="1 917 Kč"
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Měsíční příjem z vajec'
                      : 'Monthly egg income'
                  }
                  value="1 155 Kč"
                />
                <StatItem
                  label={
                    language === 'cs' ? 'Cena 1 kg masa' : 'Price per 1 kg meat'
                  }
                  value="216 Kč"
                />
                <StatItem
                  label={
                    language === 'cs' ? 'Cena 1 vejce' : 'Price per 1 egg'
                  }
                  value="7,12 Kč"
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Roční prodej živých zvířat'
                      : 'Annual live animal sales'
                  }
                  value="4 556 Kč"
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Roční prodej násadových vajec'
                      : 'Annual hatching egg sales'
                  }
                  value="3 110 Kč"
                  note={
                    language === 'cs'
                      ? '80%+ chovatelů uvádí 0 Kč'
                      : '80%+ breeders report 0 Kč'
                  }
                />
              </dl>
            </div>
          </CardContent>
        </Card>

        {/* Rabbit Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Rabbit className="h-5 w-5 text-emerald-600" />
              </div>
              <span>{language === 'cs' ? 'Králíci' : 'Rabbits'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {language === 'cs' ? 'Náklady' : 'Expenses'}
              </h4>
              <dl className="grid gap-4 sm:grid-cols-2">
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Měsíční náklady na krmení'
                      : 'Monthly feed costs'
                  }
                  value="1 149 Kč"
                  note={
                    language === 'cs'
                      ? 'Nejčastěji 751-1000 Kč'
                      : 'Most common: 751-1000 Kč'
                  }
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Roční náklady na vybavení'
                      : 'Annual equipment costs'
                  }
                  value="2 180 Kč"
                  note={
                    language === 'cs'
                      ? 'Kotce, klece, misky, jesle'
                      : 'Cages, bowls, racks, etc.'
                  }
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Měsíční veterinární péče'
                      : 'Monthly veterinary care'
                  }
                  value="253 Kč"
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Roční pořízení zvířat'
                      : 'Annual animal acquisition'
                  }
                  value="1 581 Kč"
                  note={
                    language === 'cs'
                      ? 'Nejčastěji 3001+ Kč'
                      : 'Most common: 3001+ Kč'
                  }
                />
              </dl>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {language === 'cs' ? 'Příjmy' : 'Income'}
              </h4>
              <dl className="grid gap-4 sm:grid-cols-2">
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Měsíční příjem z masa'
                      : 'Monthly meat income'
                  }
                  value="1 002 Kč"
                />
                <StatItem
                  label={
                    language === 'cs' ? 'Cena 1 kg masa' : 'Price per 1 kg meat'
                  }
                  value="159,24 Kč"
                />
                <StatItem
                  label={
                    language === 'cs'
                      ? 'Roční prodej živých zvířat'
                      : 'Annual live animal sales'
                  }
                  value="3 401 Kč"
                />
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
