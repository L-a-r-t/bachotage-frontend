import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { Category, Tip } from "types/index"
import { randomRange } from "utils/functions"

export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getRandomTip: build.query<Tip, { prevId: string }>({
      async queryFn({ prevId }) {
        try {
          const docs = (
            await getDocs(
              query(
                collection(db, "global", "tips", "collection"),
                where("id", "!=", prevId)
              )
            )
          ).docs
          const tip = docs[randomRange(0, docs.length)].data() as Tip
          return { data: tip }
        } catch (error) {
          return { error }
        }
      },
    }),
    getCategories: build.query<Category[], void>({
      async queryFn() {
        try {
          const ref = doc(db, "global", "categories")
          const categoriesDoc = await getDoc(ref)
          const data = categoriesDoc.data() as Category[]
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }),
  }),
})

export const { useGetRandomTipQuery, useGetCategoriesQuery } = commonApi
