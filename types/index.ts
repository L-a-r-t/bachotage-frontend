export type Stats = {}

export type Timestamp = {
  _seconds: number
  _nanoseconds: number
}

export type Category = {
  authorId: string
  name: string
  quizzes: number
  slug: string
}

export type Tip = {
  id: string
  content: string
  upvotes: number
  downvotes: number
}
