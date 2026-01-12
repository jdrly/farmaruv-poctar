import { useForm } from '@tanstack/react-form'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { CheckCircle2, Loader2, MessageSquare, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { z } from 'zod'

import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/app/zpetna-vazba')({
    component: FeedbackPage,
})

const feedbackSchema = z.object({
    firstName: z.string().min(1, 'Jméno je povinné'),
    lastName: z.string().min(1, 'Příjmení je povinné'),
    email: z.string().email('Neplatný e-mail'),
    message: z.string().min(10, 'Zpráva musí mít alespoň 10 znaků'),
    consent: z.boolean().refine((val) => val === true, {
        message: 'Musíte souhlasit se zpracováním osobních údajů',
    }),
})

function FeedbackPage() {
    const { t, language } = useTranslation()
    const user = useQuery(api.users.currentUser)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const form = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            message: '',
            consent: false,
        },
        validators: {
            onChange: feedbackSchema,
        },
        onSubmit: async ({ value }) => {
            // TODO: Implement actual email sending via TanStack Start server function
            // For now, simulate a successful submission
            console.log('Feedback submitted:', value)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setSubmitSuccess(true)
        },
    })

    // Pre-fill email when user data loads
    useEffect(() => {
        if (user?.email && typeof user.email === 'string') {
            form.setFieldValue('email', user.email)
        }
    }, [user?.email])

    if (submitSuccess) {
        return (
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
                <Card className="max-w-md text-center">
                    <CardContent className="pt-6">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h2 className="mb-2 text-xl font-semibold">{language === 'cs' ? 'Děkujeme!' : 'Thank you!'}</h2>
                        <p className="mb-4 text-muted-foreground">
                            {language === 'cs'
                                ? 'Vaše zpětná vazba byla úspěšně odeslána.'
                                : 'Your feedback has been successfully submitted.'}
                        </p>
                        <Button variant="outline" onClick={() => setSubmitSuccess(false)}>
                            {language === 'cs' ? 'Odeslat další' : 'Submit another'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t.nav.feedback}</h1>
                <p className="mt-2 text-muted-foreground">
                    {language === 'cs' ? 'Pomozte nám vylepšit Farmářův počtář.' : "Help us improve the Farmer's Calculator."}
                </p>
            </div>

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <MessageSquare className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span>{language === 'cs' ? 'Vaše zpětná vazba' : 'Your Feedback'}</span>
                        </CardTitle>
                        <CardDescription>
                            {language === 'cs'
                                ? 'Máte nápad na vylepšení nebo jste narazili na problém? Dejte nám vědět.'
                                : 'Have an idea for improvement or encountered an issue? Let us know.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}
                            className="space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <form.Field name="firstName">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <Label htmlFor={field.name}>{language === 'cs' ? 'Jméno' : 'First name'}</Label>
                                            <Input
                                                id={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder={language === 'cs' ? 'Vaše jméno' : 'Your first name'}
                                            />
                                            {field.state.meta.isTouched && field.state.meta.errors[0] && (
                                                <p className="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
                                            )}
                                        </div>
                                    )}
                                </form.Field>

                                <form.Field name="lastName">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <Label htmlFor={field.name}>{language === 'cs' ? 'Příjmení' : 'Last name'}</Label>
                                            <Input
                                                id={field.name}
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                onBlur={field.handleBlur}
                                                placeholder={language === 'cs' ? 'Vaše příjmení' : 'Your last name'}
                                            />
                                            {field.state.meta.isTouched && field.state.meta.errors[0] && (
                                                <p className="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
                                            )}
                                        </div>
                                    )}
                                </form.Field>
                            </div>

                            <form.Field name="email">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor={field.name}>{language === 'cs' ? 'E-mail' : 'Email'}</Label>
                                        <Input
                                            id={field.name}
                                            type="email"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder={language === 'cs' ? 'vas@email.cz' : 'your@email.com'}
                                        />
                                        {field.state.meta.isTouched && field.state.meta.errors[0] && (
                                            <p className="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="message">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor={field.name}>{language === 'cs' ? 'Zpráva' : 'Message'}</Label>
                                        <Textarea
                                            id={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder={
                                                language === 'cs' ? 'Popište svůj nápad nebo problém...' : 'Describe your idea or issue...'
                                            }
                                            rows={6}
                                            className="resize-none"
                                        />
                                        {field.state.meta.isTouched && field.state.meta.errors[0] && (
                                            <p className="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="consent">
                                {(field) => (
                                    <div className="space-y-2">
                                        <div className="flex items-start space-x-2">
                                            <Checkbox
                                                id={field.name}
                                                checked={field.state.value}
                                                onCheckedChange={(checked) => field.handleChange(checked === true)}
                                                onBlur={field.handleBlur}
                                                className="mt-1"
                                            />
                                            <Label htmlFor={field.name} className="text-sm leading-relaxed">
                                                {language === 'cs' ? (
                                                    <>
                                                        Souhlasím se zpracováním{' '}
                                                        <Link to="/gdpr" className="text-primary underline hover:no-underline">
                                                            osobních údajů
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <>
                                                        I agree to the processing of{' '}
                                                        <Link to="/gdpr" className="text-primary underline hover:no-underline">
                                                            personal data
                                                        </Link>
                                                    </>
                                                )}
                                            </Label>
                                        </div>
                                        {field.state.meta.isTouched && field.state.meta.errors[0] && (
                                            <p className="text-sm text-destructive">{field.state.meta.errors[0]?.message}</p>
                                        )}
                                    </div>
                                )}
                            </form.Field>

                            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                {([canSubmit, isSubmitting]) => (
                                    <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {language === 'cs' ? 'Odesílání...' : 'Sending...'}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                {language === 'cs' ? 'Odeslat zpětnou vazbu' : 'Send feedback'}
                                            </>
                                        )}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
