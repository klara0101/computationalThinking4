import type { AttributeKey, FontSize } from '~/types/board-object'

export interface Attribute {
  key: AttributeKey
  label: string
  editor: 'swatches' | 'size' | 'border' | 'toggle'
}

// Which editor belongs to which attribute. A variant only gets the editors of the attributes it lists.
export const ATTRIBUTES: Attribute[] = [
  { key: 'color', label: 'Farbe', editor: 'swatches' },
  { key: 'fontSize', label: 'Schriftgröße', editor: 'size' },
  { key: 'border', label: 'Border', editor: 'border' },
  { key: 'bold', label: 'Fett', editor: 'toggle' },
]

export const FONT_SIZES: { id: FontSize; label: string; class: string }[] = [
  { id: 'sm', label: 'S', class: 'text-base' },
  { id: 'md', label: 'M', class: 'text-lg' },
  { id: 'lg', label: 'L', class: 'text-2xl' },
]

export const BORDER_WIDTHS = [0, 1, 2, 4]

// Border shades (light to dark) follow the fill color, so the border always matches the object.
const SHADES: Record<string, { border: string; swatch: string }[]> = {
  'bg-yellow-200': [
    { border: 'border-yellow-400', swatch: 'bg-yellow-400' },
    { border: 'border-yellow-600', swatch: 'bg-yellow-600' },
    { border: 'border-yellow-800', swatch: 'bg-yellow-800' },
  ],
  'bg-pink-200': [
    { border: 'border-pink-400', swatch: 'bg-pink-400' },
    { border: 'border-pink-600', swatch: 'bg-pink-600' },
    { border: 'border-pink-800', swatch: 'bg-pink-800' },
  ],
  'bg-green-200': [
    { border: 'border-green-400', swatch: 'bg-green-400' },
    { border: 'border-green-600', swatch: 'bg-green-600' },
    { border: 'border-green-800', swatch: 'bg-green-800' },
  ],
  'bg-sky-200': [
    { border: 'border-sky-400', swatch: 'bg-sky-400' },
    { border: 'border-sky-600', swatch: 'bg-sky-600' },
    { border: 'border-sky-800', swatch: 'bg-sky-800' },
  ],
  'bg-violet-200': [
    { border: 'border-violet-400', swatch: 'bg-violet-400' },
    { border: 'border-violet-600', swatch: 'bg-violet-600' },
    { border: 'border-violet-800', swatch: 'bg-violet-800' },
  ],
  'bg-orange-200': [
    { border: 'border-orange-400', swatch: 'bg-orange-400' },
    { border: 'border-orange-600', swatch: 'bg-orange-600' },
    { border: 'border-orange-800', swatch: 'bg-orange-800' },
  ],
}

const NEUTRAL_SHADES = [
  { border: 'border-neutral-400', swatch: 'bg-neutral-400' },
  { border: 'border-neutral-600', swatch: 'bg-neutral-600' },
  { border: 'border-neutral-800', swatch: 'bg-neutral-800' },
]

export function borderShades(fill?: string) {
  return (fill && SHADES[fill]) || NEUTRAL_SHADES
}
