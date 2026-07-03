'use client'

import type { DragEvent } from 'react'
import { useCallback, useRef, useState } from 'react'

import { Upload, X, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UPLOAD_LIMITS } from '@/lib/constants'

interface ImageUploadProps {
  value?:      string    // URL de imagen existente
  onChange:    (file: File) => void
  onRemove?:   () => void
  loading?:    boolean
  error?:      string
  label?:      string
  accept?:     string
  multiple?:   boolean
  onMultiple?: (files: File[]) => void
  className?:  string
  compact?:    boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  loading  = false,
  error,
  label,
  accept   = 'image/*',
  multiple = false,
  onMultiple,
  className,
  compact  = false,
}: ImageUploadProps) {
  const inputRef            = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    if (multiple && onMultiple) {
      const valid = Array.from(files).filter((f) => {
        if (!UPLOAD_LIMITS.acceptedMimeTypes.includes(f.type)) return false
        if (f.size > UPLOAD_LIMITS.maxFileSizeBytes) return false
        return true
      })
      onMultiple(valid)
    } else {
      const file = files[0]
      if (file && UPLOAD_LIMITS.acceptedMimeTypes.includes(file.type)) {
        onChange(file)
      }
    }
  }, [multiple, onMultiple, onChange])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-sm font-medium text-admin-text">{label}</span>
      )}

      {/* Preview de imagen existente */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-full rounded-xl object-cover"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
              aria-label="Eliminar imagen"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Zona de drop */}
      {!value && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed',
            'cursor-pointer transition-all duration-200',
            compact ? 'py-6' : 'py-10',
            dragOver
              ? 'border-brand-primary bg-brand-primary/5'
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-admin-border bg-slate-50 hover:border-brand-primary hover:bg-brand-primary/5',
            loading && 'pointer-events-none opacity-60'
          )}
        >
          <div className="mb-2 rounded-full bg-white p-3 shadow-card">
            <Camera className="h-5 w-5 text-admin-muted" />
          </div>
          <p className="text-sm font-medium text-admin-text">
            {multiple ? 'Toca para seleccionar fotos' : 'Toca para subir imagen'}
          </p>
          <p className="mt-0.5 text-xs text-admin-muted">
            JPG, PNG, WEBP · Máx 20MB
          </p>
        </div>
      )}

      {/* Botón para cambiar imagen existente */}
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-xs text-brand-primary hover:underline"
        >
          <Upload className="h-3 w-3" />
          Cambiar imagen
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        // Permite acceso a la cámara del celular
        capture="environment"
      />

      {error && (
        <p className="text-xs text-red-500" role="alert">{error}</p>
      )}
    </div>
  )
}
