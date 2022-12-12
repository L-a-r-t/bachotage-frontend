import { Indexable, Timestamp } from "."

export type Discussion = {
  quizName: string
  following: boolean
  messages: Indexable<Message[]>
}

export type DBDiscussion = {
  quizName: string
  following: string[]
  messages: Indexable<DBMessage[]>
}

export type Message = {
  author: string
  authorId: string
  content: string
  images?: string[]
  published: Timestamp
  lastEdited?: number
  flagged?: boolean
  score: number
  vote: -1 | 0 | 1
}

export type DBMessage = {
  author: string
  authorId: string
  content: string
  images?: string[]
  published: Timestamp
  lastEdited?: number
  score: number
  vote: { [uid: string]: -1 | 0 | 1 }
}

export type SortedMessage = Message & {
  index: number
}

export type MessageFlag = {
  authorId: string
  quizId: string
  content: string
  motive: "offensive" | "hs" | "spam"
}
