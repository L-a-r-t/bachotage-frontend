import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { Tip } from "types/index"
import { randomRange } from "utils/functions"

export const globalApi = createApi({
  reducerPath: "globalApi",
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
  }),
})

export const { useGetRandomTipQuery } = globalApi
