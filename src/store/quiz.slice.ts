import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { Answer, AppQuiz, DBQuiz, Change } from "types/quiz"
import { check, randomize } from "../utils/functions"
import { Attempt, AttemptQuestion } from "types/user"

// Define a type for the slice state
type QuizState = {
  quiz: AppQuiz | null
  dbQuiz: DBQuiz | null
  qIndex: number
  dbIndex: number
  answers: { ans: Answer[]; time: number }[]
  feedback: Attempt | null
  changes: { [index: number]: Change | undefined }
}

// Define the initial state using that type
const initialState: QuizState = {
  quiz: null,
  dbQuiz: null,
  qIndex: -2,
  dbIndex: -2,
  answers: [],
  feedback: null,
  changes: {},
}

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    initQuiz: (state, action: PayloadAction<DBQuiz>) => {
      const { questions, shuffle } = action.payload
      const parsedQuestions = questions.map((q, index) => ({
        ...q,
        answers: randomize(q.answers.map((a, idx) => ({ ...a, index: idx }))),
        index,
      }))
      state.dbQuiz = action.payload
      const filteredQuestions = (
        shuffle ? randomize(parsedQuestions) : parsedQuestions
      ).filter((q) => q.answers.some((ans) => ans.correct))
      state.quiz = {
        ...action.payload,
        questions: filteredQuestions,
      }
      state.qIndex = -1
      state.dbIndex = -1
      state.answers = []
    },
    answer: (
      state,
      action: PayloadAction<{ answers: number[]; time: number }>
    ) => {
      const answers = action.payload.answers.map((ans) => ({
        correct:
          state.quiz?.questions[state.qIndex].answers[ans].correct ?? false,
        index: ans,
      }))
      if (!state.answers[state.qIndex]) {
        state.answers[state.qIndex] = {
          ans: answers,
          time: action.payload.time,
        }
      } else {
        state.answers[state.qIndex].ans = answers
        state.answers[state.qIndex].time += action.payload.time
      }
      state.dbIndex = state.quiz?.questions[state.qIndex + 1]?.index ?? 0
      if (state.qIndex != state.quiz?.questions.length) state.qIndex++
    },
    skip: (state) => {
      state.dbIndex = state.quiz?.questions[state.qIndex + 1]?.index ?? 0
      state.qIndex++
    },
    previous: (state) => {
      state.dbIndex = state.quiz?.questions[state.qIndex - 1]?.index ?? 0
      state.qIndex--
    },
    startQuiz: (
      state,
      action: PayloadAction<{ length: number; tags: string[]; filter: boolean }>
    ) => {
      const { length, tags, filter } = action.payload
      if (state.quiz)
        state.quiz = {
          ...state.quiz,
          questions: state.quiz.questions
            .filter((q) =>
              check(
                q.tags.some((t) => tags.includes(t)),
                filter
              )
            )
            .slice(0, length),
        }
      state.dbIndex = state.quiz?.questions[state.qIndex + 1]?.index ?? 0
      state.qIndex++
    },
    endQuiz: (state, action: PayloadAction<Attempt>) => {
      state.feedback = action.payload
      state.qIndex = -1
      state.dbIndex = -1
    },
    toQuestion: (state, action: PayloadAction<number>) => {
      const newIndex = Math.max(-1, action.payload)
      state.qIndex = newIndex
      state.dbIndex = state.quiz?.questions[newIndex]?.index ?? 0
    },
    addChange: (
      state,
      action: PayloadAction<{ change: Change; index: number }>
    ) => {
      const { change, index } = action.payload
      if (!state.quiz) {
        state.changes = { ...state.changes, [index]: change }
        return
      }
      state.quiz = {
        ...state.quiz,
        changes: { ...state.quiz.changes, [index]: change },
      }
    },
    voteChange: (
      state,
      action: PayloadAction<{ vote: -1 | 0 | 1; index: number; uid: string }>
    ) => {
      const { vote, index, uid } = action.payload
      const currentChange = state.changes[index]
      const newChange = currentChange
        ? { ...currentChange, votes: { ...currentChange.votes, [uid]: vote } }
        : undefined
      if (!state.quiz) {
        state.changes[index] = newChange
        return
      }
      state.quiz = {
        ...state.quiz,
        changes: { ...state.quiz.changes, [index]: newChange ?? null },
      }
    },
  },
})

export const {
  initQuiz,
  answer,
  skip,
  previous,
  startQuiz,
  endQuiz,
  toQuestion,
  addChange,
  voteChange,
} = quizSlice.actions

export default quizSlice.reducer
