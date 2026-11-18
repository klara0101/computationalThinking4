import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

const API = 'http://localhost:3001/objects'
const PATCH_DELAY = 300

function send(method: string, path: string, body?: unknown) {
  fetch(`${API}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(error => console.error(`${method} ${API}${path} failed`, error))
}

// Changes per object wait here until the user paused for PATCH_DELAY, then they go out as one PATCH.
const pending = new Map<string, { changes: Record<string, unknown>; timer: ReturnType<typeof setTimeout> }>()

function queuePatch(id: string, changes: object) {
  const entry = pending.get(id)
  if (entry) clearTimeout(entry.timer)
  const merged = { ...entry?.changes, ...changes }
  const timer = setTimeout(() => {
    pending.delete(id)
    send('PATCH', `/${id}`, merged)
  }, PATCH_DELAY)
  pending.set(id, { changes: merged, timer })
}

function discardPending(id: string) {
  clearTimeout(pending.get(id)?.timer)
  pending.delete(id)
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])
  const loaded = useState('objects-loaded', () => false)

  // Loads the board from the backend once, in the browser only (the three callers of useBoard share the flag).
  if (import.meta.client && !loaded.value) {
    loaded.value = true
    fetch(API)
      .then(response => response.json())
      .then((stored: BoardObject[]) => (objects.value = stored))
      .catch(error => console.error('Could not load board', error))
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    const object = { ...defaults, ...template, id, x, y } as BoardObject
    objects.value = [...objects.value, object]
    send('POST', '', object)
    return id
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    const id = crypto.randomUUID()
    const copy = { ...source, id }
    objects.value = [...objects.value, copy]
    send('POST', '', copy)
    return id
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    discardPending(id)
    send('DELETE', `/${id}`)
  }

  function updateObject(id: string, changes: Partial<Rect> & StyleChanges & { text?: string }) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
    queuePatch(id, changes)
  }

  function moveObject(id: string, x: number, y: number) {
    updateObject(id, { x, y })
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}
