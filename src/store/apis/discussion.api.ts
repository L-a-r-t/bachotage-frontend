import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { db, functions } from "firebaseconfig/index"
import { Discussion } from "types/discuss"
import { TrackChangeVotesReq, TrackChangeVotesRes } from "types/functions"
import { Change } from "types/quiz"
import { AppUser } from "types/user"

export const discussionApi = createApi({
  reducerPath: "discussionApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getDiscussion: build.query<Discussion, string>({
      async queryFn(quizId: string) {
        try {
          const getDiscussion = httpsCallable<any, Discussion>(
            functions,
            "getDiscussion"
          )
          const data = (await getDiscussion(quizId)).data
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }),
    submitChange: build.mutation<void, SubmitChangeArgs>({
      async queryFn({ change, quizId, dbIndex }) {
        try {
          const quizRef = doc(db, "quizzes", quizId)
          await updateDoc(quizRef, {
            [`changes.${dbIndex}`]: { ...change, date: serverTimestamp() },
          })
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
    voteChange: build.mutation<void, VoteChangeArgs>({
      async queryFn({ vote, quizId, uid, qIndex }) {
        try {
          const docRef = doc(db, "quizzes", quizId as string)
          const path = `changes.${qIndex}.votes.${uid}`
          await updateDoc(docRef, {
            [path]: vote,
          })
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
    trackChange: build.mutation<TrackChangeVotesRes, TrackChangeArgs>({
      async queryFn({ quizId, qIndex }) {
        try {
          const trackChangeVotes = httpsCallable<
            TrackChangeVotesReq,
            TrackChangeVotesRes
          >(functions, "trackChangeVotes")
          const res = await trackChangeVotes({
            quizId,
            changeIndex: qIndex,
          })
          const data = res.data
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }),
  }),
})

export const {
  useGetDiscussionQuery,
  useSubmitChangeMutation,
  useVoteChangeMutation,
  useTrackChangeMutation,
} = discussionApi

type SubmitChangeArgs = {
  quizId: string
  dbIndex: number
  change: Omit<Change, "date">
}

type VoteChangeArgs = {
  vote: -1 | 0 | 1
  quizId: string
  uid: string
  qIndex: number
}

type TrackChangeArgs = {
  quizId: string
  qIndex: number
}
