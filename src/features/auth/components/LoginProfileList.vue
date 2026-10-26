<script setup lang="ts">
import { formatRelative } from '@/utils/format'
import type { WorkstationProfile } from '../types'

defineProps<{
  profiles: WorkstationProfile[]
}>()

const emit = defineEmits<{
  select: [profile: WorkstationProfile]
  manual: []
}>()

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <div class="profiles">
    <div class="profiles__grid">
      <button
        v-for="profile in profiles"
        :key="profile.id"
        type="button"
        class="profile"
        @click="emit('select', profile)"
      >
        <span class="profile__avatar" :data-role="profile.role">{{ initials(profile.name) }}</span>
        <span class="profile__text">
          <span class="profile__name">{{ profile.name }}</span>
          <span class="profile__role">{{ profile.role }}</span>
          <span class="profile__seen">
            {{
              profile.lastSeenAt
                ? `last sign in ${formatRelative(profile.lastSeenAt)}`
                : 'not used yet'
            }}
          </span>
        </span>
        <i class="pi pi-angle-right profile__arrow" />
      </button>

      <button type="button" class="profile profile--manual" @click="emit('manual')">
        <span class="profile__avatar profile__avatar--manual"><i class="pi pi-user-plus" /></span>
        <span class="profile__text">
          <span class="profile__name">Sign in manually</span>
          <span class="profile__role">other account</span>
          <span class="profile__seen">user name and password</span>
        </span>
        <i class="pi pi-angle-right profile__arrow" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.profiles__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.profile {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.75rem;
  text-align: left;
  background: var(--mes-surface);
  border: 1px solid var(--mes-border);
  border-radius: var(--mes-radius);
  cursor: pointer;
  color: inherit;
  transition:
    border-color var(--mes-transition),
    background var(--mes-transition);
}

.profile:hover {
  border-color: var(--mes-accent-border);
  background: var(--mes-surface-hover);
}

.profile:focus-visible {
  outline: 2px solid var(--mes-accent);
  outline-offset: 1px;
}

.profile__avatar {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--mes-accent-soft);
  color: var(--mes-accent);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.profile__avatar[data-role='supervisor'] {
  background: var(--mes-role-supervisor-bg);
  color: var(--mes-role-supervisor-fg);
}

.profile__avatar[data-role='admin'] {
  background: var(--mes-role-admin-bg);
  color: var(--mes-role-admin-fg);
}

.profile__avatar--manual {
  background: var(--mes-surface-header);
  color: var(--mes-text-muted);
}

.profile__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.35;
}

.profile__name {
  font-size: var(--mes-fs-md);
  font-weight: 600;
  color: var(--mes-text-strong);
  line-height: 1.3;
}

.profile__role {
  font-size: 11px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mes-text-muted);
}

.profile__seen {
  font-size: 11px;
  color: var(--mes-text-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile__arrow {
  margin-left: auto;
  font-size: 0.7rem;
  color: var(--mes-text-faint);
}

@media (max-width: 560px) {
  .profiles__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
