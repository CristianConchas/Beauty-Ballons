'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2, Plus, Star, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeroSection, SectionLabel, SocialLink } from '@/types/site.types'
import type { Service, Testimonial, Faq, ProcessStep } from '@/types/content.types'
import {
  updateHero, updateSectionLabel, createTestimonial, updateTestimonial,
  deleteTestimonial, createFaq, updateFaq, deleteFaq, updateProcessStep, updateSocialLink,
} from '@/lib/actions/content'
import { createService, updateService, deleteService } from '@/lib/actions/services'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Toggle } from '@/components/ui/Toggle'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

/* ── Tipos de tabs ── */
type Tab = 'hero' | 'servicios' | 'testimonios' | 'faqs' | 'mas'

interface ContentClientProps {
  hero:              HeroSection | null
  sectionLabels:     SectionLabel[]
  services:          Service[]
  serviceCategories: { id: string; name: string; slug: string }[]
  testimonials:      Testimonial[]
  faqs:              Faq[]
  processSteps:      ProcessStep[]
  socialLinks:       SocialLink[]
  isOwner:           boolean
}

const SECTION_NAMES: Record<string, string> = {
  portfolio: 'Portafolio', services: 'Servicios', process: 'Proceso',
  testimonials: 'Testimonios', faq: 'FAQ', cta_final: 'CTA Final',
}

