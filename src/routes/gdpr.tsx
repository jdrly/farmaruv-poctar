import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/gdpr')({
    component: GdprPage,
})

function GdprPage() {
    const { t, language } = useTranslation()

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl px-6 py-12">
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4 -ml-2">
                        <Link to="/prihlaseni">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {language === 'cs' ? 'Zpět' : 'Back'}
                        </Link>
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                            <Shield className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">{t.nav.gdpr}</h1>
                    </div>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {language === 'cs' ? (
                        <>
                            <h2>Zásady ochrany osobních údajů</h2>
                            <p>
                                Vaše soukromí je pro nás důležité. Tato stránka vysvětluje, jak zpracováváme vaše osobní údaje v aplikaci
                                Farmářův počtář.
                            </p>

                            <h3>Jaké údaje shromažďujeme</h3>
                            <ul>
                                <li>
                                    <strong>Registrační údaje:</strong> E-mailová adresa pro přihlášení do aplikace
                                </li>
                                <li>
                                    <strong>Data kalkulačky:</strong> Vámi zadané hodnoty nákladů, příjmů a počtu zvířat
                                </li>
                            </ul>

                            <h3>Jak údaje používáme</h3>
                            <p>Vaše údaje používáme výhradně pro fungování aplikace Farmářův počtář:</p>
                            <ul>
                                <li>Autentizace a správa vašeho účtu</li>
                                <li>Ukládání vašich dat kalkulačky pro budoucí přístup</li>
                            </ul>

                            <h3>Sdílení údajů</h3>
                            <p>Vaše osobní údaje nesdílíme s třetími stranami. Data jsou uložena na zabezpečených serverech Convex.</p>

                            <h3>Vaše práva</h3>
                            <p>Máte právo:</p>
                            <ul>
                                <li>Požádat o přístup k vašim údajům</li>
                                <li>Požádat o opravu nepřesných údajů</li>
                                <li>Požádat o smazání vašeho účtu a všech souvisejících dat</li>
                            </ul>

                            <h3>Kontakt</h3>
                            <p>Pro dotazy ohledně ochrany osobních údajů nás kontaktujte pomocí formuláře zpětné vazby v aplikaci.</p>
                        </>
                    ) : (
                        <>
                            <h2>Privacy Policy</h2>
                            <p>
                                Your privacy is important to us. This page explains how we process your personal data in the Farmer's
                                Calculator application.
                            </p>

                            <h3>What data we collect</h3>
                            <ul>
                                <li>
                                    <strong>Registration data:</strong> Email address for application login
                                </li>
                                <li>
                                    <strong>Calculator data:</strong> Your entered expense, income, and animal count values
                                </li>
                            </ul>

                            <h3>How we use data</h3>
                            <p>We use your data exclusively for the Farmer's Calculator application:</p>
                            <ul>
                                <li>Authentication and account management</li>
                                <li>Saving your calculator data for future access</li>
                            </ul>

                            <h3>Data sharing</h3>
                            <p>We do not share your personal data with third parties. Data is stored on secure Convex servers.</p>

                            <h3>Your rights</h3>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Request access to your data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your account and all related data</li>
                            </ul>

                            <h3>Contact</h3>
                            <p>For privacy-related questions, contact us using the feedback form in the application.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
