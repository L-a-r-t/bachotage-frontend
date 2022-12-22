import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import { updatePassword } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "config/firebase"
import { UserData } from "types/user"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    getUserData: build.query<UserData | undefined, string>({
      async queryFn(uid) {
        try {
          const userDoc = doc(db, "users", uid, "private", "data")
          const data = (await getDoc(userDoc)).data() as UserData | undefined
          return { data }
        } catch (error) {
          return { error }
        }
      },
    }),
    updateOnboardedStatus: build.mutation<void, OnboardArgs>({
      async queryFn({ uid, password }) {
        try {
          if (!auth.currentUser) throw "User isn't connected"
          const userData = doc(db, "users", uid, "private", "data")
          await updatePassword(auth.currentUser, password)
          await updateDoc(userData, { onboarded: true })
          return { data: undefined }
        } catch (error) {
          return { error }
        }
      },
    }),
  }),
})

export const { useLazyGetUserDataQuery, useUpdateOnboardedStatusMutation } =
  authApi

type OnboardArgs = {
  uid: string
  password: string
}
