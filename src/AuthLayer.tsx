import { onAuthStateChanged } from "firebase/auth"
import { useTDispatch } from "hooks/redux"
import { PropsWithChildren, useEffect } from "react"
import { useLazyGetUserDataQuery } from "store/apis/auth.api"
import { setAuth } from "store/reducers/auth.slice"
import { setModal } from "store/reducers/modal.slice"
import { auth } from "./firebaseconfig"

export default function AuthLayer({ children }: PropsWithChildren) {
  const dispatch = useTDispatch()
  const [getUserData] = useLazyGetUserDataQuery()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(
          setAuth({
            uid: user.uid,
            username: localStorage.getItem("username") ?? "anon",
          })
        )
        const userData = await getUserData(user.uid).unwrap()
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
