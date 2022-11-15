import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  collection,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { DBQuiz } from "types/quiz"

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getPublished: build.query<QueryDocumentSnapshot<DBQuiz>[], { uid: string }>(
      {
        async queryFn({ uid }) {
          try {
            if (uid == "")
              return { error: "Waiting for user to be authenticated" }
            const res = await getDocs(
              query(
                collection(db, "quizzes"),
                where("published", "==", true),
                where("authorId", "==", uid)
              )
            )
            const data = res.docs as QueryDocumentSnapshot<DBQuiz>[]
            return { data }
          } catch (error) {
            return { error }
          }
        },
      }
    ),
    getDrafts: build.query<QueryDocumentSnapshot<DBQuiz>[], { uid: string }>({
      async queryFn({ uid }) {
        try {
          if (uid == "")
            return { error: "Waiting for user to be authenticated" }
          const res = await getDocs(
            query(
              collection(db, "quizzes"),
              where("published", "==", false),
              where("authorId", "==", uid)
            )
          )
          const data = res.docs as QueryDocumentSnapshot<DBQuiz>[]
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }),
  }),
})

export const { useGetPublishedQuery, useGetDraftsQuery } = quizApi
