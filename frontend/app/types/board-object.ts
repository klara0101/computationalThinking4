export type VariantId = 'note' | 'text' | 'circle'
export type AttributeKey = 'color' | 'fontSize' | 'border' | 'bold'
export type FontSize = 'sm' | 'md' | 'lg'

export interface BoardObject {
  id: string
  variant: VariantId
  x: number
  y: number
  width: number
  height: number
  text: string
  color?: string
  fontSize?: FontSize
  bold?: boolean
  borderWidth?: number
  borderShade?: number
}
