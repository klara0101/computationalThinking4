<script setup lang="ts">
import type { VariantId } from '~/types/board-object'

defineEmits<{ create: [variant: VariantId, color?: string] }>()

// Swatches peek out of the bar's bottom edge; post-its are tilted a little.
const TILTS = ['-rotate-3', 'rotate-2', '-rotate-2']
</script>

<template>
  <div
    class="fixed left-1/2 bottom-6 -translate-x-1/2 flex h-[72px] items-stretch overflow-hidden rounded-3xl border bg-background px-8 shadow-xl"
    @pointerdown.stop
  >
    <template v-for="(variant, index) in VARIANTS" :key="variant.id">
      <div v-if="index > 0" class="my-3 w-px bg-border" />
      <div class="flex items-center gap-4 px-8">
        <template v-if="variant.colors">
          <button
            v-for="(color, i) in variant.colors"
            :key="color"
            :title="variant.label"
            class="mt-6 size-14 border transition-transform hover:-translate-y-2"
            :class="[color, variant.id === 'circle' ? 'rounded-full' : `rounded-sm ${TILTS[i]}`]"
            @click="$emit('create', variant.id, color)"
          />
        </template>
        <button
          v-else
          :title="variant.label"
          class="px-4 font-serif text-4xl transition-transform hover:-translate-y-1"
          @click="$emit('create', variant.id)"
        >
          T
        </button>
      </div>
    </template>
  </div>
</template>
