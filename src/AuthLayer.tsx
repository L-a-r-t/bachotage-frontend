import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useTDispatch } from "hooks/redux"
import { useRouter } from "next/router"
import { PropsWithChildren, useEffect } from "react"
import { setAuth } from "store/auth.slice"
import { setModal } from "store/modal.slice"
import { UserData } from "types/user"
import { auth, db } from "./firebaseconfig"

export default function AuthLayer({ children }: PropsWithChildren) {
  const dispatch = useTDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          setAuth({
            uid: user.uid,
            username: localStorage.getItem("username") ?? "anon",
          })
        )
        const userDoc = doc(db, "users", user.uid, "private", "data")
        const userData = (await getDoc(userDoc)).data() as UserData | undefined
        if (userData?.onboarded === false) {
          dispatch(setModal({ modal: "onboarding" }))
        }
        if (userData)
          dispatch(
            setAuth({
              uid: user.uid,
              username: userData.username,
              data: userData,
            })
          )
      }
    })

    return unsubscribe
  }, [])

  return <>{children}</>
}
