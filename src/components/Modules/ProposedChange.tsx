import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTDispatch, useTSelector } from "hooks/redux"
import Latex from "react-latex"
import { DBQuiz } from "types/quiz"
import { useState, useEffect } from "react"
import { setAlert, setModal } from "store/modal.slice"
import { voteChange as voteStoreChange } from "store/quiz.slice"
import { doc, updateDoc } from "firebase/firestore"
import { db, functions } from "firebaseconfig"
import { useRouter } from "next/router"
import { httpsCallable } from "firebase/functions"
import { TrackChangeVotesReq, TrackChangeVotesRes } from "types/functions"
import { protect } from "utils/functions"

export default function ProposedChange({ quiz, qIndex }: Props) {
  const { user } = useTSelector((state) => state.auth)
  const { changes } = useTSelector((state) => state.quiz)
  const [change, setChange] = useState(quiz.changes[qIndex] ?? changes[qIndex])
  const [userVote, setUserVote] = useState(
    quiz.changes[qIndex]?.votes[user?.uid ?? ""] ??
      changes[qIndex]?.votes[user?.uid ?? ""]
  )
  const [loading, setLoading] = useState(false)
  const dispatch = useTDispatch()
  const router = useRouter()

  useEffect(() => {
    setChange(quiz.changes[qIndex] ?? changes[qIndex])
    setUserVote((prev) =>
      prev === undefined
        ? quiz.changes[qIndex]?.votes[user?.uid ?? ""] ??
          changes[qIndex]?.votes[user?.uid ?? ""]
        : prev
    )
  }, [user, changes, qIndex, quiz.changes])

  const voteChange = protect(async (vote: -1 | 0 | 1) => {
    if (!user || !change) return
    const _vote = userVote === vote ? 0 : vote
    try {
      const docRef = doc(db, "quizzes", router.query.id as string)
      const path = `changes.${qIndex}.votes.${user.uid}`
      await updateDoc(docRef, {
        [path]: _vote,
      })
      setUserVote(_vote)
      dispatch(voteStoreChange({ vote: _vote, uid: user.uid, index: qIndex }))
      dispatch(setAlert({ message: "Votre vote a été pris en compte" }))
      setLoading(false)
      const trackChangeVotes = httpsCallable<
        TrackChangeVotesReq,
        TrackChangeVotesRes
      >(functions, "trackChangeVotes")
      const res = await trackChangeVotes({
        quizId: router.query.id as string,
        changeIndex: qIndex,
      })
      console.log(res)
      const resData = res.data
      if (resData.status == "stale") return
      if (resData.status == "valid")
        dispatch(
          setAlert({
            message:
              "La proposition a été retenue, merci pour votre contribution !",
          })
        )
      if (resData.status == "invalid")
        dispatch(
          setAlert({
            message:
              "La proposition a été rejetée, merci pour votre contribution !",
          })
        )
    } catch (err) {
      dispatch(
        setAlert({ message: "Oups ! Il y a eu une erreur", error: true })
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  })

  return change ? (
    <div className="flex flex-col items-center gap-2">
      <div>
        <p className="text-center text-lg">Proposition de mise à jour</p>
        <p className="text-center text-sm italic">de {change.author}</p>
      </div>
      <div className="p-4 rounded-lg bg-main-10">
        <p>{change.argument}</p>
      </div>
      <div>
        <p className="text-center mb-2">Nouvelles réponses</p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2">
          {(quiz.changes[qIndex] ?? changes[qIndex])?.answers.map(
            (ans, index) => {
              const dbAns = quiz.questions[qIndex].answers[index]
              return (
                <button
                  key={dbAns.text}
                  type="button"
                  className={`relative button min-w-28 justify-center 
      border-2 font-semibold text-sm border-yellow-500 cursor-default
    ${
      ans.correct
        ? "bg-yellow-500 text-white"
        : "bg-transparent text-yellow-600"
    } cursor-pointer`}
                >
                  <Latex>{dbAns.text}</Latex>
                </button>
              )
            }
          )}
        </div>
      </div>
      {user?.uid == change.author ? ( // TODO remettre change.authorId une fois les tests terminés
        <div>
          <p className="text-center">
            Vous ne pouvez pas voter une proposition de réponse que vous avez
            soumise.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-center mb-2">Êtes-vous d{"'"}accord ?</p>
          <div className="flex justify-center items-center gap-2">
            <button
              className={`button h-12 text-xl border-2 rounded font-semibold border-green-main
              ${
                userVote == 1
                  ? "text-white bg-green-main"
                  : "text-green-main bg-transparent"
              }`}
              onClick={() => voteChange(1)}
            >
              Oui <FontAwesomeIcon className="text-2xl ml-2" icon={faCheck} />
            </button>
            <button
              className={`button h-12 text-xl border-2 rounded font-semibold border-red-main
              ${
                userVote == -1
                  ? "text-white bg-red-main"
                  : "text-red-main bg-transparent"
              }`}
              onClick={() => voteChange(-1)}
            >
              Non <FontAwesomeIcon className="text-2xl ml-2" icon={faXmark} />
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      {quiz.questions[qIndex].answers.some((ans) => ans.correct)
        ? `Il n'y a pas de proposition de réponse. Vous n'êtes pas d'
      accord avec les réponses actuelles ?`
        : `Cette question n'a pas encore de réponse, proposez-en une !`}
      <button
        className="button w-full"
        onClick={() =>
          dispatch(
            setModal({
              modal: "submitAnswer",
              props: {
                dbQuiz: quiz,
                dbIndex: qIndex,
              },
            })
          )
        }
      >
        Soumettre une réponse
      </button>
    </div>
  )
}

type Props = {
  quiz: DBQuiz
  qIndex: number
}
