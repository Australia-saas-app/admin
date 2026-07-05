export type Company = {
  id: string
  description?: string
  contentName?: string
  contentDescription?: string
  contentDate?: string
  logoUrl?: string
  address?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  socialLinks?: { platform: string; url: string }[]
  active?: boolean
}

export default Company
