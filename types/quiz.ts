import { Timestamp } from "."

export type DBQuiz = {
  authorId: string
  name: string
  desc: string
  singleAnswer: boolean
  shuffle: boolean
  negativePoints: boolean
  published: boolean
  categories: string[]
  questions: DBQuestion[]
  changes: { [index: number]: Change | null }
  version: number
}

export type AppQuiz = {
  authorId: string
  name: string
  desc: string
  singleAnswer: boolean
  shuffle: boolean
  negativePoints: boolean
  published: boolean
  categories: string[]
  questions: AppQuestion[]
  changes: { [index: number]: Change | null }
  version: number
}

export type DBQuestion = {
  prompt: string
  tags: string[]
  answers: {
    text: string
    correct: boolean
  }[]
}

export type AppQuestion = {
  index: number
  prompt: string
  tags: string[]
  answers: {
    index: number
    text: string
    correct: boolean
  }[]
}

export type Change = {
  type: ("typo" | "answer")[]
  author: string
  argument: string
  authorId: string
  date: Timestamp
  votes: { [userId: string]: 1 | 0 | -1 }
  prompt: string | null
  answers: {
    text: string | null
    correct: boolean | null
  }[]
}

export type Answer = {
  index: number
  correct: boolean
}

export type Feedback = {
  score: number
  time: number
  questions: AnswersFeedback[]
}

export type AnswersFeedback = {
  answers: (
    | "true"
    | "xtrue"
    | "true!"
    | "xtrue!"
    | "false"
    | "xfalse"
    | "false!"
    | "xfalse!"
  )[]
  time: number
  score: number
}

export type QuizStats = {
  tries: number
  liked: number
  disliked: number
  avgScore: number
  triesHistory: {
    questionsCount: number
    score: number
    date: number
  }[]
}

export type VersionHistory = DBQuiz[]
