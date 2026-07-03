'use client'

import { useState } from 'react'
import { cn, isValidHexColor } from '@/lib/utils'

interface ColorPickerProps {
  value:     string
  onChange:  (value: string) => void
  label?:    string
  error?:    string
  presets?:  string[]
}

const DEFAULT_PRESETS = [
  '#D4618C', '#9B6FD4', '#F4A261', '#26A69A',
  '#EF5350', '#42A5F5', '#66BB6A', '#FFA726',
  '#000000', '#FFFFFF', '#1C1B1F', '#FFFBFE',
]

export function ColorPicker({
  value,
  onChange,
  label,
  error,
  presets = DEFAULT_PRESETS,
}: ColorPickerProps) {
  const [localValue, setLocalValue] = useState(value)

  const handleTextChange = (raw: string) => {
    setLocalValue(raw)
    const hex = raw.startsWith('#') ? raw : `#${raw}`
    if (isValidHexColor(hex)) {
      onChange(hex)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-admin-text">{label}</span>
      )}

      {/* Swatch + input */}
      <div className="flex items-center gap-2">
        <label className="relative cursor-pointer">
          <div
            className="h-10 w-10 rounded-lg border-2 border-admin-border shadow-inner-sm"
            style={{ backgroundColor: isValidHexColor(value) ? value : '#ccc' }}
          />
          <input
            type="color"
            value={isValidHexColor(value) ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Seleccionar color"
          />
        </label>

        <input
          type="text"
          value={localValue}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={() => setLocalValue(value)}
          placeholder="#000000"
          maxLength={7}
          className={cn(
            'h-10 w-28 rounded-xl border px-3 font-mono text-sm uppercase',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary',
            error ? 'border-red-400' : 'border-admin-border'
          )}
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => { onChange(preset); setLocalValue(preset) }}
            title={preset}
            className={cn(
              'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
              value === preset ? 'border-admin-text scale-110' : 'border-transparent'
            )}
            style={{ backgroundColor: preset }}
            aria-label={`Color ${preset}`}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
