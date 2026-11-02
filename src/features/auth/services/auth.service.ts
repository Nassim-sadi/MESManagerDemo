import { delay } from '@/services/mock/support'
import { PERMISSIONS } from '@/types/permissions'
import { listRoles, listUsers } from '@/features/users/services/users.service'
import type { LoginPayload, LoginResult } from '../types'

/** Demo authentication: any non-empty password is accepted for an enabled managed user. */
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
  }
  const token = `demo.${btoa(JSON.stringify({ sub: user.id, role: user.role, factory: user.factoryCode }))}`
  return { token, user }
}
