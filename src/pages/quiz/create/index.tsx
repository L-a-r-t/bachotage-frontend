import Spinner from "components/UI/Spinner"
import { useProtect } from "hooks"
import { useTDispatch } from "hooks/redux"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useCreateQuizMutation } from "store/apis/quiz.api"
import { setAlert } from "store/reducers/modal.slice"

const GenerateQuiz: NextPage = () => {
  const { user, redirect } = useProtect()
  const router = useRouter()
  const dispatch = useTDispatch()
  const [createQuiz] = useCreateQuizMutation()

  useEffect(() => {
    ;(async () => {
      try {
        if (!user) return
        const data = await createQuiz(undefined).unwrap()
        router.push(`/quiz/create/${data.id}`)
      } catch (err) {
        console.error(err)
        dispatch(
          setAlert({ message: "Oups ! Il y a eu un problème", error: true })
        )
      }
    })()
  }, [])

  return redirect ? null : (
    <div className="responsiveLayout h-screen justify-center items-center">
      <Head>
        <title>Créer un quiz</title>
      </Head>
      <Spinner />
      <p>Création d&apos;un nouveau quiz...</p>
    </div>
  )
}

export default GenerateQuiz
