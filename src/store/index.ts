import { configureStore } from "@reduxjs/toolkit"
import { default as authReducer } from "./auth.slice"
import { default as modalReducer } from "./modal.slice"
import { default as quizReducer } from "./quiz.slice"
import { default as createQuestionReducer } from "./createQuestion.slice"
import { default as discussionReducer } from "./discussion.slice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    quiz: quizReducer,
    createQuestion: createQuestionReducer,
    discussion: discussionReducer,
  },
})

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
