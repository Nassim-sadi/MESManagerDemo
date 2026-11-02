<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ value: string }>()

// The demo serial format is SN followed by digits. These Code 39 symbols make
// the rendered barcode scannable by ordinary Code 39 readers.
const patterns: Record<string, string> = {
  '0': 'nnnwwnwnn',
  '1': 'wnnwnnnnw',
  '2': 'nnwwnnnnw',
  '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn',
  '6': 'nnwwwnnnn',
  '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn',
  '9': 'nnwwnnwnn',
  N: 'nnnwnnwwn',
  S: 'nnwnnwwnn',
  '*': 'nwnnwnwnn',
}
const encoded = computed(() => `*${props.value.toUpperCase()}*`)
const bars = computed(() => {
  const rects: { x: number; width: number }[] = []
  let x = 10
  for (const character of encoded.value) {
    const pattern = patterns[character]
    if (!pattern) continue
    for (let index = 0; index < pattern.length; index += 1) {
      const width = pattern[index] === 'w' ? 5 : 2
      if (index % 2 === 0) rects.push({ x, width })
      x += width
    }
    x += 2
  }
  return { rects, width: x + 10 }
})
</script>

<template>
  <svg
    class="barcode"
    :viewBox="`0 0 ${bars.width} 52`"
    role="img"
    :aria-label="`Code 39 barcode for ${value}`"
    preserveAspectRatio="none"
  >
    <rect
      v-for="(bar, index) in bars.rects"
      :key="index"
      :x="bar.x"
      y="0"
      :width="bar.width"
      height="52"
      fill="#111"
    />
  </svg>
</template>

<style scoped>
.barcode {
  display: block;
  width: 100%;
  height: 3.25rem;
}
</style>
