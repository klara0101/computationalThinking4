import { request as supabase } from './supabase.js'

// The backend treats objects as plain JSON; it only relies on every object having an id.
export type BoardObject = { id: string } & Record<string, unknown>

// Objects live in the Supabase table "objects"; every object belongs to one board.

// The frontend says fontSize, the table says font_size.
function toRow(object: Record<string, unknown>) {
  const { fontSize, ...rest } = object
  return fontSize === undefined ? rest : { ...rest, font_size: fontSize }
}

// Leave out created_at, board_id and empty columns, so objects look exactly like the frontend sent them.
function fromRow(row: Record<string, unknown>) {
  const { font_size, created_at, board_id, ...rest } = row
  const object = Object.fromEntries(Object.entries(rest).filter(([, value]) => value !== null))
  return (font_size === null ? object : { ...object, fontSize: font_size }) as BoardObject
}

async function request(query: string, init: RequestInit = {}) {
  return (await supabase('objects', query, init)).map(fromRow)
}

function inBoard(boardId: string, id: string) {
  return `?id=eq.${encodeURIComponent(id)}&board_id=eq.${encodeURIComponent(boardId)}`
}

export async function listObjects(boardId: string) {
  return request(`?board_id=eq.${encodeURIComponent(boardId)}&order=created_at`)
}

export async function insertObject(boardId: string, object: BoardObject) {
  const body = JSON.stringify({ ...toRow(object), board_id: boardId })
  const [inserted] = await request('', { method: 'POST', body })
  return inserted
}

export async function updateObject(boardId: string, id: string, changes: Record<string, unknown>) {
  const { id: _, board_id: __, ...rest } = changes
  const [updated] = await request(inBoard(boardId, id), { method: 'PATCH', body: JSON.stringify(toRow(rest)) })
  return updated
}

export async function deleteObject(boardId: string, id: string) {
  const deleted = await request(inBoard(boardId, id), { method: 'DELETE' })
  return deleted.length > 0
}
