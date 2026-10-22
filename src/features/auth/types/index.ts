export type LoginRole = 'operator' | 'supervisor' | 'admin'

export interface LoginPayload {
  username: string
  password: string
  role: LoginRole
}

export interface LoginResult {
  token: string
  user: {
    id: string
    name: string
    role: LoginRole
    permissions: string[]
    plant: string
    shift: string
  }
}

/** A workstation profile offered on the login screen. */
export interface WorkstationProfile {
  id: string
  name: string
  role: LoginRole
  shift: string
  /** ISO timestamp of the last successful sign in, null when never used. */
  lastSeenAt: string | null
}
