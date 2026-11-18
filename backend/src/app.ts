import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { insert, readAll, remove, update } from './storage.ts'

export const app = new Hono()

app.use('*', cors())

// Body of a request as a plain object, or undefined when it is not valid JSON object.
async function readBody(request: Request) {
  const body = await request.json().catch(() => undefined)
  return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : undefined
}

app.get('/objects', (c) => c.json(readAll()))

app.post('/objects', async (c) => {
  const body = await readBody(c.req.raw)
  if (typeof body?.id !== 'string' || body.id === '') return c.json({ error: 'id is required' }, 400)
  if (!insert({ ...body, id: body.id })) return c.json({ error: 'id already exists' }, 409)
  return c.json(body, 201)
})

app.patch('/objects/:id', async (c) => {
  const body = await readBody(c.req.raw)
  if (!body) return c.json({ error: 'invalid JSON body' }, 400)
  const updated = update(c.req.param('id'), body)
  return updated ? c.json(updated) : c.json({ error: 'not found' }, 404)
})

app.delete('/objects/:id', (c) => (remove(c.req.param('id')) ? c.body(null, 204) : c.json({ error: 'not found' }, 404)))
