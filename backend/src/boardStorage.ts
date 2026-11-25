import { request } from './supabase.js'

export type Board = { id: string; name: string }

// Boards live in the Supabase table "boards". Deleting a board also deletes its objects (on delete cascade).

function fromRow({ id, name }: Record<string, unknown>) {
  return { id, name } as Board
}

function byId(id: string) {
  return `?id=eq.${encodeURIComponent(id)}`
}

export async function listBoards() {
  return (await request('boards', '?order=created_at')).map(fromRow)
}

export async function getBoard(id: string) {
  const [board] = await request('boards', byId(id))
  return board && fromRow(board)
}

export async function insertBoard(board: Board) {
  const [inserted] = await request('boards', '', { method: 'POST', body: JSON.stringify(board) })
  return fromRow(inserted!)
}

export async function deleteBoard(id: string) {
  const deleted = await request('boards', byId(id), { method: 'DELETE' })
  return deleted.length > 0
}
