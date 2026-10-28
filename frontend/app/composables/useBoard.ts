import type { BoardObject, VariantId } from '~/types/board-object'

type Patch = Partial<Omit<BoardObject, 'id' | 'variant'>>

// Central board state. Objects can only be changed through the functions returned here.
export function useBoard() {
  const objects = useState<BoardObject[]>('board-objects', () => [
    { id: crypto.randomUUID(), variant: 'note', x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!', color: 'bg-yellow-200' },
  ])

  // New objects are staggered so they do not stack exactly on top of each other.
  function addObject(variant: VariantId, color?: string) {
    const offset = objects.value.length * GRID_SIZE
    const object: BoardObject = {
      id: crypto.randomUUID(),
      variant,
      x: 120 + offset,
      y: 120 + offset,
      ...getVariant(variant).size,
      text: '',
      color,
      fontSize: 'md',
      bold: false,
      borderWidth: 0,
      borderShade: 1,
    }
    objects.value = [...objects.value, object]
    return object.id
  }

  function addCopy(source: BoardObject) {
    const copy = { ...source, id: crypto.randomUUID(), x: source.x + GRID_SIZE, y: source.y + GRID_SIZE }
    objects.value = [...objects.value, copy]
    return copy.id
  }

  function updateObject(id: string, patch: Patch) {
    objects.value = objects.value.map((object) => (object.id === id ? { ...object, ...patch } : object))
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter((object) => object.id !== id)
  }

  return { objects: readonly(objects), addObject, addCopy, updateObject, removeObject }
}
