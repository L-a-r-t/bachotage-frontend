import { Timestamp } from "."

export type AppUser = {
  uid: string
  username: string
  data?: UserData
}

export type UserData = {
  uid: string
  username: string
  email: string
  savedQuizzes: LightQuiz[]
  firstName: string
  lastName: string
  contributions: number
}

export type LightQuiz = {
  authorId: string
  name: string
  id: string
  desc: string
  questions: { length: number }
  shuffle: boolean
  negativePoints: boolean
  singleAnswer: boolean
}

export type Attempt = {
  uid: string
  quizId: string
  quizName: string
  quizVersion: number
  score: number
  date: Timestamp
  time: number
  questions: AttemptQuestion[]
}

export type AttemptQuestion = {
  index: number
  time: number
  score: number
  answers: { index: number; correct: boolean; selected: boolean }[]
}
