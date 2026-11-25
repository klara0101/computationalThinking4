import { Hono } from 'hono'
import { deleteBoard, getBoard, insertBoard, listBoards } from './boardStorage.js'

// REST routes for the boards themselves. Their objects are served under /boards/:boardId/objects.
export const boards = new Hono()

boards.get('/', async c => c.json(await listBoards()))

boards.post('/', async (c) => {
  const { id, name } = await c.req.json()
  if (typeof id !== 'string') return c.json({ error: 'Board needs an id' }, 400)
  const trimmed = typeof name === 'string' ? name.trim() : ''
  if (!trimmed) return c.json({ error: 'Board needs a name' }, 400)
  if (await getBoard(id)) return c.json({ error: 'A board with this id already exists' }, 409)
  return c.json(await insertBoard({ id, name: trimmed }), 201)
})

boards.get('/:id', async (c) => {
  const board = await getBoard(c.req.param('id'))
  if (!board) return c.json({ error: 'Board not found' }, 404)
  return c.json(board)
})

boards.delete('/:id', async (c) => {
  const deleted = await deleteBoard(c.req.param('id'))
  if (!deleted) return c.json({ error: 'Board not found' }, 404)
  return c.body(null, 204)
})
