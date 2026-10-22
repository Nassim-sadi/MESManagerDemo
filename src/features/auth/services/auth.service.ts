import { delay } from '@/services/mock/support'
import { ROLE_PERMISSIONS } from '@/stores/auth.store'
import type { LoginPayload, LoginResult } from '../types'

/**
 * Demo authentication. Replace with a real endpoint later - the store and
 * the router guard do not change.
 */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  await delay(280, 650)

  const username = payload.username.trim()
  if (!username || !payload.password) {
    throw new Error('User name and password are required.')
  }

  const user: LoginResult['user'] = {
    id: `U-${String(1000 + username.length * 7)}`,
    name: username,
    role: payload.role,
    permissions: ROLE_PERMISSIONS[payload.role],
    plant: 'Plant 04 - Bratislava',
    shift: 'Shift A',
  }

  const token = `demo.${btoa(JSON.stringify({ sub: user.id, role: user.role }))}`

  return { token, user }
}
