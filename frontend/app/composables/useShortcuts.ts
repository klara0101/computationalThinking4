import type { BoardObject } from '~/types/board-object'

// Runs the first shortcut from SHORTCUTS that matches a key press, except while typing in a text field.
export function useShortcuts(selectedId: Ref<string | null>) {
  const { objects, addCopy, updateObject, removeObject } = useBoard()
  const clipboard = ref<BoardObject | null>(null)

  function onKeyDown(event: KeyboardEvent) {
    if (event.target instanceof HTMLTextAreaElement) return
    const shortcut = SHORTCUTS.find((candidate) => candidate.match(event))
    if (!shortcut) return
    event.preventDefault()
    shortcut.run({
      selected: objects.value.find((object) => object.id === selectedId.value),
      clipboard,
      select: (id) => (selectedId.value = id),
      addCopy,
      updateObject,
      removeObject,
    })
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
}
