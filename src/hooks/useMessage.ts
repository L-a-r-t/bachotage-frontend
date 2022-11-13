import { useTDispatch, useTSelector } from "./redux"
import { useState } from "react"
import { addMessage, voteMessage } from "store/discussion.slice"
import { useRouter } from "next/router"
import {
  arrayUnion,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"
import { db } from "firebaseconfig"
import dayjs from "dayjs"

const useMessage = () => {
  const dispatch = useTDispatch()
  const { user } = useTSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const router = useRouter()

  const sendMsg = async (content: string, qIndex: number) => {
    if (!user) return
    try {
      setError(false)
      const docRef = doc(db, "discussions", router.query.id as string)
      const userRef = doc(db, "users", user.uid)
      const msg = {
        content,
        author: user.username ?? "",
        authorId: user.uid,
        score: 1,
      }
      dispatch(
        addMessage({
          msg: {
            ...msg,
            vote: 1,
            published: { _seconds: dayjs().unix(), _nanoseconds: 0 },
          },
          qIndex,
        })
      )
      setLoading(true)
      const res = await Promise.all([
        updateDoc(docRef, {
          [qIndex]: arrayUnion({
            ...msg,
            vote: { [user.uid]: 1 },
            published: serverTimestamp(),
          }),
        }),
        updateDoc(userRef, { contributions: increment(1) }),
      ])
      console.log(res)
    } catch (err) {
      setError(true)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const voteMsg = async (
    vote: -1 | 0 | 1,
    msgIndex: number,
    qIndex: number
  ) => {
    if (!user) return
    try {
      setError(false)
      const docRef = doc(db, "discussions", router.query.id as string)
      dispatch(voteMessage({ vote, msgIndex, qIndex }))
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(docRef)
        const data = doc.data()?.[qIndex] as any[]
        const delta = vote - (data[msgIndex].vote[user.uid] ?? 0)
        const msg = {
          ...data[msgIndex],
          vote: { ...data[msgIndex].vote, [user.uid]: vote },
          score: data[msgIndex].score + delta,
        }
        transaction.update(docRef, {
          [qIndex]: [
            ...data.slice(0, msgIndex),
            msg,
            ...data.slice(msgIndex + 1),
          ],
        })
      })
    } catch (err) {
      setError(true)
      console.error(err)
    }
  }

  return { sendMsg, voteMsg, loading, error }
}

export default useMessage
