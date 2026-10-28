<script setup lang="ts">
import type { BoardObject } from '~/types/board-object'

const props = defineProps<{ object: BoardObject }>()
const emit = defineEmits<{ update: [patch: Partial<BoardObject>] }>()

const variant = computed(() => getVariant(props.object.variant))
const attributes = computed(() => ATTRIBUTES.filter((attribute) => variant.value.attributes.includes(attribute.key)))

const button = 'flex size-7 items-center justify-center rounded-md text-sm hover:bg-muted'
</script>

<template>
  <div class="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 shadow-lg cursor-default" @pointerdown.stop>
    <template v-for="(attribute, index) in attributes" :key="attribute.key">
      <div v-if="index > 0" class="h-5 w-px bg-border" />

      <div v-if="attribute.editor === 'swatches'" class="flex gap-1.5">
        <button
          v-for="color in variant.colors"
          :key="color"
          class="size-6 rounded-full border"
          :class="[color, object.color === color ? 'ring-2 ring-blue-400' : '']"
          @click="emit('update', { color })"
        />
      </div>

      <div v-else-if="attribute.editor === 'size'" class="flex">
        <button
          v-for="size in FONT_SIZES"
          :key="size.id"
          :class="[button, (object.fontSize ?? 'md') === size.id ? 'bg-muted' : '']"
          @click="emit('update', { fontSize: size.id })"
        >
          {{ size.label }}
        </button>
      </div>

      <div v-else-if="attribute.editor === 'border'" class="flex items-center gap-2">
        <div class="flex">
          <button
            v-for="width in BORDER_WIDTHS"
            :key="width"
            :class="[button, (object.borderWidth ?? 0) === width ? 'bg-muted' : '']"
            @click="emit('update', { borderWidth: width })"
          >
            <span class="block w-4 bg-foreground" :style="{ height: `${width || 1}px`, opacity: width ? 1 : 0.25 }" />
          </button>
        </div>
        <div class="flex gap-1.5">
          <button
            v-for="(shade, shadeIndex) in borderShades(object.color)"
            :key="shade.border"
            class="size-5 rounded-full"
            :class="[shade.swatch, (object.borderShade ?? 1) === shadeIndex ? 'ring-2 ring-blue-400 ring-offset-1' : '']"
            @click="emit('update', { borderShade: shadeIndex })"
          />
        </div>
      </div>

      <button
        v-else
        class="font-bold"
        :class="[button, object.bold ? 'bg-muted' : '']"
        @click="emit('update', { bold: !object.bold })"
      >
        B
      </button>
    </template>
  </div>
</template>
