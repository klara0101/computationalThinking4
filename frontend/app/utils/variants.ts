import type { AttributeKey, VariantId } from '~/types/board-object'

export interface Variant {
  id: VariantId
  label: string
  size: { width: number; height: number }
  baseClass: string
  colors?: string[]
  attributes: AttributeKey[]
  autoGrow: boolean
}

export const VARIANTS: Variant[] = [
  {
    id: 'note',
    label: 'Post-it',
    size: { width: 192, height: 192 },
    baseClass: 'shadow-md',
    colors: ['bg-yellow-200', 'bg-pink-200', 'bg-green-200'],
    attributes: ['color', 'fontSize', 'bold'],
    autoGrow: true,
  },
  {
    id: 'text',
    label: 'Text',
    size: { width: 192, height: 72 },
    baseClass: '',
    attributes: ['fontSize', 'bold'],
    autoGrow: true,
  },
  {
    id: 'circle',
    label: 'Kreis',
    size: { width: 192, height: 192 },
    baseClass: 'rounded-full shadow-md',
    colors: ['bg-sky-200', 'bg-violet-200', 'bg-orange-200'],
    attributes: ['color', 'fontSize', 'border', 'bold'],
    autoGrow: false,
  },
]

export function getVariant(id: VariantId) {
  return VARIANTS.find((variant) => variant.id === id)!
}
