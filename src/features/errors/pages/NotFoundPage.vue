<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div class="not-found">
    <p class="not-found__code">404</p>
    <h1 class="not-found__title">{{ t('errors.notFound.title') }}</h1>
    <p class="not-found__message">{{ t('errors.notFound.message') }}</p>
    <Button
      :label="t('errors.notFound.back')"
      icon="pi pi-arrow-left rtl-flip"
      @click="router.push({ name: 'dashboard' })"
    />
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 60vh;
  text-align: center;
}

.not-found__code {
  margin: 0;
  font-family: var(--mes-font-mono);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--mes-border-strong);
}

.not-found__title {
  font-size: 1.125rem;
}

.not-found__message {
  margin: 0 0 0.6rem;
  color: var(--mes-text-muted);
}
</style>
