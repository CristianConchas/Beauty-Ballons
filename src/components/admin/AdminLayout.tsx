'use client'

import type { ReactNode } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  Images,
  PenSquare,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ADMIN_ROUTES } from '@/lib/constants'
import { useAdminUser } from '@/hooks/useAdminUser'

const NAV_ITEMS = [
  { href: ADMIN_ROUTES.dashboard, icon: LayoutDashboard, label: 'Inicio'     },
  { href: ADMIN_ROUTES.leads,     icon: Inbox,           label: 'Leads'      },
  { href: ADMIN_ROUTES.portfolio, icon: Images,          label: 'Portafolio' },
  { href: ADMIN_ROUTES.content,   icon: PenSquare,       label: 'Contenido'  },
  { href: ADMIN_ROUTES.settings,  icon: Settings,        label: 'Ajustes'    },
] as const

interface AdminLayoutProps {
  children:    ReactNode
  title?:      string
  backHref?:   string
  headerRight?: ReactNode
}

export function AdminLayout({
  children,
  title,
  headerRight,
}: AdminLayoutProps) {
  const pathname    = usePathname()
  useAdminUser() // mantener para future-proofing

  return (
    <div className="flex min-h-screen flex-col bg-admin-bg">
      {/* Header móvil */}
      {title && (
        <header className="sticky top-0 z-30 border-b border-admin-border bg-white/80 backdrop-blur-sm">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="font-heading text-lg font-semibold text-admin-text">
              {title}
            </h1>
            {headerRight && (
              <div className="flex items-center gap-2">
                {headerRight}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Contenido */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* Tab bar inferior — mobile first */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-admin-border bg-white tab-bar-safe"
        aria-label="Navegación principal"
      >
        <div className="flex">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href ||
              (href !== ADMIN_ROUTES.dashboard && pathname.startsWith(href))

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary',
                  isActive
                    ? 'text-brand-primary'
                    : 'text-admin-muted hover:text-admin-text'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={cn('h-5 w-5', isActive && 'scale-110 transition-transform')} />
                <span>{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
