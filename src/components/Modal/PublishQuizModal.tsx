import { useTDispatch, useTSelector } from "hooks/redux"
import { useRouter } from "next/router"
import { setAlert, setModal } from "store/reducers/modal.slice"
import { Category } from "types/index"
import { usePublishQuizMutation } from "store/apis/quiz.api"
import { getQuizId } from "utils/functions"

export default function PublishQuizModal({ questions, categories }: Props) {
  const [publishQuiz] = usePublishQuizMutation()
  const dispatch = useTDispatch()
  const router = useRouter()

  const publish = async () => {
    try {
      const quizId = getQuizId(router)
      await publishQuiz({ quizId, qCount: questions, categories })
      dispatch(setAlert({ message: "Quiz publié avec succés!" }))
      router.replace(`/quiz/${quizId}`)
    } catch (err) {
      dispatch(
        setAlert({ message: "Oups, il y a eu une erreur.", error: true })
      )
      console.error(err)
    } finally {
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
          className="button bg-main620 text-slate-800"
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
  categories: Category[]
}
