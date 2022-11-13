import { doc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "firebaseconfig"
import { useTDispatch, useTSelector } from "hooks/redux"
import { useRouter } from "next/router"
import { setAlert, setModal } from "store/modal.slice"
import { useState } from "react"

export default function PublishQuizModal({ questions }: Props) {
  const [loading, setLoading] = useState(false)
  const dispatch = useTDispatch()
  const router = useRouter()

  const publish = async () => {
    try {
      const quizId = router.query.id as string
      const docRef = doc(db, "quizzes", quizId)
      const discussionRef = doc(db, "discussions", quizId)
      const emptyArray = Object.assign({}, new Array(questions).fill([]))
      const emptyObject = Object.assign({}, new Array(questions).fill(null))
      setLoading(true)
      await Promise.allSettled([
        updateDoc(docRef, { published: true, changes: emptyObject }),
        setDoc(discussionRef, emptyArray),
      ])
      dispatch(setAlert({ message: "Quiz publié avec succés!" }))
      router.replace(`/quiz/${quizId}`)
    } catch (err) {
      dispatch(
        setAlert({ message: "Oups, il y a eu une erreur.", error: true })
      )
    } finally {
      setLoading(false)
      dispatch(setModal({ modal: null }))
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <h2 className="text-xl font-bold">Publier le quiz ?</h2>
      <p>
        Une fois publié, il sera impossible de rendre le quiz privé. Vous ne
        pourrez plus le modifier arbitrairement et toute proposition de
        changement devra être soumise au vote.
      </p>
      <div className="flex gap-4">
        <button className="button" onClick={publish}>
          Publier
        </button>
        <button
          className="button bg-main/20 text-slate-800"
          onClick={() => dispatch(setModal({ modal: null }))}
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

type Props = {
  questions: number
}
