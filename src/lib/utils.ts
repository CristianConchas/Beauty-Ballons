import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind con soporte para valores condicionales.
 * clsx maneja condiciones, twMerge resuelve conflictos de Tailwind.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Convierte texto a slug URL-safe en español.
 * Ej: "XV Años" → "xv-anos"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Trunca un texto a maxLength caracteres y agrega "…".
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 1) + '…'
}

/**
 * Formatea una fecha en español.
 * Ej: "24 de junio de 2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-MX', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

/**
 * Formatea una fecha de forma relativa.
 * Ej: "Hace 5 min", "Hace 2 días"
 */
export function formatRelativeDate(date: Date | string): string {
  const d     = typeof date === 'string' ? new Date(date) : date
  const now   = new Date()
  const diffMs    = now.getTime() - d.getTime()
  const diffMins  = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays  = Math.floor(diffHours / 24)

  if (diffMins  < 1)  return 'Justo ahora'
  if (diffMins  < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} hr${diffHours > 1 ? 's' : ''}`
  if (diffDays  < 7)  return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`

  return formatDate(d)
}

/**
 * Devuelve el año actual para el copyright del footer.
 */
export function currentYear(): number {
  return new Date().getFullYear()
}

/**
 * Valida si un string es un color HEX válido (#FFF o #FFFFFF).
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(color)
}

/**
 * Extrae las iniciales de un nombre (máximo 2 letras).
 * Ej: "Ana García" → "AG"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Calcula el aspect ratio de una imagen para el masonry layout.
 */
export function getAspectRatio(width: number, height: number): number {
  return width / height
}
