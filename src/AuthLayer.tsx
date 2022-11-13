import { onAuthStateChanged } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore"
import { useTDispatch } from "hooks/redux"
import { PropsWithChildren, useEffect } from "react"
import { setAuth } from "store/auth.slice"
import { UserData } from "types/user"
import { auth, db } from "./firebaseconfig"

export default function AuthLayer({ children }: PropsWithChildren) {
  const dispatch = useTDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // console.log("user auth", user)
        // const userData = (
        //   await getDocs(
        //     query(collection(db, "users"), where("uid", "==", user.uid))
        //   )
        // ).docs[0]
        // console.log("user data", userData.data())
        console.log("user", {
          ...user,
          username: localStorage.getItem("username"),
          // ...userData.data(),
        })
        dispatch(
          setAuth({
            uid: user.uid,
            username: localStorage.getItem("username") ?? "anon",
          })
        )
        const userDoc = doc(db, "users", user.uid, "private", "data")
        const userData = (await getDoc(userDoc)).data() as UserData | undefined
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
