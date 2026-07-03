'use client'

import type { ChangeEvent } from 'react'
import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { Star, Trash2, Eye, EyeOff, Plus } from 'lucide-react'
import type { PortfolioPhoto, PortfolioCategory } from '@/types/content.types'
import { updatePhoto, deletePhoto, getUploadSignedUrl, createPhoto } from '@/lib/actions/portfolio'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { NoPhotosState } from '@/components/ui/EmptyState'
import { STORAGE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  photos:     PortfolioPhoto[]
  categories: PortfolioCategory[]
}

export function PortfolioAdminClient({ photos, categories }: Props) {
  const router              = useRouter()
  const [, startT]          = useTransition()
  const [filter, setFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing]     = useState<PortfolioPhoto | null>(null)
  const [deleting, setDeleting]   = useState<PortfolioPhoto | null>(null)
  const [editForm, setEditForm]   = useState({ alt_text: '', caption: '', category_id: '' })

  const catOptions = [
    { value: 'all', label: 'Todas' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ]

  const visible = filter === 'all'
    ? photos
    : photos.filter((p) => p.category_id === filter)

  // ── Upload desde celular o desktop ──────────────────────
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []) as File[]
    if (!files.length) return

    setUploading(true)

    for (const file of files) {
      try {
        // Leer dimensiones de la imagen
        const dimensions = await getImageDimensions(file)

        // Obtener URL firmada del servidor
        const { signedUrl, path } = await getUploadSignedUrl(file.name, file.type)

        // Subir directo a Supabase Storage desde el browser
        const uploadRes = await fetch(signedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })

        if (!uploadRes.ok) throw new Error('Error al subir archivo')

        // Construir URL pública
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE.bucket}/${path}`

        // Usar la categoría seleccionada en el filtro, o la primera disponible
        const targetCategoryId = (filter !== 'all' ? filter : categories[0]?.id) ?? ''
        await createPhoto({
          image_url:     publicUrl,
          thumbnail_url: publicUrl,
          category_id:   targetCategoryId,
          alt_text:      file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          width:         dimensions.width,
          height:        dimensions.height,
          is_featured:   true,  // destacar automáticamente para que salga en el home
          is_active:     true,
          sort_order:    photos.length,
        })

        toast.success(`${file.name} subida correctamente`)
      } catch (err) {
        toast.error(`Error al subir ${file.name}`)
        console.error(err)
      }
    }

    setUploading(false)
    startT(() => router.refresh())
    e.target.value = ''
  }

  async function handleToggleFeatured(photo: PortfolioPhoto) {
    try {
      await updatePhoto(photo.id, { is_featured: !photo.is_featured })
      toast.success(photo.is_featured ? 'Quitada del inicio' : 'Añadida al inicio')
      startT(() => router.refresh())
    } catch (err: any) {
      toast.error(err.message ?? 'Error al actualizar')
    }
  }

  async function handleToggleActive(photo: PortfolioPhoto) {
    try {
      await updatePhoto(photo.id, { is_active: !photo.is_active })
      toast.success(photo.is_active ? 'Foto ocultada' : 'Foto visible')
      startT(() => router.refresh())
    } catch {
      toast.error('Error al actualizar')
    }
  }

  function openEdit(photo: PortfolioPhoto) {
    setEditing(photo)
    setEditForm({
      alt_text:    photo.alt_text,
      caption:     photo.caption ?? '',
      category_id: photo.category_id,
    })
  }

  async function saveEdit() {
    if (!editing) return
    try {
      await updatePhoto(editing.id, editForm)
      toast.success('Foto actualizada')
      setEditing(null)
      startT(() => router.refresh())
    } catch {
      toast.error('Error al guardar')
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      await deletePhoto(deleting.id, deleting.image_url)
      toast.success('Foto eliminada')
      setDeleting(null)
      startT(() => router.refresh())
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <>
      {/* Header con filtros y botón upload */}
      <div className="sticky top-14 z-20 border-b border-admin-border bg-white px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-admin-muted">{visible.length} foto{visible.length !== 1 ? 's' : ''}</p>
          <label className={cn(
            'flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity',
            uploading ? 'bg-brand-primary/60 pointer-events-none' : 'bg-brand-primary hover:opacity-90'
          )}>
            {uploading ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" /> Subiendo...</>
            ) : (
              <><Plus className="h-4 w-4" /> Subir fotos</>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="flex gap-2 overflow-x-auto scroll-hide">
          {catOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
                filter === opt.value
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-admin-muted hover:bg-slate-200'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de fotos */}
      <div className="p-4">
        {visible.length === 0 ? (
          <NoPhotosState />
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {visible.map((photo) => (
              <div key={photo.id} className="relative group">
                <button
                  onClick={() => openEdit(photo)}
                  className="relative w-full overflow-hidden rounded-xl aspect-square"
                >
                  <Image
                    src={photo.thumbnail_url || photo.image_url}
                    alt={photo.alt_text}
                    fill
                    className={cn(
                      'object-cover transition-opacity',
                      !photo.is_active && 'opacity-40'
                    )}
                    sizes="(max-width: 640px) 33vw, 25vw"
                  />
                  {photo.is_featured && (
                    <div className="absolute top-1 left-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </div>
                  )}
                </button>

                {/* Acciones rápidas */}
                <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleFeatured(photo)}
                    className="rounded-lg bg-white/90 p-1 shadow-sm"
                    title={photo.is_featured ? 'Quitar del inicio' : 'Destacar en inicio'}
                  >
                    <Star className={cn('h-3.5 w-3.5', photo.is_featured ? 'fill-amber-400 text-amber-400' : 'text-slate-400')} />
                  </button>
                  <button
                    onClick={() => handleToggleActive(photo)}
                    className="rounded-lg bg-white/90 p-1 shadow-sm"
                    title={photo.is_active ? 'Ocultar' : 'Mostrar'}
                  >
                    {photo.is_active
                      ? <Eye className="h-3.5 w-3.5 text-slate-400" />
                      : <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                    }
                  </button>
                  <button
                    onClick={() => setDeleting(photo)}
                    className="rounded-lg bg-white/90 p-1 shadow-sm"
                    title="Eliminar"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar foto">
        {editing && (
          <>
            <Modal.Body>
              <div className="mb-4 overflow-hidden rounded-xl aspect-video relative">
                <Image src={editing.image_url} alt={editing.alt_text} fill className="object-cover" />
              </div>
              <div className="space-y-4">
                <Select
                  label="Categoría"
                  value={editForm.category_id}
                  onChange={(e) => setEditForm((f) => ({ ...f, category_id: e.target.value }))}
                  options={categories.map((c) => ({ value: c.id, label: c.name }))}
                />
                <Input
                  label="Texto alternativo (SEO)"
                  value={editForm.alt_text}
                  onChange={(e) => setEditForm((f) => ({ ...f, alt_text: e.target.value }))}
                  placeholder="Arco de globos para boda en Zapopan"
                  maxLength={100}
                />
                <Input
                  label="Descripción (opcional)"
                  value={editForm.caption}
                  onChange={(e) => setEditForm((f) => ({ ...f, caption: e.target.value }))}
                  placeholder="Boda · Zapopan · 2024"
                  maxLength={60}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button size="sm" onClick={saveEdit}>Guardar</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Confirmar eliminación */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar esta foto?"
        description="Esta acción es permanente. La foto se eliminará del portafolio y del almacenamiento."
        confirmLabel="Eliminar"
      />
    </>
  )
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      resolve({ width: 800, height: 600 })
      URL.revokeObjectURL(url)
    }
    img.src = url
  })
}
