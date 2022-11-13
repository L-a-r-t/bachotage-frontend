import { Timestamp } from "."

export type Feed = {
  quizName: string
  question: number
  questionPrompt: string
  messages: Message[]
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
  vote: { [uid: string]: number }
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
