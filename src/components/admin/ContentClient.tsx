'use client'

import type { ReactNode } from 'react'
import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronDown, Plus, Trash2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HeroSection, SectionLabel, SocialLink } from '@/types/site.types'
import type { Service, Testimonial, Faq, ProcessStep } from '@/types/content.types'
import {
  updateHero, updateSectionLabel, createTestimonial, updateTestimonial,
  deleteTestimonial, createFaq, updateFaq, deleteFaq, updateProcessStep,
  updateSocialLink,
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

function Section({
  title, icon, children, defaultOpen = false,
}: {
  title: string; icon: string; children: ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-admin-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-medium text-admin-text">{title}</span>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-admin-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && <div className="px-4 pb-5 space-y-4">{children}</div>}
    </div>
  )
}

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
  portfolio:    'Portafolio',
  services:     'Servicios',
  process:      'Proceso',
  testimonials: 'Testimonios',
  faq:          'Preguntas frecuentes',
  cta_final:    'CTA Final',
}

export function ContentClient({
  hero, sectionLabels, services,
  testimonials, faqs, processSteps, socialLinks,
}: ContentClientProps) {
  const router     = useRouter()
  const [, startT] = useTransition()
  const refresh    = () => startT(() => router.refresh())

  // ── Hero ──────────────────────────────────────────────────────
  const [heroForm, setHeroForm] = useState({
    headline:           hero?.headline           ?? '',
    subheadline:        hero?.subheadline        ?? '',
    badge_text:         hero?.badge_text         ?? '',
    cta_primary_text:   hero?.cta_primary_text   ?? '',
    cta_secondary_text: hero?.cta_secondary_text ?? '',
    show_balloons:      hero?.show_balloons       ?? true,
  })
  const [heroSaving, setHeroSaving] = useState(false)

  async function saveHero() {
    setHeroSaving(true)
    try { await updateHero(heroForm); toast.success('Hero guardado'); refresh() }
    catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setHeroSaving(false) }
  }

  // ── Section labels ────────────────────────────────────────────
  const [labelForms, setLabelForms] = useState<Record<string, { title: string; subtitle: string }>>(
    Object.fromEntries(
      sectionLabels.map((l) => [l.section_key, { title: l.title, subtitle: l.subtitle ?? '' }])
    )
  )

  async function saveSectionLabel(key: string) {
    const form = labelForms[key]
    if (!form) return
    try {
      await updateSectionLabel(key, { title: form.title, subtitle: form.subtitle || null })
      toast.success('Sección actualizada')
      refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error') }
  }

  // ── Servicios ─────────────────────────────────────────────────
  const [svcModal, setSvcModal] = useState(false)
  const [svcEdit, setSvcEdit]   = useState<Service | null>(null)
  const [svcDel, setSvcDel]     = useState<Service | null>(null)
  const [svcSaving, setSvcSaving] = useState(false)
  const [svcForm, setSvcForm]   = useState({ name: '', icon: '🎈', short_description: '', whatsapp_msg: '', is_featured: false, is_active: true })

  function openNewService() {
    setSvcEdit(null); setSvcForm({ name: '', icon: '🎈', short_description: '', whatsapp_msg: '', is_featured: false, is_active: true }); setSvcModal(true)
  }
  function openEditService(s: Service) {
    setSvcEdit(s); setSvcForm({ name: s.name, icon: s.icon, short_description: s.short_description ?? '', whatsapp_msg: s.whatsapp_msg, is_featured: s.is_featured, is_active: s.is_active }); setSvcModal(true)
  }
  async function saveService() {
    setSvcSaving(true)
    try {
      svcEdit ? await updateService(svcEdit.id, svcForm) : await createService({ ...svcForm, sort_order: services.length })
      toast.success(svcEdit ? 'Actualizado' : 'Creado'); setSvcModal(false); refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setSvcSaving(false) }
  }

  // ── Testimonios ───────────────────────────────────────────────
  const [testModal, setTestModal]     = useState(false)
  const [testEdit, setTestEdit]       = useState<Testimonial | null>(null)
  const [testDel, setTestDel]         = useState<Testimonial | null>(null)
  const [testSaving, setTestSaving]   = useState(false)
  const [testForm, setTestForm]       = useState({ client_name: '', event_type: '', location: '', rating: 5, content: '', is_featured: false, is_active: true })

  function openNewTestimonial() {
    setTestEdit(null); setTestForm({ client_name: '', event_type: '', location: '', rating: 5, content: '', is_featured: false, is_active: true }); setTestModal(true)
  }
  function openEditTestimonial(t: Testimonial) {
    setTestEdit(t); setTestForm({ client_name: t.client_name, event_type: t.event_type, location: t.location ?? '', rating: t.rating, content: t.content, is_featured: t.is_featured, is_active: t.is_active }); setTestModal(true)
  }
  async function saveTestimonial() {
    setTestSaving(true)
    try {
      testEdit ? await updateTestimonial(testEdit.id, testForm) : await createTestimonial({ ...testForm, sort_order: testimonials.length })
      toast.success(testEdit ? 'Actualizado' : 'Creado'); setTestModal(false); refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setTestSaving(false) }
  }

  // ── FAQ ───────────────────────────────────────────────────────
  const [faqModal, setFaqModal]   = useState(false)
  const [faqEdit, setFaqEdit]     = useState<Faq | null>(null)
  const [faqDel, setFaqDel]       = useState<Faq | null>(null)
  const [faqSaving, setFaqSaving] = useState(false)
  const [faqForm, setFaqForm]     = useState({ question: '', answer: '', cta_in_answer: false, is_active: true })

  function openNewFaq() {
    setFaqEdit(null); setFaqForm({ question: '', answer: '', cta_in_answer: false, is_active: true }); setFaqModal(true)
  }
  function openEditFaq(f: Faq) {
    setFaqEdit(f); setFaqForm({ question: f.question, answer: f.answer, cta_in_answer: f.cta_in_answer, is_active: f.is_active }); setFaqModal(true)
  }
  async function saveFaq() {
    setFaqSaving(true)
    try {
      faqEdit ? await updateFaq(faqEdit.id, faqForm) : await createFaq({ ...faqForm, sort_order: faqs.length })
      toast.success(faqEdit ? 'Actualizada' : 'Creada'); setFaqModal(false); refresh()
    } catch (e: any) { toast.error(e.message ?? 'Error') }
    finally { setFaqSaving(false) }
  }

  return (
    <div className="divide-y divide-admin-border">

      {/* HERO */}
      <Section title="Hero" icon="🖼️" defaultOpen>
        <Input label="Título principal" value={heroForm.headline} onChange={(e) => setHeroForm(f => ({ ...f, headline: e.target.value }))} maxLength={60} />
        <Input label="Subtítulo" value={heroForm.subheadline} onChange={(e) => setHeroForm(f => ({ ...f, subheadline: e.target.value }))} maxLength={120} />
        <Input label="Badge (etiqueta pequeña)" value={heroForm.badge_text} onChange={(e) => setHeroForm(f => ({ ...f, badge_text: e.target.value }))} maxLength={40} placeholder="🎈 Decoración · ZMG" />
        <Input label="Texto botón principal" value={heroForm.cta_primary_text} onChange={(e) => setHeroForm(f => ({ ...f, cta_primary_text: e.target.value }))} maxLength={30} />
        <Input label="Texto botón secundario (opcional)" value={heroForm.cta_secondary_text} onChange={(e) => setHeroForm(f => ({ ...f, cta_secondary_text: e.target.value }))} maxLength={30} />
        <Toggle label="Mostrar globos animados" checked={heroForm.show_balloons} onChange={(v) => setHeroForm(f => ({ ...f, show_balloons: v }))} />
        <Button onClick={saveHero} fullWidth loading={heroSaving}>Guardar hero</Button>
      </Section>

      {/* TÍTULOS DE SECCIONES */}
      <Section title="Títulos de secciones" icon="✏️">
        <p className="text-xs text-admin-muted">Edita el título y subtítulo visibles en cada sección del sitio.</p>
        {sectionLabels.map((label) => {
          const key  = label.section_key
          const form = labelForms[key] ?? { title: label.title, subtitle: label.subtitle ?? '' }
          return (
            <div key={key} className="rounded-xl border border-admin-border bg-white p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">{SECTION_NAMES[key] ?? key}</p>
              <Input label="Título" value={form.title} onChange={(e) => setLabelForms(p => ({ ...p, [key]: { ...form, title: e.target.value } }))} maxLength={80} />
              <Input label="Subtítulo (opcional)" value={form.subtitle} onChange={(e) => setLabelForms(p => ({ ...p, [key]: { ...form, subtitle: e.target.value } }))} maxLength={120} />
              <Button size="sm" onClick={() => saveSectionLabel(key)}>Guardar</Button>
            </div>
          )
        })}
      </Section>

      {/* SERVICIOS */}
      <Section title={`Servicios (${services.length})`} icon="🎪">
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-admin-border bg-white p-3">
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-admin-text">{s.name}</p>
                <div className="flex gap-1 mt-0.5">
                  {s.is_featured && <Badge variant="primary">Home</Badge>}
                  {!s.is_active  && <Badge variant="default">Oculto</Badge>}
                </div>
              </div>
              <button type="button" onClick={() => openEditService(s)} className="text-xs text-brand-primary hover:underline">Editar</button>
              <button type="button" onClick={() => setSvcDel(s)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        <Button variant="secondary" fullWidth onClick={openNewService} leftIcon={<Plus className="h-4 w-4" />}>Nuevo servicio</Button>
      </Section>

      {/* PROCESO */}
      <Section title="Cómo funciona" icon="📋">
        {processSteps.map((step) => (
          <div key={step.id} className="rounded-xl border border-admin-border bg-white p-3 space-y-2">
            <p className="text-xs font-semibold text-admin-muted">Paso {step.step_number} {step.icon}</p>
            <Input label="Título" defaultValue={step.title}
              onBlur={async (e) => { if (e.target.value !== step.title) { try { await updateProcessStep(step.id, { title: e.target.value }); toast.success('Guardado'); refresh() } catch { toast.error('Error') } } }} maxLength={30} />
            <Input label="Descripción" defaultValue={step.description}
              onBlur={async (e) => { if (e.target.value !== step.description) { try { await updateProcessStep(step.id, { description: e.target.value }); toast.success('Guardado'); refresh() } catch { toast.error('Error') } } }} maxLength={80} />
            <Toggle label="Visible" size="sm" checked={step.is_active}
              onChange={async (v) => { try { await updateProcessStep(step.id, { is_active: v }); refresh() } catch { toast.error('Error') } }} />
          </div>
        ))}
      </Section>

      {/* TESTIMONIOS */}
      <Section title={`Testimonios (${testimonials.length})`} icon="💬">
        <div className="space-y-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-admin-border bg-white p-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-admin-text">{t.client_name}</p>
                    {t.is_featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                  </div>
                  <p className="text-xs text-admin-muted">{t.event_type}{t.location ? ` · ${t.location}` : ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {!t.is_active && <Badge variant="default">Oculto</Badge>}
                  <button type="button" onClick={() => openEditTestimonial(t)} className="text-xs text-brand-primary hover:underline">Editar</button>
                  <button type="button" onClick={() => setTestDel(t)} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-admin-muted line-clamp-2">{t.content}</p>
            </div>
          ))}
        </div>
        <Button variant="secondary" fullWidth onClick={openNewTestimonial} leftIcon={<Plus className="h-4 w-4" />}>Nuevo testimonio</Button>
      </Section>

      {/* FAQ */}
      <Section title={`Preguntas frecuentes (${faqs.length})`} icon="❓">
        <div className="space-y-2">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-xl border border-admin-border bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-sm font-medium text-admin-text">{faq.question}</p>
                <div className="flex items-center gap-2 shrink-0">
                  {!faq.is_active && <Badge variant="default">Oculta</Badge>}
                  <button type="button" onClick={() => openEditFaq(faq)} className="text-xs text-brand-primary hover:underline">Editar</button>
                  <button type="button" onClick={() => setFaqDel(faq)} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" fullWidth onClick={openNewFaq} leftIcon={<Plus className="h-4 w-4" />}>Nueva pregunta</Button>
      </Section>

      {/* REDES SOCIALES */}
      <Section title="Redes sociales" icon="📱">
        {socialLinks.map((link) => (
          <div key={link.id} className="space-y-2 rounded-xl border border-admin-border bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold capitalize text-admin-text">{link.platform}</p>
              <Toggle checked={link.is_active} size="sm" onChange={async (v) => { try { await updateSocialLink(link.id, { is_active: v }); refresh() } catch { toast.error('Error') } }} />
            </div>
            <Input label="URL" defaultValue={link.url}
              onBlur={async (e) => { if (e.target.value !== link.url) { try { await updateSocialLink(link.id, { url: e.target.value }); toast.success('Guardado'); refresh() } catch { toast.error('Error') } } }}
              placeholder="https://instagram.com/..." />
            <Input label="Usuario (opcional)" defaultValue={link.username ?? ''}
              onBlur={async (e) => { if (e.target.value !== (link.username ?? '')) { try { await updateSocialLink(link.id, { username: e.target.value || undefined }); refresh() } catch { toast.error('Error') } } }}
              placeholder="@beautyballons" />
          </div>
        ))}
      </Section>

      {/* Modales */}
      <Modal open={svcModal} onClose={() => setSvcModal(false)} title={svcEdit ? 'Editar servicio' : 'Nuevo servicio'}>
        <Modal.Body>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input label="Emoji" value={svcForm.icon} onChange={(e) => setSvcForm(f => ({ ...f, icon: e.target.value }))} className="w-20 text-center text-xl" maxLength={4} />
              <div className="flex-1"><Input label="Nombre" value={svcForm.name} onChange={(e) => setSvcForm(f => ({ ...f, name: e.target.value }))} maxLength={40} required /></div>
            </div>
            <Input label="Descripción breve (opcional)" value={svcForm.short_description} onChange={(e) => setSvcForm(f => ({ ...f, short_description: e.target.value }))} maxLength={80} />
            <Textarea label="Mensaje de WhatsApp" value={svcForm.whatsapp_msg} onChange={(e) => setSvcForm(f => ({ ...f, whatsapp_msg: e.target.value }))} maxChars={200} rows={3} required />
            <Toggle label="Destacar en home (máx. 6)" checked={svcForm.is_featured} onChange={(v) => setSvcForm(f => ({ ...f, is_featured: v }))} />
            <Toggle label="Activo (visible en el sitio)" checked={svcForm.is_active} onChange={(v) => setSvcForm(f => ({ ...f, is_active: v }))} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" size="sm" onClick={() => setSvcModal(false)}>Cancelar</Button>
          <Button size="sm" onClick={saveService} loading={svcSaving}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={testModal} onClose={() => setTestModal(false)} title={testEdit ? 'Editar testimonio' : 'Nuevo testimonio'}>
        <Modal.Body>
          <div className="space-y-4">
            <Input label="Nombre del cliente" value={testForm.client_name} onChange={(e) => setTestForm(f => ({ ...f, client_name: e.target.value }))} maxLength={30} required />
            <Input label="Tipo de evento" value={testForm.event_type} onChange={(e) => setTestForm(f => ({ ...f, event_type: e.target.value }))} maxLength={30} placeholder="Baby Shower, Boda..." required />
            <Input label="Municipio (opcional)" value={testForm.location} onChange={(e) => setTestForm(f => ({ ...f, location: e.target.value }))} maxLength={30} />
            <div>
              <p className="mb-1.5 text-sm font-medium text-admin-text">Calificación</p>
              <StarRating value={testForm.rating} onChange={(v) => setTestForm(f => ({ ...f, rating: v }))} size="lg" />
            </div>
            <Textarea label="Reseña" value={testForm.content} onChange={(e) => setTestForm(f => ({ ...f, content: e.target.value }))} maxChars={200} rows={3} required />
            <Toggle label="Destacar en home (solo ⭐⭐⭐⭐⭐)" hint="Solo testimonios de 5 estrellas" checked={testForm.is_featured} onChange={(v) => setTestForm(f => ({ ...f, is_featured: v }))} />
            <Toggle label="Activo" checked={testForm.is_active} onChange={(v) => setTestForm(f => ({ ...f, is_active: v }))} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" size="sm" onClick={() => setTestModal(false)}>Cancelar</Button>
          <Button size="sm" onClick={saveTestimonial} loading={testSaving}>Guardar</Button>
        </Modal.Footer>
      </Modal>

      <Modal open={faqModal} onClose={() => setFaqModal(false)} title={faqEdit ? 'Editar pregunta' : 'Nueva pregunta'}>
        <Modal.Body>
          <div className="space-y-4">
            <Input label="Pregunta" value={faqForm.question} onChange={(e) => setFaqForm(f => ({ ...f, question: e.target.value }))} maxLength={120} required />
            <Textarea label="Respuesta" value={faqForm.answer} onChange={(e) => setFaqForm(f => ({ ...f, answer: e.target.value }))} maxChars={400} rows={4} required />
            <Toggle label="Agregar botón de WhatsApp en la respuesta" checked={faqForm.cta_in_answer} onChange={(v) => setFaqForm(f => ({ ...f, cta_in_answer: v }))} />
            <Toggle label="Activa (visible en el sitio)" checked={faqForm.is_active} onChange={(v) => setFaqForm(f => ({ ...f, is_active: v }))} />
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
        title="¿Eliminar testimonio?" description="Esta reseña se eliminará permanentemente." confirmLabel="Eliminar" />

      <ConfirmDialog open={!!faqDel} onClose={() => setFaqDel(null)}
        onConfirm={async () => { try { await deleteFaq(faqDel!.id); toast.success('Eliminada'); setFaqDel(null); refresh() } catch { toast.error('Error') } }}
        title="¿Eliminar esta pregunta?" description="Se eliminará permanentemente." confirmLabel="Eliminar" />
    </div>
  )
}
