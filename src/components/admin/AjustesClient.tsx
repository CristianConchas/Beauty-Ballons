'use client'

import type { ReactNode } from 'react'
import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronDown, ExternalLink, LogOut, Plus, Trash2, KeyRound, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SiteConfig, SeoConfig } from '@/types/site.types'
import { updateSiteConfig, updateSeoConfig } from '@/lib/actions/content'
import {
  createAdminUser, updateAdminUserRole,
  updateAdminUserPassword, updateOwnPassword, deleteAdminUser,
} from '@/lib/actions/admin-users'
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

interface AdminUserItem {
  id:            string
  email:         string
  role:          'owner' | 'editor'
  created_at:    string
  last_sign_in:  string | null
}

interface Props {
  config:        SiteConfig | null
  seo:           SeoConfig  | null
  adminUsers:    AdminUserItem[]
  currentUserId: string
}

export function AjustesClient({ config, seo, adminUsers, currentUserId }: Props) {
  const router     = useRouter()
  const [, startT] = useTransition()
  const refresh    = () => startT(() => router.refresh())

  // ── Config general ────────────────────────────────────────
  const [siteName, setSiteName]     = useState(config?.site_name ?? '')
  const [tagline, setTagline]       = useState(config?.tagline ?? '')
  const [logoUrl, setLogoUrl]       = useState(config?.logo_url ?? '')
  const [waNumber, setWaNumber]     = useState(config?.whatsapp_number ?? '')
  const [waMsg, setWaMsg]           = useState(config?.whatsapp_default_msg ?? '')
  const [waFloat, setWaFloat]       = useState(config?.whatsapp_float_visible ?? true)
  const [coverageZone, setCoverage] = useState(config?.coverage_zone ?? '')
  const [responseTime, setResponse] = useState(config?.response_time ?? '')
  const [openingHours, setHours]    = useState(config?.opening_hours ?? '')
  const [privacyUrl, setPrivacyUrl] = useState(config?.privacy_policy_url ?? '')
  const [legalText, setLegalText]   = useState(config?.legal_text ?? '')
  const [maintenance, setMaintenance]   = useState(config?.maintenance_mode ?? false)
  const [maintenanceMsg, setMainMsg]    = useState(config?.maintenance_msg ?? '')

  async function saveGeneral() {
    try {
      await updateSiteConfig({
        site_name: siteName, tagline, logo_url: logoUrl || null,
        whatsapp_number: waNumber, whatsapp_default_msg: waMsg,
        whatsapp_float_visible: waFloat,
        coverage_zone: coverageZone, response_time: responseTime,
        opening_hours: openingHours,
        privacy_policy_url: privacyUrl || null, legal_text: legalText || null,
        maintenance_mode: maintenance, maintenance_msg: maintenanceMsg || null,
      })
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

  // ── Instagram ─────────────────────────────────────────────
  const [igToken, setIgToken] = useState('')
  const [igSaving, setIgSaving] = useState(false)
  async function saveIgToken() {
    if (!igToken.trim()) { toast.error('Ingresa el token'); return }
    setIgSaving(true)
    try {
      const res = await fetch('/api/ig-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: igToken.trim() }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      toast.success('Token de Instagram guardado')
      setIgToken('')
    } catch { toast.error('Error al guardar el token') }
    finally { setIgSaving(false) }
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
        <Input label="Tagline / Slogan" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={100} placeholder="Decoración de eventos con estilo y amor" />
        <Input label="URL del logo (imagen)" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…/logo.png" hint="Sube la imagen al portafolio y copia la URL" />

        <div className="border-t border-admin-border pt-3 space-y-3">
          <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide">WhatsApp</p>
          <Input label="Número de WhatsApp" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} placeholder="523312345678" hint="Solo dígitos con código de país: 52 + 10 dígitos" />
          <Textarea label="Mensaje por defecto" value={waMsg} onChange={(e) => setWaMsg(e.target.value)} rows={2} maxChars={200} />
          <Toggle label="Mostrar botón flotante de WhatsApp" checked={waFloat} onChange={setWaFloat} />
        </div>

        <div className="border-t border-admin-border pt-3 space-y-3">
          <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide">Información de contacto</p>
          <Input label="Zona de cobertura" value={coverageZone} onChange={(e) => setCoverage(e.target.value)} placeholder="Guadalajara · Zapopan · ZMG" />
          <Input label="Tiempo de respuesta" value={responseTime} onChange={(e) => setResponse(e.target.value)} placeholder="1 a 2 horas" />
          <Input label="Horario de atención" value={openingHours} onChange={(e) => setHours(e.target.value)} placeholder="Lunes a domingo, 9:00–20:00" />
        </div>

        <div className="border-t border-admin-border pt-3 space-y-3">
          <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide">Legal</p>
          <Input label="URL del aviso de privacidad" value={privacyUrl} onChange={(e) => setPrivacyUrl(e.target.value)} placeholder="https://…/privacidad" />
          <Input label="Texto legal del footer" value={legalText} onChange={(e) => setLegalText(e.target.value)} placeholder="Todos los derechos reservados" />
        </div>

        <div className="border-t border-admin-border pt-3 space-y-3">
          <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide">Mantenimiento</p>
          <Toggle
            label="Modo mantenimiento"
            hint="El sitio muestra una pantalla de 'próximamente' al visitante"
            checked={maintenance}
            onChange={setMaintenance}
          />
          {maintenance && (
            <Textarea label="Mensaje de mantenimiento" value={maintenanceMsg} onChange={(e) => setMainMsg(e.target.value)} rows={2} maxChars={200} placeholder="Estamos mejorando el sitio. Volvemos muy pronto." />
          )}
        </div>
        <Button onClick={saveGeneral} fullWidth>Guardar configuración</Button>
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

      {/* ── INSTAGRAM ── */}
      <Section title="Instagram" icon="📸">
        <p className="text-xs text-admin-muted">
          Conecta tu cuenta de Instagram para mostrar tus fotos más recientes automáticamente en el portafolio.
        </p>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
          <p className="text-[0.72rem] text-amber-700">
            <strong>Cómo obtener el token:</strong> Ve a{' '}
            <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">developers.facebook.com</a>
            {' '}→ tu app → Instagram → Generar Long-Lived Token.
            El token dura 60 días — puedes renovarlo aquí cuando expire.
          </p>
        </div>
        <Input
          label="Long-Lived Access Token de Instagram"
          value={igToken}
          onChange={(e) => setIgToken(e.target.value)}
          placeholder="IGQVJXb3h…"
          hint="Se guarda de forma segura en la base de datos"
        />
        <Button onClick={saveIgToken} fullWidth loading={igSaving}>
          Guardar token de Instagram
        </Button>
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

      {/* ── USUARIOS ── */}
      <UsersSection adminUsers={adminUsers} currentUserId={currentUserId} />

      {/* ── CUENTA ── */}
      <Section title="Mi cuenta" icon="👤">
        <div className="space-y-3">
          {/* Cambiar contraseña propia */}
          <OwnPasswordForm />
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

/* ══════════════════════════════════════════════
   SECCIÓN DE GESTIÓN DE USUARIOS
   Solo visible para owners
   ══════════════════════════════════════════════ */

function UsersSection({
  adminUsers,
  currentUserId,
}: {
  adminUsers: { id: string; email: string; role: 'owner' | 'editor'; last_sign_in: string | null }[]
  currentUserId: string
}) {
  const [users, setUsers]         = useState(adminUsers)
  const [showNew, setShowNew]     = useState(false)
  const [newForm, setNewForm]     = useState({ email: '', password: '', role: 'editor' as 'owner' | 'editor' })
  const [saving, setSaving]       = useState(false)
  const [pwdUserId, setPwdUserId] = useState<string | null>(null)
  const [newPwd, setNewPwd]       = useState('')
  const [pwdSaving, setPwdSaving] = useState(false)

  async function handleCreate() {
    if (!newForm.email || !newForm.password) {
      toast.error('Email y contraseña son requeridos.')
      return
    }
    setSaving(true)
    try {
      await createAdminUser(newForm)
      toast.success('Usuario creado correctamente')
      setShowNew(false)
      setNewForm({ email: '', password: '', role: 'editor' })
      // Refrescar la lista
      window.location.reload()
    } catch (e: any) { toast.error(e.message ?? 'Error al crear usuario') }
    finally { setSaving(false) }
  }

  async function handleRoleChange(userId: string, role: 'owner' | 'editor') {
    try {
      await updateAdminUserRole({ userId, role })
      setUsers(u => u.map(x => x.id === userId ? { ...x, role } : x))
      toast.success('Rol actualizado')
    } catch (e: any) { toast.error(e.message ?? 'Error') }
  }

  async function handleDelete(userId: string, email: string) {
    if (!confirm(`¿Eliminar a ${email}? Esta acción no se puede deshacer.`)) return
    try {
      await deleteAdminUser(userId)
      setUsers(u => u.filter(x => x.id !== userId))
      toast.success('Usuario eliminado')
    } catch (e: any) { toast.error(e.message ?? 'Error') }
  }

  async function handlePasswordChange(userId: string) {
    if (!newPwd || newPwd.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setPwdSaving(true)
    try {
      await updateAdminUserPassword({ userId, newPassword: newPwd })
      toast.success('Contraseña actualizada correctamente')
      setPwdUserId(null)
      setNewPwd('')
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setPwdSaving(false) }
  }

  return (
    <Section title="Usuarios del admin" icon="👥">
      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            className="rounded-2xl border border-admin-border bg-white overflow-hidden"
          >
            {/* Fila principal */}
            <div className="flex items-center gap-3 p-3.5">
              {/* Avatar */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
                style={{ background: user.role === 'owner' ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : '#94A3B8' }}
              >
                {user.email[0].toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-admin-text">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {user.role === 'owner' ? (
                    <span className="flex items-center gap-1 text-[0.65rem] font-bold text-[var(--color-primary)]">
                      <ShieldCheck className="h-3 w-3" /> Owner
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[0.65rem] font-bold text-slate-500">
                      <ShieldAlert className="h-3 w-3" /> Editor
                    </span>
                  )}
                  {user.id === currentUserId && (
                    <span className="text-[0.6rem] text-admin-muted">(tú)</span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              {user.id !== currentUserId && (
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => { setPwdUserId(pwdUserId === user.id ? null : user.id); setNewPwd('') }}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-admin-border text-admin-muted hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                    title="Cambiar contraseña"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                  </button>
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value as 'owner' | 'editor')}
                    className="h-8 rounded-xl border border-admin-border bg-white px-2 text-[0.72rem] font-medium text-admin-text cursor-pointer"
                  >
                    <option value="editor">Editor</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button
                    onClick={() => handleDelete(user.id, user.email)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors"
                    title="Eliminar usuario"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Panel de cambio de contraseña */}
            {pwdUserId === user.id && (
              <div className="border-t border-admin-border bg-slate-50 p-3 flex gap-2">
                <input
                  type="password"
                  placeholder="Nueva contraseña (mín. 8 caracteres)"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  className="flex-1 rounded-xl border border-admin-border px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  onClick={() => handlePasswordChange(user.id)}
                  disabled={pwdSaving}
                  className="rounded-xl px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                  style={{ background: 'var(--color-primary)' }}
                >
                  {pwdSaving ? '…' : 'Guardar'}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Nuevo usuario */}
        {showNew ? (
          <div className="rounded-2xl border border-[var(--color-primary)]/30 bg-white p-4 space-y-3">
            <p className="text-sm font-semibold text-admin-text">Nuevo usuario</p>
            <input
              type="email"
              placeholder="Email *"
              value={newForm.email}
              onChange={e => setNewForm(f => ({ ...f, email: e.target.value }))}
              className="w-full rounded-xl border border-admin-border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Contraseña * (mín. 8 caracteres)"
              value={newForm.password}
              onChange={e => setNewForm(f => ({ ...f, password: e.target.value }))}
              className="w-full rounded-xl border border-admin-border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
              minLength={8}
              autoComplete="new-password"
            />
            <div>
              <label className="text-xs font-medium text-admin-muted block mb-1">Rol</label>
              <select
                value={newForm.role}
                onChange={e => setNewForm(f => ({ ...f, role: e.target.value as 'owner' | 'editor' }))}
                className="w-full rounded-xl border border-admin-border bg-white px-3 py-2.5 text-sm text-admin-text"
              >
                <option value="editor">Editor — solo portafolio y leads</option>
                <option value="owner">Owner — acceso completo</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowNew(false)}
                className="flex-1 rounded-xl border border-admin-border py-2.5 text-sm font-medium text-admin-muted hover:bg-slate-50">
                Cancelar
              </button>
              <button onClick={handleCreate} disabled={saving}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: 'var(--color-primary)' }}>
                {saving ? 'Creando…' : 'Crear usuario'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowNew(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-admin-border py-3.5 text-sm font-medium text-admin-muted hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar usuario
          </button>
        )}
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 mt-2">
        <p className="text-[0.72rem] text-amber-700 font-medium">
          <strong>Owner:</strong> acceso completo al admin.{' '}
          <strong>Editor:</strong> solo puede gestionar portafolio y leads.
        </p>
      </div>
    </Section>
  )
}

/* ══ Cambiar contraseña propia ══ */
function OwnPasswordForm() {
  const [form, setForm]   = useState({ current: '', next: '', confirm: '' })
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (form.next !== form.confirm) {
      toast.error('Las contraseñas nuevas no coinciden.')
      return
    }
    if (form.next.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setSaving(true)
    try {
      await updateOwnPassword({ currentPassword: form.current, newPassword: form.next })
      toast.success('Contraseña actualizada correctamente')
      setForm({ current: '', next: '', confirm: '' })
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setSaving(false) }
  }

  return (
    <div className="rounded-xl border border-admin-border bg-white p-4 space-y-3">
      <p className="text-sm font-semibold text-admin-text flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-admin-muted" />
        Cambiar mi contraseña
      </p>
      <input
        type="password" placeholder="Contraseña actual"
        value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))}
        className="w-full rounded-xl border border-admin-border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
        autoComplete="current-password"
      />
      <input
        type="password" placeholder="Nueva contraseña (mín. 8 caracteres)"
        value={form.next} onChange={e => setForm(f => ({ ...f, next: e.target.value }))}
        className="w-full rounded-xl border border-admin-border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
        minLength={8} autoComplete="new-password"
      />
      <input
        type="password" placeholder="Confirmar nueva contraseña"
        value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
        className="w-full rounded-xl border border-admin-border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)]"
        minLength={8} autoComplete="new-password"
      />
      <button onClick={handleSubmit} disabled={saving}
        className="w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60 transition-opacity"
        style={{ background: 'var(--color-primary)' }}>
        {saving ? 'Actualizando…' : 'Actualizar contraseña'}
      </button>
    </div>
  )
}
