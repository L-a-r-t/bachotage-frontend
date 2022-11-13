import { useTDispatch, useTSelector } from "hooks/redux"
import { useState } from "react"
import Latex from "react-latex"
import { FieldValues, useForm } from "react-hook-form"
import { setAlert, setModal } from "store/modal.slice"
import Input from "components/UI/Input"
import { Transition } from "@headlessui/react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "firebaseconfig"
import { useRouter } from "next/router"
import { AppQuiz, Change, DBQuiz } from "types/quiz"
import Spinner from "components/UI/Spinner"
import { addChange } from "store/quiz.slice"

export default function SubmitAnswerModal({
  appQuiz,
  appIndex,
  dbQuiz,
  dbIndex,
}: Props) {
  const [answers, setAnswers] = useState(new Set<number>())
  const [loading, setLoading] = useState(false)
  const quiz = appQuiz || dbQuiz
  const qIndex = appIndex || dbIndex
  const { user } = useTSelector((state) => state.auth)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const dispatch = useTDispatch()
  const router = useRouter()

  const handleAnswer = (idx: number) => {
    setAnswers((prev) => {
      if (quiz.singleAnswer) return new Set([idx])
      const curr = new Set(prev)
      if (curr.has(idx)) curr.delete(idx)
      else curr.add(idx)
      return curr
    })
  }

  const onSubmit = async (data: FieldValues) => {
    if (!user) return
    const answersArray = Array.from(answers)
    if (
      quiz.questions[qIndex].answers.every(
        (ans, index) =>
          !ans.correct || (ans.correct && answersArray.includes(index))
      ) &&
      answersArray.every(
        (ans, index) => quiz.questions[qIndex].answers[index].correct
      )
    ) {
      dispatch(
        setAlert({
          message:
            "Votre proposition correspond parfaitement aux réponses actuelles",
          error: true,
        })
      )
      return
    }

    const realAnswers = appQuiz
      ? answersArray.map((ans) => appQuiz.questions[qIndex].answers[ans].index)
      : answersArray
    try {
      const quizRef = doc(db, "quizzes", router.query.id as string)
      const change = {
        type: ["answer"],
        argument: data.argument,
        author: user.username,
        authorId: user.uid,
        votes: {},
        prompt: null,
        answers: dbQuiz.questions[dbIndex].answers.map((ans, index) => ({
          text: null,
          correct: realAnswers.includes(index),
        })),
      } as Change
      setLoading(true)
      await updateDoc(quizRef, {
        [`changes.${dbIndex}`]: change,
      })
      dispatch(addChange({ change, index: dbIndex }))
      dispatch(
        setAlert({ message: "Proposition de réponse soumise au vote !" })
      )
      dispatch(setModal({ modal: null }))
    } catch (err) {
      dispatch(
        setAlert({
          message: "Oups ! Il y a eu une erreur",
          error: true,
        })
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
    console.log({ data, answers: Array.from(answers), realAnswers })
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <h2 className="text-xl font-bold">Proposer une réponse</h2>
      {quiz.singleAnswer ? (
        <p>Sélectionnez la réponse que vous estimez être la bonne</p>
      ) : (
        <p>Sélectionnez les réponses que vous estimez être les bonnes</p>
      )}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:flex-wrap">
        {quiz.questions[qIndex].answers.map((ans, idx) => (
          <button
            key={ans.text}
            type="button"
            className={`relative button min-w-28 sm:max-w-[calc(25%-0.5rem)] justify-center bg-transparent 
                      border-2 border-blue-main transition-colors duration-300 text-sm
                      ${
                        answers.has(idx)
                          ? "bg-blue-main text-white"
                          : "text-black"
                      }`}
            onClick={() => handleAnswer(idx)}
          >
            <Latex>{ans.text}</Latex>
          </button>
        ))}
      </div>
      <Transition
        show={answers.size > 0}
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-y-50 -translate-y-20 opacity-0"
        enterTo="transform scale-y-100 translate-y-0 opacity-100"
        leave="transition duration-200 ease-in"
        leaveFrom="transform scale-y-100 translate-y-0 opacity-100"
        leaveTo="transform scale-y-50 -translate-y-20 opacity-0"
      >
        <form onSubmit={handleSubmit(onSubmit)} id="submitAnswer">
          <Input
            name="argument"
            errors={errors}
            label="Argumentez votre proposition"
          >
            <textarea
              className="input"
              rows={4}
              {...register("argument", { required: true })}
            />
          </Input>
          <div className="flex justify-center items-center gap-2 mt-4">
            <button type="submit" className="button" form="submitAnswer">
              Soumettre {loading && <Spinner small white />}
            </button>
            <button
              type="button"
              className="button bg-main/10 text-main/50"
              onClick={() => dispatch(setModal({ modal: null }))}
            >
              Annuler
            </button>
          </div>
        </form>
      </Transition>
    </div>
  )
}

type Props = {
  appQuiz?: AppQuiz
  dbQuiz: DBQuiz
  appIndex?: number
  dbIndex: number
}
