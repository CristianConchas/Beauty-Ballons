import { requireAdminUser } from '@/lib/auth'
import { getDashboardStats, getLeads } from '@/lib/queries/leads'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { getSiteConfig } from '@/lib/queries/site-config'
import { formatRelativeDate } from '@/lib/utils'
import { LEAD_STATUS_LABELS, ADMIN_ROUTES } from '@/lib/constants'
import Link from 'next/link'
import {
  Inbox, Images, Scissors, Globe, ArrowRight
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [user, stats, recentLeads, config] = await Promise.all([
    requireAdminUser(),
    getDashboardStats(),
    getLeads({ limit: 3 }),
    getSiteConfig(),
  ])

  const waNumber = config?.whatsapp_number ?? ''

  return (
    <AdminLayout title="Inicio">
      <div className="px-4 py-5 space-y-5">
        {/* Saludo */}
        <div>
          <p className="text-sm text-admin-muted">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h2 className="font-heading text-xl font-bold text-admin-text">
            Bienvenido, {user.role === 'owner' ? 'propietario' : 'editor'} 👋
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card padding="sm" className="text-center">
            <p className="font-heading text-2xl font-bold text-brand-primary">
              {stats.newLeads}
            </p>
            <p className="mt-0.5 text-xs text-admin-muted">Leads nuevos</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="font-heading text-2xl font-bold text-brand-secondary">
              {stats.totalPhotos}
            </p>
            <p className="mt-0.5 text-xs text-admin-muted">Fotos</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="font-heading text-2xl font-bold text-admin-text">
              {stats.totalServices}
            </p>
            <p className="mt-0.5 text-xs text-admin-muted">Servicios</p>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <div>
          <p className="mb-3 text-sm font-medium text-admin-muted">Acciones rápidas</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href={ADMIN_ROUTES.leads}>
              <Card padding="md" hover className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-2">
                  <Inbox className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">Leads</p>
                  {stats.newLeads > 0 && (
                    <Badge variant="warning" dot>{stats.newLeads} nuevos</Badge>
                  )}
                </div>
              </Card>
            </Link>
            <Link href={ADMIN_ROUTES.portfolio}>
              <Card padding="md" hover className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-2">
                  <Images className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">Portafolio</p>
                  <p className="text-xs text-admin-muted">Subir fotos</p>
                </div>
              </Card>
            </Link>
            <Link href={ADMIN_ROUTES.content}>
              <Card padding="md" hover className="flex items-center gap-3">
                <div className="rounded-xl bg-pink-50 p-2">
                  <Scissors className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">Contenido</p>
                  <p className="text-xs text-admin-muted">Editar sitio</p>
                </div>
              </Card>
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Card padding="md" hover className="flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-2">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text">Ver sitio</p>
                  <p className="text-xs text-admin-muted">Abre en nueva pestaña</p>
                </div>
              </Card>
            </a>
          </div>
        </div>

        {/* Leads recientes */}
        {recentLeads.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-admin-muted">Leads recientes</p>
              <Link
                href={ADMIN_ROUTES.leads}
                className="flex items-center gap-1 text-xs text-brand-primary"
              >
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {recentLeads.map((lead) => (
                <Card key={lead.id} padding="md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-admin-text">
                        {lead.name}
                      </p>
                      <p className="text-xs text-admin-muted">
                        {lead.event_type ?? 'Sin tipo'} · {formatRelativeDate(lead.created_at)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        lead.status === 'new' ? 'warning' :
                        lead.status === 'closed' ? 'success' :
                        'default'
                      }
                    >
                      {LEAD_STATUS_LABELS[lead.status]}
                    </Badge>
                  </div>
                  {waNumber && (
                    <a
                      href={buildWhatsAppUrl({
                        number: waNumber,
                        message: `Hola ${lead.name}, vi tu solicitud de decoración para ${lead.event_type ?? 'tu evento'}. ¿Tienes un momento para platicar?`,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-wa/10 py-2 text-xs font-medium text-wa hover:bg-wa/20 transition-colors"
                    >
                      💬 Responder por WhatsApp
                    </a>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
