import { useTDispatch, useTSelector } from "hooks/redux"
import { useRouter } from "next/router"
import { setAlert, setModal } from "store/reducers/modal.slice"
import { DBQuiz } from "types/quiz"
import Spinner from "components/UI/Spinner"
import { useDeleteDrafMutation } from "store/apis/quiz.api"

export default function DeleteDraftModal({ quiz, quizId }: Props) {
  const [deleteDraft, { isLoading }] = useDeleteDrafMutation()
  const dispatch = useTDispatch()
  const { user } = useTSelector((state) => state.auth)
  const router = useRouter()

  const deleteQuiz = async () => {
    if (!user) return
    try {
      await deleteDraft(quizId)
      dispatch(setAlert({ message: `"${quiz.name}" a bien été supprimé` }))
      if (router.asPath.includes("/account/quizzes?tab=2")) {
        router.reload()
      } else {
        router.replace("/account/quizzes?tab=2")
      }
      dispatch(setModal({ modal: null }))
    } catch (err) {
      dispatch(setAlert({ message: `Oups, il y a eu une erreur`, error: true }))
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <h2 className="text-xl font-bold">Supprimer le brouillon ?</h2>
      <p className="text-center">
        Vous vous apprêtez à supprimer {'"'}
        {quiz.name}
        {'"'}. <span className="font-bold">Cette action est irréversible</span>,
        souhaitez-vous continuer ?
      </p>
      <div className="flex gap-4">
        <button className="button bg-red-main" onClick={deleteQuiz}>
          Supprimer {isLoading && <Spinner white small />}
        </button>
        <button
          className="button bg-main-20 text-main-100"
          onClick={() => dispatch(setModal({ modal: null }))}
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

type Props = {
  quizId: string
  quiz: DBQuiz
}
