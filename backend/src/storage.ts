import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export type StoredObject = { id: string; [key: string]: unknown }

const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'board.json')

export function readAll(): StoredObject[] {
  if (!existsSync(FILE)) return []
  return JSON.parse(readFileSync(FILE, 'utf8'))
}

// Writes to a temp file first so a crash never leaves a half-written board.json.
function writeAll(objects: StoredObject[]) {
  mkdirSync(dirname(FILE), { recursive: true })
  const tmp = `${FILE}.tmp`
  writeFileSync(tmp, JSON.stringify(objects, null, 2))
  renameSync(tmp, FILE)
}

// Returns false when the id already exists.
export function insert(object: StoredObject) {
  const objects = readAll()
  if (objects.some((existing) => existing.id === object.id)) return false
  writeAll([...objects, object])
  return true
}

// Returns the updated object, or undefined when the id is unknown. The id itself cannot change.
export function update(id: string, patch: Record<string, unknown>) {
  const objects = readAll()
  const index = objects.findIndex((object) => object.id === id)
  if (index === -1) return undefined
  const updated = { ...objects[index], ...patch, id }
  objects[index] = updated
  writeAll(objects)
  return updated
}

// Returns false when the id is unknown.
export function remove(id: string) {
  const objects = readAll()
  if (!objects.some((object) => object.id === id)) return false
  writeAll(objects.filter((object) => object.id !== id))
  return true
}
