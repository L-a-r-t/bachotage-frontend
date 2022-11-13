import { DBQuiz } from "./quiz"

export type GenerateQuizReq = undefined
export type GenerateQuizRes = { id: string }
export type OnSigninReq = {
  uid: string
  email: string
  firstName?: string
  lastName?: string
}
export type OnSigninRes = unknown

export type TrackChangeVotesReq = { quizId: string; changeIndex: number }
export type TrackChangeVotesRes = {
  status: "valid" | "invalid" | "stale"
}
