<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 18 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    role="img"
    aria-label="MES Manager logo"
  >
    <!-- Gear ring -->
    <circle
      cx="24"
      cy="24"
      r="13.5"
      fill="none"
      stroke="currentColor"
      stroke-width="5"
    />
    <!-- Gear teeth (4 cardinal + 4 diagonal) -->
    <g fill="currentColor">
      <rect x="21.6" y="3" width="4.8" height="7" rx="1.2" />
      <rect x="21.6" y="38" width="4.8" height="7" rx="1.2" />
      <rect x="3" y="21.6" width="7" height="4.8" rx="1.2" />
      <rect x="38" y="21.6" width="7" height="4.8" rx="1.2" />
    </g>
    <g fill="currentColor" transform="rotate(45 24 24)">
      <rect x="21.6" y="3" width="4.8" height="7" rx="1.2" />
      <rect x="21.6" y="38" width="4.8" height="7" rx="1.2" />
      <rect x="3" y="21.6" width="7" height="4.8" rx="1.2" />
      <rect x="38" y="21.6" width="7" height="4.8" rx="1.2" />
    </g>
    <!-- M monogram -->
    <path
      fill="currentColor"
      d="M17 29.5 V18.5 H20.4 L24 23.4 27.6 18.5 H31 V29.5 H28.1 V23.4 24 28.9 19.9 23.4 V29.5 Z"
    />
  </svg>
</template>
