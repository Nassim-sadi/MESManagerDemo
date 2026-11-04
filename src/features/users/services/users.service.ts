import http from '@/services/http'
import { migratePermissions } from '@/types/permissions'
import {
  DEPARTMENT_OPTIONS,
  DEMO_FACTORY_CODE,
  FACTORY_OPTIONS,
  WAREHOUSE_OPTIONS,
  type ManagedRole,
  type ManagedUser,
} from '../types'

const USERS_KEY = 'mes.managed-users'
const ROLES_KEY = 'mes.managed-roles'
const base = import.meta.env.BASE_URL

async function seed<T>(path: string): Promise<T> {
  const url = new URL(`${base}data/${path}`, window.location.origin).toString()
  const { data } = await http.get<T>(url)
  return data
}

function read<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

function flag(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return fallback
  return !['false', '0', 'no', 'disabled', 'inactive', '否', '禁用'].includes(value.trim().toLowerCase())
}

function migrateUser(value: Partial<ManagedUser> & Record<string, unknown>): ManagedUser {
  const oldPlant = typeof value.plant === 'string' ? value.plant : ''
  const factory = FACTORY_OPTIONS.find((entry) => entry.name === oldPlant)
    ?? FACTORY_OPTIONS.find((entry) => entry.code === value.factoryCode)
    ?? FACTORY_OPTIONS[0]!
  const roleId = String(value.roleId ?? 'operator')
  const defaultWarehouses = roleId === 'operator'
    ? ['WH-01']
    : WAREHOUSE_OPTIONS.map(({ code }) => code)

  return {
    id: String(value.id ?? `user-${crypto.randomUUID()}`),
    userCode: String(value.userCode ?? value.username ?? value.name ?? ''),
    username: String(value.username ?? value.userCode ?? value.name ?? ''),
    name: String(value.name ?? value.username ?? ''),
    department: String(value.department ?? DEPARTMENT_OPTIONS[0]),
    sex: String(value.sex ?? 'Unspecified'),
    address: String(value.address ?? ''),
    telephone: String(value.telephone ?? ''),
    mobile: String(value.mobile ?? ''),
    fax: String(value.fax ?? ''),
    email: String(value.email ?? ''),
    post: String(value.post ?? ''),
    active: value.active !== undefined ? flag(value.active) : flag(value.fflag, true),
    employmentStatus: value.employmentStatus === 'Not employed' || value.fflagJob === 'Not employed'
      ? 'Not employed'
      : 'Employed',
    backgroundAuthority: flag(value.backgroundAuthority),
    foregroundAuthority: flag(value.foregroundAuthority),
    factoryCode: String(value.factoryCode ?? factory.code ?? DEMO_FACTORY_CODE),
    factoryName: String(value.factoryName || oldPlant || factory.name),
    roleId,
    avatarUrl: String(value.avatarUrl ?? ''),
    shift: String(value.shift ?? 'Shift A'),
    warehouseCodes: Array.isArray(value.warehouseCodes)
      ? value.warehouseCodes.map(String)
      : defaultWarehouses,
    passwordHash: value.passwordHash ?? '',
    mustChangePassword: value.mustChangePassword ?? false,
  }
}

export async function listUsers(): Promise<ManagedUser[]> {
  const stored = read<(Partial<ManagedUser> & Record<string, unknown>)[]>(USERS_KEY)
  if (stored) {
    const migrated = stored.map(migrateUser)
    write(USERS_KEY, migrated)
    return migrated
  }
  const initial = (
    await seed<(Partial<ManagedUser> & Record<string, unknown>)[]>('users.json')
  ).map(migrateUser)
  write(USERS_KEY, initial)
  return initial
}

export async function listDepartments(): Promise<string[]> {
  return [...DEPARTMENT_OPTIONS]
}

export async function saveUsers(users: ManagedUser[]): Promise<void> {
  write(USERS_KEY, users)
}

export async function listRoles(): Promise<ManagedRole[]> {
  const stored = read<ManagedRole[]>(ROLES_KEY)
  if (stored) {
    const migrated = stored.map((role) => ({ ...role, permissions: migratePermissions(role.permissions ?? []) }))
    write(ROLES_KEY, migrated)
    return migrated
  }
  const initial = (await seed<ManagedRole[]>('roles.json')).map((role) => ({
    ...role,
    permissions: migratePermissions(role.permissions ?? []),
  }))
  write(ROLES_KEY, initial)
  return initial
}

export async function saveRoles(roles: ManagedRole[]): Promise<void> {
  write(ROLES_KEY, roles)
}

export async function validatePassword(userCode: string, password: string, userId?: string): Promise<boolean> {
  const users = await listUsers()
  const user = users.find((candidate) => userId ? candidate.id === userId : candidate.userCode === userCode)
  if (!user) return false
  // If user has a password hash, verify it; otherwise demo accepts any non-empty password
  if (user.passwordHash) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hexHash = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return hexHash === user.passwordHash
  }
  return Boolean(password.trim())
}

export async function setUserPassword(userId: string, password: string): Promise<ManagedUser> {
  const users = await listUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx < 0) throw new Error('User not found')
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hexHash = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  const user = users[idx]
  if (!user) throw new Error('User not found')
  user.passwordHash = hexHash
  user.mustChangePassword = false
  await saveUsers(users)
  return user
}
