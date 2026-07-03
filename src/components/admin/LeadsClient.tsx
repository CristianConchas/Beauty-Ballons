'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { Lead } from '@/types/lead.types'
import { LEAD_STATUS_LABELS, LEAD_STATUSES, ADMIN_ROUTES } from '@/lib/constants'
import type { LeadStatus } from '@/lib/constants'
import {
  updateLeadStatus,
  markLeadAsRead,
  archiveLead,
  updateLeadNotes,
} from '@/lib/actions/leads'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { formatRelativeDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { NoLeadsState } from '@/components/ui/EmptyState'
import { Archive, MessageSquare } from 'lucide-react'

interface LeadsClientProps {
  leads:         Lead[]
  waNumber:      string
  currentStatus: string
}

const STATUS_TABS = [
  { value: 'all',       label: 'Todos' },
  { value: 'new',       label: 'Nuevos' },
  { value: 'contacted', label: 'Contactados' },
  { value: 'quoted',    label: 'Cotizados' },
  { value: 'closed',    label: 'Cerrados' },
]

export function LeadsClient({ leads, waNumber, currentStatus }: LeadsClientProps) {
  const router            = useRouter()
  const [, startTransition] = useTransition()
  const [selected, setSelected] = useState<Lead | null>(null)
  const [notes, setNotes]       = useState('')
  const [saving, setSaving]     = useState(false)

  function openLead(lead: Lead) {
    setSelected(lead)
    setNotes(lead.admin_notes ?? '')
    if (!lead.is_read) {
      startTransition(async () => {
        await markLeadAsRead(lead.id)
        router.refresh()
      })
    }
  }

  async function handleStatusChange(status: LeadStatus) {
    if (!selected) return
    setSaving(true)
    try {
      await updateLeadStatus(selected.id, status)
      toast.success('Estado actualizado')
      router.refresh()
      setSelected(null)
    } catch {
      toast.error('No se pudo actualizar el estado')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveNotes() {
    if (!selected) return
    setSaving(true)
    try {
      await updateLeadNotes(selected.id, notes)
      toast.success('Notas guardadas')
    } catch {
      toast.error('No se pudieron guardar las notas')
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive() {
    if (!selected) return
    setSaving(true)
    try {
      await archiveLead(selected.id)
      toast.success('Lead archivado')
      setSelected(null)
      router.refresh()
    } catch {
      toast.error('No se pudo archivar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Filtros de status */}
      <div className="sticky top-14 z-20 border-b border-admin-border bg-white">
        <div className="flex overflow-x-auto scroll-hide px-4 py-2 gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => router.push(`${ADMIN_ROUTES.leads}?status=${tab.value}`)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                currentStatus === tab.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-admin-muted hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 py-4 space-y-3">
        {leads.length === 0 ? (
          <NoLeadsState />
        ) : (
          leads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => openLead(lead)}
              className="w-full text-left rounded-2xl border border-admin-border bg-white p-4 shadow-card transition-shadow hover:shadow-card-md"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  {!lead.is_read && (
                    <div className="h-2 w-2 rounded-full bg-brand-primary shrink-0" />
                  )}
                  <p className="font-medium text-admin-text">{lead.name}</p>
                </div>
                <Badge
                  variant={
                    lead.status === 'new'       ? 'warning' :
                    lead.status === 'contacted' ? 'info'    :
                    lead.status === 'quoted'    ? 'primary' :
                    lead.status === 'closed'    ? 'success' :
                    'default'
                  }
                >
                  {LEAD_STATUS_LABELS[lead.status]}
                </Badge>
              </div>

              <p className="text-sm text-admin-muted">
                {[lead.event_type, lead.location].filter(Boolean).join(' · ')}
              </p>

              {lead.message && (
                <p className="mt-1 text-xs text-admin-muted line-clamp-2">
                  {lead.message}
                </p>
              )}

              <p className="mt-2 text-xs text-slate-400">
                {formatRelativeDate(lead.created_at)}
              </p>
            </button>
          ))
        )}
      </div>

      {/* Modal de detalle */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
      >
        {selected && (
          <>
            <Modal.Body>
              <div className="space-y-4">
                {/* Datos */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Tipo de evento', value: selected.event_type },
                    { label: 'Fecha',           value: selected.event_date },
                    { label: 'Zona',            value: selected.location },
                    { label: 'WhatsApp',        value: selected.whatsapp },
                    { label: 'Fuente',          value: selected.source },
                    { label: 'Dispositivo',     value: selected.device_type },
                  ].map(({ label, value }) =>
                    value ? (
                      <div key={label}>
                        <p className="text-xs text-admin-muted">{label}</p>
                        <p className="font-medium text-admin-text">{value}</p>
                      </div>
                    ) : null
                  )}
                </div>

                {selected.message && (
                  <div>
                    <p className="mb-1 text-xs text-admin-muted">Mensaje</p>
                    <p className="rounded-xl bg-slate-50 p-3 text-sm text-admin-text">
                      {selected.message}
                    </p>
                  </div>
                )}

                {/* Cambiar estado */}
                <div>
                  <p className="mb-2 text-xs text-admin-muted">Estado</p>
                  <div className="flex flex-wrap gap-2">
                    {LEAD_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        disabled={saving || selected.status === s}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          selected.status === s
                            ? 'bg-brand-primary text-white'
                            : 'bg-slate-100 text-admin-muted hover:bg-slate-200'
                        }`}
                      >
                        {LEAD_STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                <Textarea
                  label="Notas internas"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Apuntes sobre este prospecto..."
                  maxChars={500}
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="flex-col gap-2">
              <a
                href={buildWhatsAppUrl({
                  number: waNumber,
                  message: `Hola ${selected.name}! 🎈 Vi tu solicitud para ${selected.event_type ?? 'tu evento'}. ¿Tienes disponibilidad para platicar sobre la decoración?`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-wa py-2.5 text-sm font-medium text-white hover:bg-wa-dark transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Responder en WhatsApp
              </a>

              <div className="flex w-full gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={handleSaveNotes}
                  loading={saving}
                >
                  Guardar notas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleArchive}
                  disabled={saving}
                  leftIcon={<Archive className="h-3.5 w-3.5" />}
                >
                  Archivar
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  )
}
