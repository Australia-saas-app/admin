export interface BlogAuthor {
  fullName: string
  email: string
}

export interface BlogProps {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  featuredImage: string | null
  isVisible: boolean
  viewCount: number
  likeCount: number
  authorId: string
  author?: BlogAuthor
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

