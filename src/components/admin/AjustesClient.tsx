'use client'

import type { ReactNode } from 'react'
import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronDown, ExternalLink, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SiteConfig, SeoConfig } from '@/types/site.types'
import { updateSiteConfig, updateSeoConfig } from '@/lib/actions/content'
import { logoutAction } from '@/lib/actions/auth'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { ColorPicker } from '@/components/ui/ColorPicker'

function Section({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-admin-border">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-medium text-admin-text">{title}</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-admin-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="px-4 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

interface Props { config: SiteConfig | null; seo: SeoConfig | null }

export function AjustesClient({ config, seo }: Props) {
  const router     = useRouter()
  const [, startT] = useTransition()
  const refresh    = () => startT(() => router.refresh())

  // ── Config general ────────────────────────────────────────
  const [siteName, setSiteName]   = useState(config?.site_name ?? '')
  const [waNumber, setWaNumber]   = useState(config?.whatsapp_number ?? '')
  const [waMsg, setWaMsg]         = useState(config?.whatsapp_default_msg ?? '')
  const [coverageZone, setCoverage] = useState(config?.coverage_zone ?? '')
  const [responseTime, setResponse] = useState(config?.response_time ?? '')
  const [maintenance, setMaintenance] = useState(config?.maintenance_mode ?? false)

  async function saveGeneral() {
    try {
      await updateSiteConfig({ site_name: siteName, whatsapp_number: waNumber, whatsapp_default_msg: waMsg, coverage_zone: coverageZone, response_time: responseTime, maintenance_mode: maintenance })
      toast.success('Configuración guardada')
      refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error al guardar') }
  }

  // ── Colores ───────────────────────────────────────────────
  const [colors, setColors] = useState({
    color_primary:    config?.color_primary    ?? '#D4618C',
    color_secondary:  config?.color_secondary  ?? '#9B6FD4',
    color_accent:     config?.color_accent     ?? '#F4A261',
    color_background: config?.color_background ?? '#FFFBFE',
    color_text:       config?.color_text       ?? '#1C1B1F',
  })

  async function saveColors() {
    try {
      await updateSiteConfig(colors)
      toast.success('Colores guardados — el sitio se actualiza en segundos')
      refresh()
    } catch { toast.error('Error al guardar colores') }
  }

  // ── Trust bar ─────────────────────────────────────────────
  const [trust, setTrust] = useState({
    metric_1_value: config?.metric_1_value ?? '+50',
    metric_1_label: config?.metric_1_label ?? 'Eventos realizados',
    metric_2_value: config?.metric_2_value ?? '1-2 hrs',
    metric_2_label: config?.metric_2_label ?? 'Respuesta cotización',
    metric_3_value: config?.metric_3_value ?? 'ZMG',
    metric_3_label: config?.metric_3_label ?? 'Zona de cobertura',
    trust_bar_visible: config?.trust_bar_visible ?? true,
  })

  async function saveTrust() {
    try { await updateSiteConfig(trust); toast.success('Métricas actualizadas'); refresh() }
    catch { toast.error('Error al guardar') }
  }

  // ── SEO ───────────────────────────────────────────────────
  const [seoForm, setSeoForm] = useState({
    meta_title:       seo?.meta_title       ?? '',
    meta_description: seo?.meta_description ?? '',
    canonical_url:    seo?.canonical_url    ?? '',
    google_analytics_id: seo?.google_analytics_id ?? '',
    meta_pixel_id:    seo?.meta_pixel_id    ?? '',
  })

  async function saveSeo() {
    try { await updateSeoConfig(seoForm); toast.success('SEO actualizado'); refresh() }
    catch { toast.error('Error al guardar') }
  }

  return (
    <div className="divide-y divide-admin-border">

      {/* ── GENERAL ── */}
      <Section title="Información general" icon="⚙️">
        <Input label="Nombre del negocio" value={siteName} onChange={(e) => setSiteName(e.target.value)} maxLength={60} />
        <Input label="WhatsApp (formato: 52XXXXXXXXXX)" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} placeholder="523312345678" hint="Solo dígitos, con código de México" />
        <Textarea label="Mensaje por defecto de WhatsApp" value={waMsg} onChange={(e) => setWaMsg(e.target.value)} rows={3} maxChars={200} />
        <Input label="Zona de cobertura" value={coverageZone} onChange={(e) => setCoverage(e.target.value)} placeholder="Zona Metropolitana de Guadalajara" />
        <Input label="Tiempo de respuesta" value={responseTime} onChange={(e) => setResponse(e.target.value)} placeholder="1 a 2 horas" />
        <Toggle
          label="Modo mantenimiento"
          hint="El sitio muestra una pantalla de 'próximamente' al visitante"
          checked={maintenance}
          onChange={setMaintenance}
        />
        <Button onClick={saveGeneral} fullWidth>Guardar</Button>
      </Section>

      {/* ── COLORES ── */}
      <Section title="Colores de marca" icon="🎨">
        <p className="text-xs text-admin-muted">Los cambios se aplican al sitio de inmediato.</p>
        {[
          { key: 'color_primary',    label: 'Color primario'    },
          { key: 'color_secondary',  label: 'Color secundario'  },
          { key: 'color_accent',     label: 'Color acento'      },
          { key: 'color_background', label: 'Fondo del sitio'   },
          { key: 'color_text',       label: 'Color de texto'    },
        ].map(({ key, label }) => (
          <ColorPicker
            key={key}
            label={label}
            value={colors[key as keyof typeof colors]}
            onChange={(v) => setColors(c => ({ ...c, [key]: v }))}
          />
        ))}
        <Button onClick={saveColors} fullWidth>Guardar colores</Button>
      </Section>

      {/* ── TRUST BAR ── */}
      <Section title="Barra de confianza" icon="📊">
        <Toggle label="Mostrar barra de métricas" checked={trust.trust_bar_visible} onChange={(v) => setTrust(t => ({ ...t, trust_bar_visible: v }))} />
        {[1, 2, 3].map((n) => (
          <div key={n} className="grid grid-cols-2 gap-3">
            <Input label={`Valor ${n}`} value={trust[`metric_${n}_value` as keyof typeof trust] as string}
              onChange={(e) => setTrust(t => ({ ...t, [`metric_${n}_value`]: e.target.value }))} />
            <Input label={`Etiqueta ${n}`} value={trust[`metric_${n}_label` as keyof typeof trust] as string}
              onChange={(e) => setTrust(t => ({ ...t, [`metric_${n}_label`]: e.target.value }))} />
          </div>
        ))}
        <Button onClick={saveTrust} fullWidth>Guardar métricas</Button>
      </Section>

      {/* ── SEO ── */}
      <Section title="SEO y Analytics" icon="🔍">
        <Input label="Título SEO" value={seoForm.meta_title} onChange={(e) => setSeoForm(f => ({ ...f, meta_title: e.target.value }))} maxLength={60} hint="Máximo 60 caracteres" />
        <Textarea label="Descripción SEO" value={seoForm.meta_description} onChange={(e) => setSeoForm(f => ({ ...f, meta_description: e.target.value }))} maxChars={160} rows={3} hint="Máximo 160 caracteres" />
        <Input label="URL canónica" value={seoForm.canonical_url} onChange={(e) => setSeoForm(f => ({ ...f, canonical_url: e.target.value }))} placeholder="https://beautyballons.mx" />
        <Input label="Google Analytics ID" value={seoForm.google_analytics_id} onChange={(e) => setSeoForm(f => ({ ...f, google_analytics_id: e.target.value }))} placeholder="G-XXXXXXXXXX" />
        <Input label="Meta Pixel ID" value={seoForm.meta_pixel_id} onChange={(e) => setSeoForm(f => ({ ...f, meta_pixel_id: e.target.value }))} placeholder="XXXXXXXXXXXXXXXXXX" />
        <Button onClick={saveSeo} fullWidth>Guardar SEO</Button>
      </Section>

      {/* ── CUENTA ── */}
      <Section title="Mi cuenta" icon="👤">
        <div className="space-y-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-admin-border bg-white p-4 text-sm font-medium text-admin-text hover:bg-slate-50">
            Ver sitio público
            <ExternalLink className="h-4 w-4 text-admin-muted" />
          </a>
          <form action={logoutAction}>
            <button type="submit"
              className="flex w-full items-center justify-between rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
              Cerrar sesión
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </Section>
    </div>
  )
}
