import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  arrayUnion,
  collection,
  doc,
  FieldValue,
  getDocs,
  increment,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { db, functions } from "config/firebase"
import { FieldValues } from "react-hook-form"
import { Category } from "types/index"
import { DBQuestion, DBQuiz } from "types/quiz"
import { AppUser, LightQuiz } from "types/user"
import { toSlug } from "utils/functions"

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getPublished: build.query<Array<DBQuiz & { id: string }>, { uid: string }>({
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
          const data = res.docs.map((doc) => ({
            ...(doc.data() as DBQuiz),
            id: doc.id,
          }))
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }),
    getDrafts: build.query<Array<DBQuiz & { id: string }>, { uid: string }>({
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
          const data = res.docs.map((doc) => ({
            ...(doc.data() as DBQuiz),
            id: doc.id,
          }))
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }),
    createQuiz: build.mutation<{ id: string }, undefined>({
      async queryFn() {
        try {
          const generateQuiz = httpsCallable<undefined, { id: string }>(
            functions,
            "generateQuiz"
          )
          const { data } = await generateQuiz()
          return {
            data,
          }
        } catch (error) {
          return { error }
        }
      },
    }),
    saveQuiz: build.mutation<void, SaveQuizArgs>({
      async queryFn({ categories, selected, quizId, uid, questions, data }) {
        try {
          const quizRef = doc(db, "quizzes", quizId)
          const names = categories.map((c) => c.name)
          const inedit = selected.reduce(
            (acc, curr) => (names.includes(curr) ? acc : [...acc, curr]),
            [] as string[]
          )
          if (inedit.length > 0) {
            inedit.forEach((c) =>
              updateDoc(doc(db, "global", "categories"), {
                [toSlug(c)]: {
                  authorId: uid,
                  name: c,
                  slug: toSlug(c),
                  quizzes: 0,
                } as Category,
              })
            )
          }
          await updateDoc(quizRef, {
            ...data,
            questions: [...questions],
            categories: selected,
          })
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
    bookmarkQuiz: build.mutation<void, BookmarkQuizArgs>({
      async queryFn({ quiz, uid }) {
        try {
          const ref = doc(db, "users", uid, "private", "data")
          await updateDoc(ref, {
            savedQuizzes: arrayUnion(quiz),
          })
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
    unmarkQuiz: build.mutation<void, UnmarkQuizArgs>({
      async queryFn({ newSavedQuizzes, uid }) {
        try {
          const dataRef = doc(db, "users", uid, "private", "data")
          await updateDoc(dataRef, {
            savedQuizzes: newSavedQuizzes,
          })
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
    deleteDraf: build.mutation<void, string>({
      async queryFn(quizId) {
        try {
          const quizRef = doc(db, "quizzes", quizId)
          const discussionRef = doc(db, "discussions", quizId)
          await runTransaction(db, async (transaction) => {
            transaction.delete(quizRef).delete(discussionRef)
          })
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
    publishQuiz: build.mutation<void, PublishQuizArgs>({
      async queryFn({ quizId, qCount, quizName, categories }) {
        try {
          const docRef = doc(db, "quizzes", quizId)
          const discussionRef = doc(db, "discussions", quizId)
          const categoriesRef = doc(db, "global", "categories")
          const catUpdates = categories.reduce((acc, category) => {
            acc[`${category.slug}.quizzes`] = increment(1)
            return acc
          }, {} as { [slug: string]: FieldValue })
          const emptyArray = Object.assign({}, new Array(qCount).fill([]))
          const emptyObject = Object.assign({}, new Array(qCount).fill(null))
          await Promise.allSettled([
            updateDoc(docRef, { published: true, changes: emptyObject }),
            updateDoc(categoriesRef, catUpdates),
            setDoc(discussionRef, {
              messages: emptyArray,
              following: [],
              quizName,
            }),
          ])
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
  }),
})

export const {
  useGetPublishedQuery,
  useGetDraftsQuery,
  useCreateQuizMutation,
  useSaveQuizMutation,
  useBookmarkQuizMutation,
  useUnmarkQuizMutation,
  useDeleteDrafMutation,
  usePublishQuizMutation,
} = quizApi

type SaveQuizArgs = {
  categories: Category[]
  selected: string[]
  quizId: string
  uid: string
  questions: DBQuestion[]
  data: FieldValues
}

type BookmarkQuizArgs = {
  quiz: LightQuiz
  uid: string
}

type UnmarkQuizArgs = {
  newSavedQuizzes: LightQuiz[]
  uid: string
}

type PublishQuizArgs = {
  qCount: number
  categories: Category[]
  quizId: string
  quizName: string
}
