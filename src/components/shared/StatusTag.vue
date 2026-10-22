<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed } from 'vue'
import { TONE_CLASS, type StatusTone } from '@/utils/status'

const props = defineProps<{
  value: string
  tone: StatusTone
}>()

const severity = computed(() => {
  switch (props.tone) {
    case 'ok':
      return 'success'
    case 'warn':
      return 'warn'
    case 'alarm':
      return 'danger'
    case 'info':
      return 'info'
    default:
      return 'secondary'
  }
})
</script>

<template>
  <Tag :value="value" :severity="severity" :class="TONE_CLASS[tone]" />
</template>
