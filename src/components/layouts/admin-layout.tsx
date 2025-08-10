import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

interface AdminLayoutProps { children: ReactNode }

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const crumbs = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean)
    const adminIndex = parts.indexOf('admin')
    const trail = adminIndex >= 0 ? parts.slice(adminIndex) : parts
    const segments = trail.map((seg, i) => ({
      label: seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      path: '/' + trail.slice(0, i + 1).join('/'),
      isLast: i === trail.length - 1,
    }))
    if (segments.length === 0) {
      return [{ label: 'Admin', path: '/admin', isLast: true }]
    }
    return segments
  }, [location.pathname])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((c, idx) => (
                  <>
                    <BreadcrumbItem key={`item-${idx}`} className={idx === 0 ? 'hidden md:block' : undefined}>
                      {c.isLast ? (
                        <BreadcrumbPage>{c.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={c.path}>{c.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {idx < crumbs.length - 1 && (
                      <BreadcrumbSeparator key={`sep-${idx}`} className={idx === 0 ? 'hidden md:block' : undefined} />
                    )}
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