export function ContentClient({
  hero, sectionLabels, services, testimonials, faqs, processSteps, socialLinks,
}: ContentClientProps) {
  const router = useRouter()
  const [, startT] = useTransition()
  const refresh = () => startT(() => router.refresh())

  const [tab, setTab] = useState<Tab>('hero')

  /* ── Hero ── */
  const [heroForm, setHeroForm] = useState({
    headline:           hero?.headline           ?? '',
    headline_em:        hero?.headline_em        ?? '',
    subheadline:        hero?.subheadline        ?? '',
    badge_text:         hero?.badge_text         ?? '',
    cta_primary_text:   hero?.cta_primary_text   ?? '',
    bg_image_url:       hero?.bg_image_url       ?? '',
    bg_overlay_opacity: hero?.bg_overlay_opacity ?? 0.45,
    show_balloons:      hero?.show_balloons       ?? false,
  })
  const [heroSaving, setHeroSaving] = useState(false)
  async function saveHero() {
    setHeroSaving(true)
    try { await updateHero(heroForm); toast.success('Hero guardado') ; refresh() }
    catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setHeroSaving(false) }
  }

  /* ── Servicios ── */
  const [svcModal, setSvcModal] = useState(false)
  const [svcEdit, setSvcEdit] = useState<Service | null>(null)
  const [svcDel,  setSvcDel]  = useState<Service | null>(null)
  const [svcSaving, setSvcSaving] = useState(false)
  const [svcForm, setSvcForm] = useState({ name: '', icon: '🎈', short_description: '', whatsapp_msg: '', is_featured: false, is_active: true })
  const openNewSvc  = () => { setSvcEdit(null); setSvcForm({ name:'', icon:'🎈', short_description:'', whatsapp_msg:'', is_featured:false, is_active:true }); setSvcModal(true) }
  const openEditSvc = (s: Service) => { setSvcEdit(s); setSvcForm({ name:s.name, icon:s.icon, short_description:s.short_description??'', whatsapp_msg:s.whatsapp_msg, is_featured:s.is_featured, is_active:s.is_active }); setSvcModal(true) }
  async function saveSvc() {
    setSvcSaving(true)
    try {
      if (svcEdit) await updateService(svcEdit.id, svcForm)
      else         await createService({ ...svcForm, sort_order: services.length })
      toast.success(svcEdit ? 'Actualizado' : 'Creado'); setSvcModal(false); refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setSvcSaving(false) }
  }

  /* ── Testimonios ── */
  const [testModal, setTestModal] = useState(false)
  const [testEdit,  setTestEdit]  = useState<Testimonial | null>(null)
  const [testDel,   setTestDel]   = useState<Testimonial | null>(null)
  const [testSaving, setTestSaving] = useState(false)
  const [testForm, setTestForm]   = useState({ client_name:'', event_type:'', location:'', rating:5, content:'', is_featured:false, is_active:true })
  const openNewTest  = () => { setTestEdit(null); setTestForm({ client_name:'', event_type:'', location:'', rating:5, content:'', is_featured:false, is_active:true }); setTestModal(true) }
  const openEditTest = (t: Testimonial) => { setTestEdit(t); setTestForm({ client_name:t.client_name, event_type:t.event_type, location:t.location??'', rating:t.rating, content:t.content, is_featured:t.is_featured, is_active:t.is_active }); setTestModal(true) }
  async function saveTest() {
    setTestSaving(true)
    try {
      if (testEdit) await updateTestimonial(testEdit.id, testForm)
      else          await createTestimonial({ ...testForm, sort_order: testimonials.length })
      toast.success(testEdit ? 'Actualizado' : 'Creado'); setTestModal(false); refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setTestSaving(false) }
  }

  /* ── FAQs ── */
  const [faqModal, setFaqModal] = useState(false)
  const [faqEdit,  setFaqEdit]  = useState<Faq | null>(null)
  const [faqDel,   setFaqDel]   = useState<Faq | null>(null)
  const [faqSaving, setFaqSaving] = useState(false)
  const [faqForm, setFaqForm]   = useState({ question:'', answer:'', cta_in_answer:false, is_active:true })
  const openNewFaq  = () => { setFaqEdit(null); setFaqForm({ question:'', answer:'', cta_in_answer:false, is_active:true }); setFaqModal(true) }
  const openEditFaq = (f: Faq) => { setFaqEdit(f); setFaqForm({ question:f.question, answer:f.answer, cta_in_answer:f.cta_in_answer, is_active:f.is_active }); setFaqModal(true) }
  async function saveFaq() {
    setFaqSaving(true)
    try {
      if (faqEdit) await updateFaq(faqEdit.id, faqForm)
      else         await createFaq({ ...faqForm, sort_order: faqs.length })
      toast.success(faqEdit ? 'Actualizada' : 'Creada'); setFaqModal(false); refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setFaqSaving(false) }
  }

  /* ── Labels state ── */
  const [labelForms, setLabelForms] = useState<Record<string, { title:string; subtitle:string }>>(
    Object.fromEntries(sectionLabels.map(l => [l.section_key, { title: l.title, subtitle: l.subtitle ?? '' }]))
  )
  async function saveLabel(key: string) {
    const f = labelForms[key]
    try { await updateSectionLabel(key, { title: f.title, subtitle: f.subtitle || null }); toast.success('Guardado'); refresh() }
    catch { toast.error('Error') }
  }

  /* ── Tabs ── */
  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'hero',       label: '🖼️ Hero' },
    { id: 'servicios',  label: '🎪 Servicios',  count: services.length },
    { id: 'testimonios',label: '💬 Reseñas',    count: testimonials.length },
    { id: 'faqs',       label: '❓ FAQs',       count: faqs.length },
    { id: 'mas',        label: '⚙️ Más' },
  ]

  return (
    <div className="flex flex-col h-full">

      {/* ── Tab bar ── */}
      <div className="sticky top-0 z-10 bg-admin-surface border-b border-admin-border">
        <div className="flex overflow-x-auto scroll-hide px-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-4 py-3 text-[0.78rem] font-semibold border-b-2 transition-colors whitespace-nowrap',
                tab === t.id
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-admin-muted hover:text-admin-text'
              )}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={cn(
                  'rounded-full px-1.5 py-0.5 text-[0.62rem] font-bold',
                  tab === t.id ? 'bg-[var(--color-primary)] text-white' : 'bg-admin-border text-admin-muted'
                )}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenido de tabs ── */}
      <div className="flex-1 overflow-y-auto">

        {/* HERO */}
        {tab === 'hero' && (
          <div className="p-4 space-y-3 max-w-lg mx-auto">
            <p className="text-xs text-admin-muted mb-1">Texto visible en la portada del sitio</p>

            {/* Titular — 2 campos juntos */}
            <div className="rounded-2xl border border-admin-border bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide">Titular</p>
              <Input label="Primera línea" value={heroForm.headline}
                onChange={e => setHeroForm(f => ({ ...f, headline: e.target.value }))} maxLength={60} placeholder="Cada detalle" />
              <Input label="Segunda línea (cursiva)" value={heroForm.headline_em}
                onChange={e => setHeroForm(f => ({ ...f, headline_em: e.target.value }))} maxLength={50} placeholder="perfectamente decorado" />
            </div>

            {/* Texto y badge */}
            <div className="rounded-2xl border border-admin-border bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide">Texto</p>
              <Input label="Descripción breve" value={heroForm.subheadline}
                onChange={e => setHeroForm(f => ({ ...f, subheadline: e.target.value }))} maxLength={160} placeholder="Globos, centros de mesa…" />
              <Input label="Zona de servicio (chip)" value={heroForm.badge_text}
                onChange={e => setHeroForm(f => ({ ...f, badge_text: e.target.value }))} maxLength={40} placeholder="Guadalajara · Zapopan · ZMG" />
              <Input label="Texto del botón" value={heroForm.cta_primary_text}
                onChange={e => setHeroForm(f => ({ ...f, cta_primary_text: e.target.value }))} maxLength={30} placeholder="Cotizar gratis" />
            </div>

            {/* Fondo */}
            <div className="rounded-2xl border border-admin-border bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-admin-muted uppercase tracking-wide">Fondo</p>
              <Input label="URL de imagen (vacío = gradiente de colores)" value={heroForm.bg_image_url}
                onChange={e => setHeroForm(f => ({ ...f, bg_image_url: e.target.value }))} placeholder="https://…" />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-admin-text">Oscuridad del overlay</label>
                  <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                    {Math.round(heroForm.bg_overlay_opacity * 100)}%
                  </span>
                </div>
                <input type="range" min="0" max="0.9" step="0.05"
                  value={heroForm.bg_overlay_opacity}
                  onChange={e => setHeroForm(f => ({ ...f, bg_overlay_opacity: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                  style={{ background: `linear-gradient(to right, var(--color-primary) ${heroForm.bg_overlay_opacity / 0.9 * 100}%, #E2E8F0 0%)` }}
                />
                <p className="mt-1 text-[0.62rem] text-admin-muted">Recomendado: 40–55%</p>
              </div>
            </div>

            <Button onClick={saveHero} fullWidth loading={heroSaving}>
              Guardar cambios del hero
            </Button>
          </div>
        )}

        {/* SERVICIOS */}
        {tab === 'servicios' && (
          <div className="p-4 space-y-2 max-w-lg mx-auto">
            <p className="text-xs text-admin-muted">Toca un servicio para editar el mensaje de WhatsApp y los detalles.</p>
            {services.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => openEditSvc(s)}
                className="w-full flex items-center gap-3 rounded-2xl border border-admin-border bg-white p-3.5 text-left transition-all hover:border-[var(--color-primary)]/40 hover:shadow-sm active:scale-[.98]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: 'rgba(200,81,122,0.08)' }}>
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-admin-text">{s.name}</p>
                  <p className="truncate text-[0.7rem] text-admin-muted">
                    {s.whatsapp_msg?.slice(0, 55) ?? 'Sin mensaje'}{s.whatsapp_msg && s.whatsapp_msg.length > 55 ? '…' : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {!s.is_active && <Badge variant="default">Oculto</Badge>}
                  <ChevronRight className="h-4 w-4 text-admin-muted" />
                </div>
              </button>
            ))}
            <Button variant="secondary" fullWidth onClick={openNewSvc} leftIcon={<Plus className="h-4 w-4" />}>
              Nuevo servicio
            </Button>
          </div>
        )}

        {/* TESTIMONIOS */}
        {tab === 'testimonios' && (
          <div className="p-4 space-y-2 max-w-lg mx-auto">
            <p className="text-xs text-admin-muted">Las reseñas de tus clientes que aparecen en el carrusel del sitio.</p>
            {testimonials.map(t => (
              <div key={t.id} className="rounded-2xl border border-admin-border bg-white p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-admin-text">{t.client_name}</p>
                      {t.is_featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      {!t.is_active && <Badge variant="default">Oculto</Badge>}
                    </div>
                    <p className="text-[0.7rem] text-admin-muted">{t.event_type}{t.location ? ` · ${t.location}` : ''}</p>
                    <p className="mt-1.5 text-xs text-admin-muted line-clamp-2">{t.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Toggle
                      size="sm"
                      checked={t.is_active}
                      onChange={async (v) => {
                        try { await updateTestimonial(t.id, { is_active: v }); refresh() }
                        catch { toast.error('Error') }
                      }}
                    />
                    <button onClick={() => openEditTest(t)} className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Editar</button>
                    <button onClick={() => setTestDel(t)} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="secondary" fullWidth onClick={openNewTest} leftIcon={<Plus className="h-4 w-4" />}>
              Agregar reseña
            </Button>
          </div>
        )}

        {/* FAQs */}
        {tab === 'faqs' && (
          <div className="p-4 space-y-2 max-w-lg mx-auto">
            <p className="text-xs text-admin-muted">Preguntas frecuentes que aparecen en la sección de FAQ del sitio.</p>
            {faqs.map(f => (
              <div key={f.id} className="rounded-2xl border border-admin-border bg-white p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-admin-text leading-snug">{f.question}</p>
                    <p className="mt-1 text-[0.72rem] text-admin-muted line-clamp-2">{f.answer}</p>
                    {!f.is_active && <Badge variant="default" className="mt-1">Oculta</Badge>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEditFaq(f)} className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>Editar</button>
                    <button onClick={() => setFaqDel(f)} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="secondary" fullWidth onClick={openNewFaq} leftIcon={<Plus className="h-4 w-4" />}>
              Nueva pregunta
            </Button>
          </div>
        )}

        {/* MÁS — proceso, redes, etiquetas */}
        {tab === 'mas' && (
          <div className="p-4 space-y-5 max-w-lg mx-auto">

            {/* Proceso */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">Pasos del proceso</p>
              <div className="space-y-2">
                {processSteps.map(step => (
                  <div key={step.id} className="rounded-2xl border border-admin-border bg-white p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-admin-muted">Paso {step.step_number} {step.icon}</p>
                      <Toggle size="sm" checked={step.is_active}
                        onChange={async v => { try { await updateProcessStep(step.id, { is_active: v }); refresh() } catch { toast.error('Error') } }} />
                    </div>
                    <Input label="Título" defaultValue={step.title} maxLength={30}
                      onBlur={async e => { if (e.target.value !== step.title) { try { await updateProcessStep(step.id, { title: e.target.value }); toast.success('Guardado'); refresh() } catch { toast.error('Error') } } }} />
                    <Input label="Descripción" defaultValue={step.description} maxLength={80}
                      onBlur={async e => { if (e.target.value !== step.description) { try { await updateProcessStep(step.id, { description: e.target.value }); toast.success('Guardado'); refresh() } catch { toast.error('Error') } } }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-admin-muted">Redes sociales</p>
              <div className="space-y-2">
                {socialLinks.map(link => (
                  <div key={link.id} className="rounded-2xl border border-admin-border bg-white p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold capitalize text-admin-text">{link.platform}</p>
                      <Toggle size="sm" checked={link.is_active}
                        onChange={async v => { try { await updateSocialLink(link.id, { is_active: v }); refresh() } catch { toast.error('Error') } }} />
                    </div>
                    <Input label="URL" defaultValue={link.url} placeholder="https://instagram.com/…"
                      onBlur={async e => { if (e.target.value !== link.url) { try { await updateSocialLink(link.id, { url: e.target.value }); toast.success('Guardado'); refresh() } catch { toast.error('Error') } } }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Etiquetas de secciones — colapsado */}
            <details className="rounded-2xl border border-admin-border bg-white overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-admin-text">
                Títulos de secciones
                <ChevronRight className="h-4 w-4 text-admin-muted" />
              </summary>
              <div className="px-4 pb-4 space-y-3 border-t border-admin-border pt-3">
                <p className="text-xs text-admin-muted">Edita los textos de cada sección del sitio.</p>
                {sectionLabels.map(label => {
                  const key  = label.section_key
                  const form = labelForms[key] ?? { title: label.title, subtitle: label.subtitle ?? '' }
                  return (
                    <div key={key} className="space-y-2 rounded-xl border border-admin-border p-3">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-admin-muted">
                        {SECTION_NAMES[key] ?? key}
                      </p>
                      <Input label="Título de la sección" value={form.title} maxLength={80}
                        onChange={e => setLabelForms(p => ({ ...p, [key]: { ...form, title: e.target.value } }))} />
                      <Input label="Subtítulo (opcional)" value={form.subtitle} maxLength={160}
                        onChange={e => setLabelForms(p => ({ ...p, [key]: { ...form, subtitle: e.target.value } }))}
                        placeholder="Descripción breve debajo del título" />
                      <Button size="sm" onClick={() => saveLabel(key)}>Guardar</Button>
                    </div>
                  )
                })}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* ── Modales ── */}
      <Modal open={svcModal} onClose={() => setSvcModal(false)} title={svcEdit ? 'Editar servicio' : 'Nuevo servicio'}>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input label="Emoji" value={svcForm.icon} onChange={e => setSvcForm(f => ({ ...f, icon: e.target.value }))} className="w-20 text-center text-xl" maxLength={4} />
              <div className="flex-1"><Input label="Nombre" value={svcForm.name} onChange={e => setSvcForm(f => ({ ...f, name: e.target.value }))} maxLength={40} required /></div>
            </div>
            <Input label="Descripción breve (opcional)" value={svcForm.short_description} onChange={e => setSvcForm(f => ({ ...f, short_description: e.target.value }))} maxLength={80} />
            <Textarea
              label="Mensaje que se envía a WhatsApp cuando alguien toca este servicio"
              value={svcForm.whatsapp_msg}
              onChange={e => setSvcForm(f => ({ ...f, whatsapp_msg: e.target.value }))}
              maxChars={200} rows={3} required
            />
            <p className="text-[0.68rem] text-admin-muted -mt-2">
              Tip: Usa *texto* para negritas en WhatsApp. Ej: &quot;Hola! Me interesa cotizar *arcos de globos* 🎈&quot;
            </p>
            <div className="flex gap-4">
              <Toggle label="Visible en el sitio" checked={svcForm.is_active} onChange={v => setSvcForm(f => ({ ...f, is_active: v }))} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" size="sm" onClick={() => setSvcModal(false)}>Cancelar</Button>
          <Button size="sm" onClick={saveSvc} loading={svcSaving}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={testModal} onClose={() => setTestModal(false)} title={testEdit ? 'Editar reseña' : 'Nueva reseña'}>
        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre del cliente" value={testForm.client_name} onChange={e => setTestForm(f => ({ ...f, client_name: e.target.value }))} maxLength={30} required />
              <Input label="Tipo de evento" value={testForm.event_type} onChange={e => setTestForm(f => ({ ...f, event_type: e.target.value }))} maxLength={30} placeholder="Baby Shower…" required />
            </div>
            <Input label="Ciudad (opcional)" value={testForm.location} onChange={e => setTestForm(f => ({ ...f, location: e.target.value }))} maxLength={30} placeholder="Zapopan" />
            <div>
              <p className="mb-1.5 text-sm font-medium text-admin-text">Calificación</p>
              <StarRating value={testForm.rating} onChange={v => setTestForm(f => ({ ...f, rating: v }))} size="lg" />
            </div>
            <Textarea label="Reseña del cliente" value={testForm.content} onChange={e => setTestForm(f => ({ ...f, content: e.target.value }))} maxChars={200} rows={3} required />
            <Toggle label="Activa (visible en el sitio)" checked={testForm.is_active} onChange={v => setTestForm(f => ({ ...f, is_active: v }))} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" size="sm" onClick={() => setTestModal(false)}>Cancelar</Button>
          <Button size="sm" onClick={saveTest} loading={testSaving}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={faqModal} onClose={() => setFaqModal(false)} title={faqEdit ? 'Editar pregunta' : 'Nueva pregunta'}>
        <Modal.Body>
          <div className="space-y-4">
            <Input label="Pregunta" value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} maxLength={120} required />
            <Textarea label="Respuesta" value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} maxChars={400} rows={4} required />
            <Toggle label="Agregar botón de WhatsApp en la respuesta" checked={faqForm.cta_in_answer} onChange={v => setFaqForm(f => ({ ...f, cta_in_answer: v }))} />
            <Toggle label="Activa (visible en el sitio)" checked={faqForm.is_active} onChange={v => setFaqForm(f => ({ ...f, is_active: v }))} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" size="sm" onClick={() => setFaqModal(false)}>Cancelar</Button>
          <Button size="sm" onClick={saveFaq} loading={faqSaving}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDialog open={!!svcDel} onClose={() => setSvcDel(null)}
        onConfirm={async () => { try { await deleteService(svcDel!.id); toast.success('Eliminado'); setSvcDel(null); refresh() } catch { toast.error('Error') } }}
        title="¿Eliminar servicio?" description={`"${svcDel?.name}" se eliminará permanentemente.`} confirmLabel="Eliminar" />
      <ConfirmDialog open={!!testDel} onClose={() => setTestDel(null)}
        onConfirm={async () => { try { await deleteTestimonial(testDel!.id); toast.success('Eliminado'); setTestDel(null); refresh() } catch { toast.error('Error') } }}
        title="¿Eliminar reseña?" description="Esta reseña se eliminará permanentemente." confirmLabel="Eliminar" />
      <ConfirmDialog open={!!faqDel} onClose={() => setFaqDel(null)}
        onConfirm={async () => { try { await deleteFaq(faqDel!.id); toast.success('Eliminada'); setFaqDel(null); refresh() } catch { toast.error('Error') } }}
        title="¿Eliminar pregunta?" description="Se eliminará permanentemente." confirmLabel="Eliminar" />
    </div>
  )
}
