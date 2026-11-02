import { listRoles, listUsers } from '@/features/users/services/users.service'
import type { WorkstationProfile } from '../types'

const STORAGE_KEY = 'mes.profiles'

function readRecent(): Record<string, string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as unknown
    if (Array.isArray(parsed)) {
      return Object.fromEntries(parsed.flatMap((profile) =>
        profile && typeof profile.name === 'string' && typeof profile.lastSeenAt === 'string'
          ? [[profile.name, profile.lastSeenAt]]
          : [],
      ))
    }
    return parsed && typeof parsed === 'object' ? parsed as Record<string, string> : {}
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return {}
  }
}

export async function listProfiles(): Promise<WorkstationProfile[]> {
  const [users, roles, recent] = await Promise.all([listUsers(), listRoles(), Promise.resolve(readRecent())])
  return users
    .filter((user) => user.active)
    .map((user) => ({
      id: user.id,
      userCode: user.userCode,
      username: user.username,
      name: user.name,
      role: user.roleId,
      roleName: roles.find((role) => role.id === user.roleId)?.name ?? user.roleId,
      shift: user.shift,
      avatarUrl: user.avatarUrl,
      lastSeenAt: recent[user.id] ?? recent[user.name] ?? null,
    }))
    .sort((a, b) => (b.lastSeenAt ?? '').localeCompare(a.lastSeenAt ?? ''))
}

export function rememberProfile(userId: string): void {
  const recent = readRecent()
  recent[userId] = new Date().toISOString()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
}
