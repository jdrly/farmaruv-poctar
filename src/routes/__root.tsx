import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Home, Leaf } from 'lucide-react'

import ConvexProvider from '../integrations/convex/provider'
import { useTranslation } from '../hooks/useTranslation'

import StoreDevtools from '../lib/demo-store-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
    queryClient: QueryClient
}

function NotFound() {
    const { t } = useTranslation()

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 p-4 text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                <Leaf className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 text-6xl font-bold text-white">{t.notFound.title}</h1>
            <p className="mb-8 text-xl text-white/60">{t.notFound.message}</p>
            <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/40"
            >
                <Home className="h-5 w-5" />
                {t.notFound.backToHome}
            </Link>
        </div>
    )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    notFoundComponent: NotFound,
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'Farmářův počtář',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com',
            },
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossOrigin: 'anonymous',
            },
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
            },
        ],
    }),

    shellComponent: RootDocument,
})

function RootDocument() {
    return (
        <html lang="cs">
            <head>
                <HeadContent />
            </head>
            <body className="font-sans antialiased">
                <ConvexProvider>
                    <Outlet />
                    {import.meta.env.DEV && (
                        <TanStackDevtools
                            config={{
                                position: 'bottom-right',
                            }}
                            plugins={[
                                {
                                    name: 'Tanstack Router',
                                    render: <TanStackRouterDevtoolsPanel />,
                                },
                                StoreDevtools,
                                TanStackQueryDevtools,
                            ]}
                        />
                    )}
                </ConvexProvider>
                <Scripts />
            </body>
        </html>
    )
}
