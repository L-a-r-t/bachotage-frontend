import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { DBQuestion } from "types/quiz"

// Define a type for the slice state
type QuestionsState = {
  questions: DBQuestion[]
  tags: string[]
}

// Define the initial state using that type
const initialState: QuestionsState = {
  questions: [],
  tags: [],
}

export const createQuestionSlice = createSlice({
  name: "createQuestion",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<DBQuestion[]>) => {
      state.questions = action.payload
      state.tags = state.questions.reduce((acc, q) => {
        const arr = [...acc]
        q.tags?.forEach((tag) => {
          if (!acc.includes(tag)) arr.push(tag)
        })
        return arr
      }, [] as string[])
    },
    addQuestion: (state, action: PayloadAction<DBQuestion>) => {
      state.questions.push(action.payload)
      action.payload.tags.forEach((tag) => {
        if (!state.tags.includes(tag)) state.tags.push(tag)
      })
    },
    editQuestion: (
      state,
      action: PayloadAction<{ question: DBQuestion; qIndex: number }>
    ) => {
      state.questions[action.payload.qIndex] = action.payload.question
      action.payload.question.tags.forEach((tag) => {
        if (!state.tags.includes(tag)) state.tags.push(tag)
      })
    },
    removeQuestion: (state, action: PayloadAction<number>) => {
      const index = action.payload
      state.questions = [
        ...state.questions.slice(0, index),
        ...state.questions.slice(index + 1),
      ]
    },
    reorderQuestions: (state, action: PayloadAction<number[]>) => {
      state.questions = action.payload.map((index) => state.questions[index])
    },
  },
})

export const {
  addQuestion,
  removeQuestion,
  reorderQuestions,
  setQuestions,
  editQuestion,
} = createQuestionSlice.actions

export default createQuestionSlice.reducer
