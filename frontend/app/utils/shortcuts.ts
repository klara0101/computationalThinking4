import type { BoardObject } from '~/types/board-object'

export interface ShortcutContext {
  selected: BoardObject | undefined
  clipboard: Ref<BoardObject | null>
  select: (id: string | null) => void
  addCopy: (object: BoardObject) => string
  updateObject: (id: string, patch: Partial<BoardObject>) => void
  removeObject: (id: string) => void
}

interface Shortcut {
  label: string
  keys: string
  match: (event: KeyboardEvent) => boolean
  run: (ctx: ShortcutContext) => void
}

const cmd = (key: string) => (event: KeyboardEvent) => (event.metaKey || event.ctrlKey) && event.key === key
const plain = (...keys: string[]) => (event: KeyboardEvent) => !event.metaKey && !event.ctrlKey && keys.includes(event.key)

function nudge(key: string, dx: number, dy: number): Shortcut {
  return {
    label: `Verschieben (${key})`,
    keys: key,
    match: plain(key),
    run: ({ selected, updateObject }) => {
      if (!selected) return
      const step = GRID_SIZE
      updateObject(selected.id, { x: selected.x + dx * step, y: selected.y + dy * step })
    },
  }
}

function copy({ selected, clipboard }: ShortcutContext) {
  if (selected) clipboard.value = { ...selected }
}

export const SHORTCUTS: Shortcut[] = [
  { label: 'Kopieren', keys: '⌘C', match: cmd('c'), run: copy },
  {
    label: 'Ausschneiden',
    keys: '⌘X',
    match: cmd('x'),
    run: (ctx) => {
      if (!ctx.selected) return
      copy(ctx)
      ctx.removeObject(ctx.selected.id)
      ctx.select(null)
    },
  },
  {
    label: 'Einfügen',
    keys: '⌘V',
    match: cmd('v'),
    run: ({ clipboard, addCopy, select }) => {
      const source = clipboard.value
      if (!source) return
      select(addCopy(source))
      // Next paste lands one grid step further, not on top of this one.
      clipboard.value = { ...source, x: source.x + GRID_SIZE, y: source.y + GRID_SIZE }
    },
  },
  {
    label: 'Duplizieren',
    keys: '⌘D',
    match: cmd('d'),
    run: ({ selected, addCopy, select }) => {
      if (selected) select(addCopy(selected))
    },
  },
  {
    label: 'Löschen',
    keys: '⌫',
    match: plain('Backspace', 'Delete'),
    run: ({ selected, removeObject, select }) => {
      if (!selected) return
      removeObject(selected.id)
      select(null)
    },
  },
  { label: 'Auswahl aufheben', keys: 'Esc', match: plain('Escape'), run: ({ select }) => select(null) },
  nudge('ArrowLeft', -1, 0),
  nudge('ArrowRight', 1, 0),
  nudge('ArrowUp', 0, -1),
  nudge('ArrowDown', 0, 1),
]
