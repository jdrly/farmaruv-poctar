import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { useEffect, useState } from 'react'
import { Globe, Leaf } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/prihlaseni')({
  component: LoginPage,
})

function LoginPage() {
  const { t, language, toggleLanguage } = useTranslation()
  const { signIn } = useAuthActions()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()

  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, isLoading, navigate])

  function getErrorMessage(err: unknown): string {
    const message = err instanceof Error ? err.message.toLowerCase() : ''

    if (
      message.includes('invalid') ||
      message.includes('credentials') ||
      message.includes('password') ||
      message.includes('user')
    ) {
      return t.auth.errorInvalidCredentials
    }
    if (
      message.includes('already') ||
      message.includes('exists') ||
      message.includes('in use')
    ) {
      return t.auth.errorEmailInUse
    }
    if (
      message.includes('weak') ||
      message.includes('short') ||
      message.includes('8')
    ) {
      return t.auth.errorWeakPassword
    }
    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('connection')
    ) {
      return t.auth.errorNetworkError
    }

    return t.auth.errorGeneric
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    try {
      await signIn('password', formData)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/5 blur-2xl" />
      </div>

      {/* Language toggle */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Toggle language"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{language}</span>
      </button>

      <Card className="relative z-10 w-full max-w-4xl overflow-hidden border-0 bg-white/5 p-0 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form section */}
          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {t.auth.title}
                </h1>
                <p className="mt-2 text-white/60">
                  {flow === 'signIn'
                    ? t.auth.signInDescription
                    : t.auth.signUpDescription}
                </p>
              </div>

              {/* Email field */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white/80">
                  {t.auth.email}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  required
                  autoComplete="email"
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                />
              </div>

              {/* Password field */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white/80">
                    {t.auth.password}
                  </Label>
                  {flow === 'signIn' && (
                    <button
                      type="button"
                      className="ml-auto text-sm text-emerald-400 underline-offset-2 transition-colors hover:text-emerald-300 hover:underline"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete={
                    flow === 'signIn' ? 'current-password' : 'new-password'
                  }
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                />
              </div>

              {/* Hidden flow field */}
              <input name="flow" type="hidden" value={flow} />

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/40 disabled:opacity-50"
              >
                {isSubmitting
                  ? flow === 'signIn'
                    ? t.auth.signingIn
                    : t.auth.signingUp
                  : flow === 'signIn'
                    ? t.auth.signInButton
                    : t.auth.signUpButton}
              </Button>

              {/* Toggle flow */}
              <div className="text-center text-sm text-white/60">
                {flow === 'signIn' ? t.auth.noAccount : t.auth.hasAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setFlow(flow === 'signIn' ? 'signUp' : 'signIn')
                    setError(null)
                  }}
                  className="text-emerald-400 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline"
                >
                  {flow === 'signIn' ? t.auth.signUpLink : t.auth.signInLink}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 backdrop-blur-sm">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </div>
          </form>

          {/* Image section */}
          <div className="relative hidden overflow-hidden md:block">
            <img
              src="/login_bg_fp.webp"
              alt={t.auth.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-8">
              <p className="text-sm text-white/70">
                {t.auth.termsAgreement}{' '}
                <a
                  href="/gdpr"
                  className="text-emerald-400 underline-offset-2 hover:underline"
                >
                  {t.auth.termsOfService}
                </a>{' '}
                {t.auth.and}{' '}
                <a
                  href="/gdpr"
                  className="text-emerald-400 underline-offset-2 hover:underline"
                >
                  {t.auth.privacyPolicy}
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
