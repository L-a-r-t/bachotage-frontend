import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { DBQuestion } from "types/quiz"

// Define a type for the slice state
type QuestionsState = {
  questions: DBQuestion[]
}

// Define the initial state using that type
const initialState: QuestionsState = {
  questions: [],
}

export const createQuestionSlice = createSlice({
  name: "createQuestion",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<DBQuestion[]>) => {
      state.questions = action.payload
    },
    addQuestion: (state, action: PayloadAction<DBQuestion>) => {
      state.questions.push(action.payload)
    },
    editQuestion: (
      state,
      action: PayloadAction<{ question: DBQuestion; qIndex: number }>
    ) => {
      state.questions[action.payload.qIndex] = action.payload.question
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
