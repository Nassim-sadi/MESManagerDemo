export type LoginRole = string

export interface LoginPayload {
  username: string
  password: string
  userId?: string
}

export interface LoginResult {
  token: string
  user: {
    id: string
    userCode: string
    name: string
    role: LoginRole
    roleName: string
    permissions: string[]
    plant: string
    factoryCode: string
    shift: string
    warehouseCodes: string[]
    avatarUrl: string
    passwordHash: string
    mustChangePassword: boolean
  }
}

/** An enabled managed account offered on this workstation's login screen. */
export interface WorkstationProfile {
  id: string
  userCode: string
  username: string
  name: string
  role: LoginRole
  roleName: string
  shift: string
  avatarUrl: string
  lastSeenAt: string | null
}
