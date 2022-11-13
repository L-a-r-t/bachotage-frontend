import Spinner from "components/UI/Spinner"
import { httpsCallable } from "firebase/functions"
import { functions } from "firebaseconfig"
import { useProtect } from "hooks"
import { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { GenerateQuizReq, GenerateQuizRes } from "types/functions"

const GenerateQuiz: NextPage = () => {
  const { user, redirect } = useProtect()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      if (!user) return
      const generateQuiz = httpsCallable<GenerateQuizReq, GenerateQuizRes>(
        functions,
        "generateQuiz"
      )
      const { data } = await generateQuiz()
      if (data.id) {
        router.push(`/quiz/create/${data.id}`)
      } else {
        console.error("Couldn't generate a quiz")
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
