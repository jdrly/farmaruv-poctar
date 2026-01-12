import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { useEffect } from 'react'
import { Leaf } from 'lucide-react'

import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/')({
    component: HomePage,
})

function HomePage() {
    const { isAuthenticated, isLoading } = useConvexAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                navigate({ to: '/app' })
            } else {
                navigate({ to: '/prihlaseni' })
            }
        }
    }, [isAuthenticated, isLoading, navigate])

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
