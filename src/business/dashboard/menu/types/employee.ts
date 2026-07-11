export type Employee = {
  id: string
  name: string
  title?: string
  officeAddress?: string
  photoUrl?: string
  fileName?: string
  socialLinks?: { platform: string; url: string }[]
  active?: boolean
}

export default Employee
