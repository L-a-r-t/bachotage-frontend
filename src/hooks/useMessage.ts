import { useTDispatch, useTSelector } from "./redux"
import { useState } from "react"
import { addMessage, voteMessage } from "store/reducers/discussion.slice"
import { useRouter } from "next/router"
import {
  arrayUnion,
  doc,
  increment,
  runTransaction,
  updateDoc,
} from "firebase/firestore"
import { db } from "firebaseconfig"
import dayjs from "dayjs"
import { getQuizId, timestamp } from "utils/functions"

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
      const docRef = doc(db, "discussions", getQuizId(router))
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
            published: timestamp(dayjs()),
          },
          qIndex,
        })
      )
      setLoading(true)
      const res = await Promise.all([
        updateDoc(docRef, {
          [`messages.${qIndex}`]: arrayUnion({
            ...msg,
            vote: { [user.uid]: 1 },
            published: timestamp(dayjs()),
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
      const docRef = doc(db, "discussions", getQuizId(router))
      dispatch(voteMessage({ vote, msgIndex, qIndex }))
      await runTransaction(db, async (transaction) => {
        const doc = await transaction.get(docRef)
        const data = doc.data()?.messages[qIndex] as any[]
        const delta = vote - (data[msgIndex].vote[user.uid] ?? 0)
        const msg = {
          ...data[msgIndex],
          vote: { ...data[msgIndex].vote, [user.uid]: vote },
          score: data[msgIndex].score + delta,
        }
        transaction.update(docRef, {
          [`messages.${qIndex}`]: [
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
