import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { Discussion, Message } from "types/discuss"

// Define a type for the slice state
type DiscussionState = {
  discussion: Discussion | null
  currentSort: "recent" | "old" | "relevant"
  discussionQuizId: string
}

// Define the initial state using that type
const initialState: DiscussionState = {
  discussion: null,
  currentSort: "relevant",
  discussionQuizId: "",
}

export const discussionSlice = createSlice({
  name: "discussion",
  initialState,
  reducers: {
    pickSortingOption: (
      state,
      action: PayloadAction<"recent" | "old" | "relevant">
    ) => {
      state.currentSort = action.payload
    },
    setDiscussion: (
      state,
      action: PayloadAction<{ discussion: Discussion; quizId: string } | null>
    ) => {
      if (action.payload === null) {
        state.discussion = action.payload
      } else {
        const { discussion, quizId } = action.payload
        state.discussion = discussion
        state.discussionQuizId = quizId
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{ msg: Message; qIndex: number }>
    ) => {
      if (!state.discussion) return
      const { msg, qIndex } = action.payload
      state.discussion.messages[qIndex].push(msg)
    },
    voteMessage: (
      state,
      action: PayloadAction<{
        vote: -1 | 0 | 1
        msgIndex: number
        qIndex: number
      }>
    ) => {
      if (!state.discussion) return
      const { vote, msgIndex, qIndex } = action.payload
      const delta = vote - state.discussion.messages[qIndex][msgIndex].vote
      state.discussion.messages[qIndex][msgIndex].score += delta
      state.discussion.messages[qIndex][msgIndex].vote = vote
    },
  },
})

export const { setDiscussion, addMessage, voteMessage, pickSortingOption } =
  discussionSlice.actions

export default discussionSlice.reducer
