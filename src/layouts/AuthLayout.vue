<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppLogo from '@/components/brand/AppLogo.vue'

const now = ref(new Date())
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) window.clearInterval(timer)
})

const time = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now.value)

const date = () =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(now.value)
</script>

<template>
  <div class="auth">
    <aside class="auth__aside">
      <div class="auth__brand">
        <span class="auth__logo"><AppLogo :size="22" /></span>
        <div>
          <div class="auth__name">MES Manager</div>
          <div class="auth__sub">Manufacturing Execution System</div>
        </div>
      </div>

      <div class="auth__middle">
        <div class="auth__context">
          <div class="auth__context-row">
            <span class="auth__context-label">Plant</span>
            <span class="auth__context-value">Plant 04 — Bratislava</span>
          </div>
          <div class="auth__context-row">
            <span class="auth__context-label">Shift</span>
            <span class="auth__context-value">Shift A · 06:00 – 14:00</span>
          </div>
          <div class="auth__context-row">
            <span class="auth__context-label">Terminal</span>
            <span class="auth__context-value">
              <i class="pi pi-circle-fill auth__dot" />
              Shop floor station 3
            </span>
          </div>
        </div>

        <p class="auth__note">
          Demo environment — every record on this screen is sample production data.
        </p>
      </div>

      <footer class="auth__clock">
        <span class="auth__time">{{ time() }}</span>
        <span class="auth__date">{{ date() }}</span>
      </footer>
    </aside>

    <main class="auth__main">
      <div class="auth__panel">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth {
  display: grid;
  grid-template-columns: minmax(320px, 38%) 1fr;
  min-height: 100vh;
  background: var(--mes-canvas);
}

/* --- Left: brand + context -------------------------------------------- */

.auth__aside {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 2.25rem;
  background:
    radial-gradient(circle at 15% 10%, rgb(37 99 166 / 26%), transparent 55%),
    linear-gradient(180deg, #1b2b3c 0%, #16232f 100%);
  color: #d6dfe8;
}

.auth__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.auth__logo {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--mes-radius-sm);
  background: var(--mes-accent);
  color: #fff;
  font-size: 0.95rem;
}

.auth__name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #f2f6fa;
}

.auth__sub {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7d8fa1;
}

.auth__middle {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin: auto 0;
}

.auth__context {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 0.9rem 1rem;
  border: 1px solid #2a3d52;
  border-radius: var(--mes-radius);
  background: rgb(255 255 255 / 3%);
}

.auth__context-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.auth__context-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6f8296;
}

.auth__context-value {
  font-size: var(--mes-fs-sm);
  color: #dbe4ec;
}

.auth__dot {
  font-size: 0.5rem;
  color: #3fa06f;
  vertical-align: middle;
}

.auth__note {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #7d8fa1;
  max-width: 26rem;
}

.auth__clock {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.auth__time {
  font-family: var(--mes-font-mono);
  font-size: 26px;
  font-weight: 600;
  color: #f2f6fa;
  letter-spacing: 0.02em;
}

.auth__date {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6f8296;
}

/* --- Right: sign in ---------------------------------------------------- */

.auth__main {
  display: grid;
  place-items: center;
  padding: 2rem;
}

.auth__panel {
  width: min(480px, 100%);
  background: var(--mes-surface);
  border: 1px solid var(--mes-border);
  border-radius: 8px;
  box-shadow: 0 18px 44px -28px rgb(16 29 42 / 45%);
  padding: 1.6rem;
}

@media (max-width: 900px) {
  .auth {
    grid-template-columns: 1fr;
  }

  .auth__aside {
    display: none;
  }
}
</style>
