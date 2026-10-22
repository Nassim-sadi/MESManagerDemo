import type { LoginRole, WorkstationProfile } from '../types'

const STORAGE_KEY = 'mes.profiles'

/**
 * Demo workstation profiles. They are always offered so the login screen
 * never shows an empty state during a presentation.
 */
const SEED_PROFILES: WorkstationProfile[] = [
  { id: 'demo-operator', name: 'A. Fischer', role: 'operator', shift: 'Shift A', lastSeenAt: null },
  {
    id: 'demo-supervisor',
    name: 'R. Singh',
    role: 'supervisor',
    shift: 'Shift A',
    lastSeenAt: null,
  },
  { id: 'demo-admin', name: 'M. Keller', role: 'admin', shift: 'Shift A', lastSeenAt: null },
]

function readStored(): WorkstationProfile[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as WorkstationProfile[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeStored(profiles: WorkstationProfile[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

/**
 * Profiles of everyone who signed in on this workstation, plus the seeded
 * demo accounts. Only user name, role and the last sign in are stored -
 * never a password.
 */
export function listProfiles(): WorkstationProfile[] {
  const stored = readStored()
  const known = new Set(stored.map((profile) => profile.name.toLowerCase()))

  const seeded = SEED_PROFILES.filter((profile) => !known.has(profile.name.toLowerCase()))
  const remembered = [...stored].sort((a, b) =>
    (b.lastSeenAt ?? '').localeCompare(a.lastSeenAt ?? ''),
  )

  return [...remembered, ...seeded]
}

export function rememberProfile(profile: {
  name: string
  role: LoginRole
  shift: string
}): WorkstationProfile {
  const stored = readStored()
  const entry: WorkstationProfile = {
    id: `profile-${profile.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: profile.name,
    role: profile.role,
    shift: profile.shift,
    lastSeenAt: new Date().toISOString(),
  }

  const index = stored.findIndex(
    (candidate) => candidate.name.toLowerCase() === profile.name.toLowerCase(),
  )

  if (index >= 0) {
    stored[index] = entry
  } else {
    stored.push(entry)
  }

  writeStored(stored)
  return entry
}

export function removeProfile(id: string): void {
  writeStored(readStored().filter((profile) => profile.id !== id))
}
