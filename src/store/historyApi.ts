import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { Attempt } from "types/user"

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getHistory: build.query<Attempt[], { uid: string }>({
      async queryFn({ uid }) {
        try {
          if (uid == "")
            return { error: "Waiting for user to be authenticated" }
          const userHistory = collection(db, "users", uid, "history")
          const res = await getDocs(
            query(userHistory, orderBy("date", "desc"), limit(10))
          )
          const data = res.docs.map((doc) => doc.data() as Attempt)
          return { data }
        } catch (error) {
          console.error(error)
          return { error }
        }
      },
    }),
    getQuizHistory: build.query<
      { stats: Stats; attempts: Attempt[] },
      getQuizHistoryArgs
    >({
      async queryFn({ uid, quizId }) {
        try {
          if (uid == "")
            return { error: "Waiting for user to be authenticated" }
          const userHistory = collection(db, "users", uid, "history")
          const res = await getDocs(
            query(
              userHistory,
              where("quizId", "==", quizId),
              orderBy("date", "desc"),
              limit(10)
            )
          )
          const data = res.docs.map((doc) => doc.data() as Attempt)
          const questions = data.flatMap((q) => q.questions)

          const cumulativeStats = questions.reduce((acc, q) => {
            const curr = [...acc][q.index]
            const a = [...acc]
            a[q.index] = {
              time: (curr?.time ?? 0) + q.time,
              score: (curr?.score ?? 0) + q.score,
              occurences: (curr?.occurences ?? 0) + 1,
              tags: q.tags,
            }
            return a
          }, [] as ({ time: number; occurences: number; score: number; tags: string[] } | undefined)[])
          const average = cumulativeStats.map((q) =>
            q?.time === undefined
              ? 0
              : Math.round((q.time / q.occurences) * 10) / 10
          )
          const tagStats = cumulativeStats.reduce((acc, q, index) => {
            const a = { ...acc }
            q?.tags.forEach(
              (tag) =>
                (a[tag] = {
                  tag,
                  score:
                    (a[tag].score ?? 0) +
                    Math.round((q.score / q.occurences) * 10) / 10,
                  questions: [...a[tag].questions, index],
                })
            )
            return a
          }, {} as { [tag: string]: { tag: string; score: number; questions: number[] } })
          const tagArray = Object.values(tagStats)
          return {
            data: {
              stats: { timeAverages: average, byTag: tagArray },
              attempts: [...data].sort(
                (a, b) => a.date._seconds - b.date._seconds
              ),
            },
          }
        } catch (error) {
          console.error(error)
          return { error }
        }
      },
    }),
  }),
})

export const { useGetQuizHistoryQuery, useGetHistoryQuery } = historyApi

type getQuizHistoryArgs = {
  uid: string
  quizId: string
}

type Stats = {
  timeAverages: number[]
  byTag: { tag: string; score: number; questions: number[] }[]
}
