import { createFileRoute } from '@tanstack/react-router'
import { MessageSquare, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/app/zpetna-vazba')({
  component: FeedbackPage,
})

function FeedbackPage() {
  const { t } = useTranslation()

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t.nav.feedback}</h1>
        <p className="mt-2 text-muted-foreground">
          Pomozte nám vylepšit Farmářův počtář.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Vaše zpětná vazba</h2>
              <p className="text-sm text-muted-foreground">
                Máte nápad na vylepšení nebo jste narazili na problém?
              </p>
            </div>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Zpráva</Label>
              <Textarea
                id="message"
                placeholder="Popište svůj nápad nebo problém..."
                rows={6}
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full" disabled>
              <Send className="mr-2 h-4 w-4" />
              Odeslat zpětnou vazbu
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Odesílání zpětné vazby bude implementováno v další fázi.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
