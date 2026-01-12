import {
  Link,
  Outlet,
  createFileRoute,
  useMatches,
  useNavigate,
} from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { Leaf } from 'lucide-react'
import { Fragment, useEffect } from 'react'

import { AppSidebar } from '@/components/AppSidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useTranslation } from '@/hooks/useTranslation'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

function AppLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()
  const { t, language } = useTranslation()
  const matches = useMatches()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/prihlaseni' })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Generate breadcrumbs from route matches
  // Get the last (deepest) match to determine current page
  const currentMatch = matches[matches.length - 1]
  const currentPath = currentMatch?.pathname || '/app'

  // Build breadcrumb based on current path
  const breadcrumbItems: Array<{ path: string; label: string }> = []

  // Always start with Calculator as home
  if (currentPath !== '/app' && currentPath !== '/app/') {
    breadcrumbItems.push({
      path: '/app',
      label: t.nav.calculator,
    })
  }

  // Add current page
  let currentLabel: string
  if (currentPath === '/app' || currentPath === '/app/') {
    currentLabel = t.nav.calculator
  } else if (currentPath === '/app/hodnoty-od-chovatelu') {
    currentLabel = t.nav.breederValues
  } else if (currentPath === '/app/zpetna-vazba') {
    currentLabel = t.nav.feedback
  } else {
    const segments = currentPath.split('/').filter(Boolean)
    currentLabel = segments[segments.length - 1] || t.nav.calculator
  }

  breadcrumbItems.push({
    path: currentPath,
    label: currentLabel,
  })

  const breadcrumbs = breadcrumbItems

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sidebar">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <p className="text-muted-foreground">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider
      style={{ '--sidebar-width': '19rem' } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1

                return (
                  <Fragment key={crumb.path}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
