<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/shared/PageHeader.vue'
import { useNavigation } from '@/composables/useNavigation'
import type { NavItem } from '@/router/navigation'

const router = useRouter()
const { items } = useNavigation()
const modules = computed(() => items.value.filter((item) => item.to !== '/dashboard'))

function openModule(item: NavItem): void {
  const target = item.children[0]?.to ?? item.to
  void router.push(target)
}
</script>

<template>
  <div class="module-home">
    <PageHeader title="System modules" subtitle="Open a module available to your account" />

    <section class="module-grid" aria-label="Available system modules">
      <article v-for="module in modules" :key="module.to" class="mes-card module-card">
        <header class="module-card__header">
          <span class="module-card__icon"><i :class="module.icon ?? 'pi pi-folder'" /></span>
          <div>
            <h2>{{ module.label }}</h2>
            <span v-if="module.children.length" class="mes-eyebrow">
              {{ module.children.length }} screens
            </span>
          </div>
        </header>

        <div v-if="module.children.length" class="module-card__links">
          <RouterLink
            v-for="child in module.children"
            :key="child.to"
            :to="child.to"
            class="module-card__link"
          >
            <i :class="child.icon ?? 'pi pi-angle-right'" />
            <span>{{ child.label }}</span>
            <i class="pi pi-arrow-up-right module-card__arrow" />
          </RouterLink>
        </div>
        <button v-else type="button" class="module-card__open" @click="openModule(module)">
          Open {{ module.label }} <i class="pi pi-arrow-right" />
        </button>
      </article>

      <p v-if="modules.length === 0" class="mes-muted">
        No system modules are assigned to this account.
      </p>
    </section>
  </div>
</template>

<style scoped>
.module-home {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
  gap: 0.75rem;
}

.module-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 0;
  padding: 0.9rem;
}

.module-card__header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.module-card__icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--mes-radius-sm);
  background: var(--mes-accent-soft);
  color: var(--mes-accent);
}

.module-card__header h2 {
  margin: 0;
  font-size: var(--mes-fs-md);
  font-weight: 650;
}

.module-card__links {
  display: grid;
  gap: 0.15rem;
  border-top: 1px solid var(--mes-border);
  padding-top: 0.4rem;
}

.module-card__link,
.module-card__open {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 2.25rem;
  padding: 0.4rem 0.45rem;
  border: 0;
  border-radius: var(--mes-radius-sm);
  background: transparent;
  color: var(--mes-text);
  font: inherit;
  font-size: var(--mes-fs-sm);
  text-align: start;
  text-decoration: none;
  cursor: pointer;
}

.module-card__link:hover,
.module-card__open:hover {
  background: var(--mes-surface-hover);
  color: var(--mes-accent);
}

.module-card__arrow {
  margin-inline-start: auto;
  color: var(--mes-text-faint);
  font-size: 0.7rem;
}
</style>
