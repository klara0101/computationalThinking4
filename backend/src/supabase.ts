process.loadEnvFile(new URL('../.env', import.meta.url).pathname)

// Tables live in Supabase and are reached through its REST API.
// The storage modules are the only places that use this.
const HEADERS = {
  apikey: process.env.SUPABASE_SECRET_KEY!,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

export async function request(table: string, query: string, init: RequestInit = {}) {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}${query}`, { ...init, headers: HEADERS })
  if (!response.ok) throw new Error(`Supabase: ${response.status} ${await response.text()}`)
  const rows: Record<string, unknown>[] = await response.json()
  return rows
}
