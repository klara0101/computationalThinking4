<script setup lang="ts">
import { Trash2 as TrashIcon } from '@lucide/vue'
import type { Board } from '~/types/board'

// The board list: create a board, open one, or delete one together with its objects.
const api = useApi()
const boards = ref(await api<Board[]>('/boards'))
const name = ref('')

async function create() {
  const board = await api<Board>('/boards', { method: 'POST', body: { id: crypto.randomUUID(), name: name.value } })
  await navigateTo(`/boards/${board.id}`)
}

async function remove(board: Board) {
  if (!confirm(`Board „${board.name}“ und alle Objekte darauf löschen?`)) return
  await api(`/boards/${board.id}`, { method: 'DELETE' })
  boards.value = boards.value.filter(existing => existing.id !== board.id)
}
</script>

<template>
  <main class="mx-auto max-w-xl px-4 py-12">
    <h1 class="mb-6 text-2xl font-semibold">Boards</h1>

    <form class="mb-8 flex gap-2" @submit.prevent="create">
      <input
        v-model="name"
        class="h-8 flex-1 rounded-lg border px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder="Name des neuen Boards"
      >
      <Button type="submit" :disabled="!name.trim()">Board anlegen</Button>
    </form>

    <ul class="divide-y rounded-xl border">
      <li v-for="board in boards" :key="board.id" class="flex items-center gap-2 px-4 py-2">
        <NuxtLink :to="`/boards/${board.id}`" class="flex-1 py-1 hover:underline">{{ board.name }}</NuxtLink>
        <Button variant="ghost" size="icon-sm" :aria-label="`Board ${board.name} löschen`" @click="remove(board)">
          <TrashIcon />
        </Button>
      </li>
      <li v-if="!boards.length" class="px-4 py-3 text-sm text-muted-foreground">Noch keine Boards.</li>
    </ul>
  </main>
</template>
