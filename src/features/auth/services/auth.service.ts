import { delay } from '@/services/mock/support'
import { PERMISSIONS } from '@/types/permissions'
import { listRoles, listUsers, validatePassword } from '@/features/users/services/users.service'
import type { LoginPayload, LoginResult } from '../types'

/** Demo authentication: seeded password hash is verified; empty hash falls back to any non-empty password. */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  await delay(280, 650)
  const loginCode = payload.username.trim().toLowerCase()
  if (!loginCode || !payload.password) {
    throw new Error('User code and password are required.')
  }

  const [users, roles] = await Promise.all([listUsers(), listRoles()])
  const matches = payload.userId
    ? users.filter((candidate) => candidate.id === payload.userId)
    : users.filter((candidate) =>
      candidate.userCode.toLowerCase() === loginCode || candidate.username.toLowerCase() === loginCode,
    )
  if (!matches.length) throw new Error('This user is not registered for the demo.')
  if (matches.length > 1) throw new Error('This user code is assigned in more than one factory.')

  const managedUser = matches[0]!
  if (!managedUser.active || managedUser.employmentStatus !== 'Employed') {
    throw new Error('This user account is disabled.')
  }
  if (managedUser.mustChangePassword && !payload.password) {
    throw new Error('A temporary password is required. Please set a new password.')
  }
  const passwordOk = managedUser.passwordHash
    ? await validatePassword(managedUser.userCode, payload.password, managedUser.id)
    : Boolean(payload.password.trim())
  if (!passwordOk) throw new Error('Password is incorrect.')

  const role = roles.find((candidate) => candidate.id === managedUser.roleId)
  if (!role) throw new Error('The assigned role is no longer available.')

  const permissions = managedUser.roleId === 'admin'
    ? [...new Set([...role.permissions, PERMISSIONS.usersManage, PERMISSIONS.rolesManage])]
    : [...role.permissions]
  const user: LoginResult['user'] = {
    id: managedUser.id,
    userCode: managedUser.userCode,
    name: managedUser.name,
    role: managedUser.roleId,
    roleName: role.name,
    permissions,
    plant: managedUser.factoryName,
    factoryCode: managedUser.factoryCode,
    shift: managedUser.shift,
    warehouseCodes: managedUser.warehouseCodes,
    avatarUrl: managedUser.avatarUrl,
    passwordHash: managedUser.passwordHash,
    mustChangePassword: managedUser.mustChangePassword,
  }
  const token = `demo.${btoa(JSON.stringify({ sub: user.id, role: user.role, factory: user.factoryCode }))}`
  return { token, user }
}
