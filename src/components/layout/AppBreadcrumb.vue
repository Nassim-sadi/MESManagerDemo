<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    variant?: 'light' | 'dark'
  }>(),
  { variant: 'light' },
)

const route = useRoute()
const { t } = useI18n()

const crumbs = computed(() => {
  const entries = route.matched
    .filter((record) => record.meta.title && record.path !== '/')
    .map((record) => ({
      key: record.meta.titleKey ?? record.meta.title,
      label: t((record.meta.titleKey as string) ?? record.meta.title),
      to: record.path,
    }))

  // A feature group and its list page often share the same title
  // ("Work orders" > "Work Orders") - show the trail only once.
  return entries.filter(
    (entry, index) =>
      index === entries.length - 1 || entry.key !== entries[index + 1]!.key,
  )
})
</script>

<template>
  <nav class="breadcrumb" :class="`breadcrumb--${props.variant}`" aria-label="Breadcrumb">
    <template v-for="(crumb, index) in crumbs" :key="crumb.to">
      <i v-if="index > 0" class="pi pi-angle-right breadcrumb__sep rtl-flip" />
      <span
        :class="['breadcrumb__item', { 'breadcrumb__item--current': index === crumbs.length - 1 }]"
      >
        {{ crumb.label }}
      </span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: var(--mes-fs-sm);
  color: var(--mes-text-muted);
}

.breadcrumb--dark {
  color: var(--mes-nav-text-muted);
}

.breadcrumb__sep {
  font-size: 0.65rem;
  color: var(--mes-text-faint);
}

.breadcrumb--dark .breadcrumb__sep {
  color: #4f6274;
}

.breadcrumb__item--current {
  color: var(--mes-text-strong);
  font-weight: 600;
}

.breadcrumb--dark .breadcrumb__item--current {
  color: #e7eef4;
  font-weight: 600;
}
</style>
