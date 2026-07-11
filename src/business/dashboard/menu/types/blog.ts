export type Blog = {
  id: string
  title: string
  publishDate: string
  coverUrl?: string
  excerpt?: string
  content?: string
  tag?: string[]
  fileName?: string
  active?: boolean
}

export default Blog
