import { configureStore } from "@reduxjs/toolkit"
import { default as authReducer } from "./reducers/auth.slice"
import { default as modalReducer } from "./reducers/modal.slice"
import { default as quizReducer } from "./reducers/quiz.slice"
import { default as createQuestionReducer } from "./reducers/createQuestion.slice"
import { default as discussionReducer } from "./reducers/discussion.slice"
import { historyApi } from "./apis/history.api"
import { quizApi } from "./apis/quiz.api"
import { commonApi } from "./apis/common.api"
import { discussionApi } from "./apis/discussion.api"
import { authApi } from "./apis/auth.api"

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    quiz: quizReducer,
    createQuestion: createQuestionReducer,
    discussion: discussionReducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [discussionApi.reducerPath]: discussionApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (gDM) =>
    gDM()
      .concat(historyApi.middleware)
      .concat(quizApi.middleware)
      .concat(commonApi.middleware)
      .concat(discussionApi.middleware)
      .concat(authApi.middleware),
})

export default store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
