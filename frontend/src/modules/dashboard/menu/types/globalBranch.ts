export type GlobalBranch = {
  id: string
  name: string
  flagUrl?: string
  call?: string
  email?: string
  officeAddress?: string
  socialLinks?: Array<{ platform: string; url: string }>
  active?: boolean
}

export default GlobalBranch
