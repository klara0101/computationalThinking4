<script setup lang="ts">
import type { VariantId } from '~/types/board-object'

const { objects, addObject, updateObject } = useBoard()
const selectedId = ref<string | null>(null)
const selectedObject = computed(() => objects.value.find((object) => object.id === selectedId.value))

function create(variant: VariantId, color?: string) {
  selectedId.value = addObject(variant, color)
}

useShortcuts(selectedId)
</script>

<template>
  <InfiniteCanvas @pointerdown="selectedId = null">
    <BoardObject
      v-for="object in objects"
      :key="object.id"
      :object="object"
      :selected="selectedId === object.id"
      @select="selectedId = object.id"
      @update="updateObject(object.id, $event)"
    />
    <ContextBar
      v-if="selectedObject"
      class="absolute -translate-y-full -mt-3"
      :style="{ left: `${selectedObject.x}px`, top: `${selectedObject.y}px` }"
      :object="selectedObject"
      @update="updateObject(selectedObject.id, $event)"
    />
  </InfiniteCanvas>
  <Toolbar @create="create" />
</template>
