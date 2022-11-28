import WithHeader from "components/Layout/WithHeader"
import Input from "components/UI/Input"
import { useTDispatch, useTSelector } from "hooks/redux"
import { GetServerSideProps, NextPage } from "next"
import { FieldValues, useForm } from "react-hook-form"
import { setAlert, setModal } from "store/modal.slice"
import { DBQuiz } from "types/quiz"
import { useProtect } from "hooks"
import { adminDB } from "firebaseconfig/admin"
import { db } from "firebaseconfig"
import { useState, useEffect, useRef } from "react"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import Spinner from "components/UI/Spinner"
import { removeQuestion, setQuestions } from "store/createQuestion.slice"
import Latex from "react-latex"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan"
import Popup from "components/UI/Popup"
import CategoryBox from "components/Modules/CategoryBox"
import { Category } from "types/index"
import { toSlug } from "utils/functions"
import Link from "next/link"
import Head from "next/head"

const CreateQuiz: NextPage<Props> = ({ quiz, quizId }) => {
  const { redirect } = useProtect(
    quiz?.authorId,
    "Vous n'êtes pas l'auteur de ce quiz"
  )
  const dispatch = useTDispatch()
  const formRef = useRef<HTMLFormElement>(null)
  const { questions } = useTSelector((state) => state.createQuestion)
  const { user } = useTSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [selected, setSelected] = useState(quiz?.categories ?? ([] as string[]))
  const [categories, setCategories] = useState([] as Category[])
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      name: quiz?.name,
      singleAnswer: quiz?.singleAnswer,
      negativePoints: quiz?.negativePoints,
      shuffle: quiz?.shuffle,
      desc: quiz?.desc,
    },
  })

  useEffect(() => {
    if (quiz) dispatch(setQuestions(quiz.questions))
  }, [quiz]) // eslint-disable-line

  useEffect(() => {
    ;(async () => {
      const ref = doc(db, "global", "categories")
      const categoriesDoc = await getDoc(ref)
      const data = categoriesDoc.data()
      if (data) setCategories(Object.values(data))
    })()
  }, [])

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      return
    }
    formRef.current?.requestSubmit()
  }, [questions])

  const select = (option: string) => {
    setSelected((prev) => [...prev, option])
  }

  const unselect = (option: string) => {
    const index = selected.indexOf(option)
    setSelected((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  const publish = () => {
    if (!getValues("desc")) {
      dispatch(
        setAlert({
          message: "Votre quiz doit avoir une description",
          error: true,
        })
      )
      return
    }
    if (questions.length == 0) {
      dispatch(
        setAlert({
          message: "Votre quiz doit contenir au moins une question",
          error: true,
        })
      )
      return
    }
    if (selected.length == 0) {
      dispatch(
        setAlert({
          message: "Votre quiz doit avoir au moins une catégorie",
          error: true,
        })
      )
      return
    }
    dispatch(
      setModal({
        modal: "publishQuiz",
        props: { questions: questions.length, categories: categories },
      })
    )
  }

  const onSubmit = async (data: FieldValues) => {
    if (!user) return
    try {
      const quizRef = doc(db, "quizzes", quizId)
      setLoading(true)
      const names = categories.map((c) => c.name)
      const inedit = selected.reduce(
        (acc, curr) => (names.includes(curr) ? acc : [...acc, curr]),
        [] as string[]
      )
      if (inedit.length > 0) {
        inedit.forEach((c) =>
          updateDoc(doc(db, "global", "categories"), {
            [toSlug(c)]: {
              authorId: user.uid,
              name: c,
              slug: toSlug(c),
              quizzes: 0,
            } as Category,
          })
        )
      }
      await updateDoc(quizRef, {
        ...data,
        questions: [...questions],
        categories: selected,
      })
      dispatch(setAlert({ message: "Quiz sauvegardé!", dontOverride: true }))
    } catch (err) {
      console.error(err)
      dispatch(
        setAlert({ message: "La sauvegarde du quiz a échoué", error: true })
      )
    } finally {
      setLoading(false)
    }
  }

  return !quiz || redirect ? null : (
    <WithHeader stickyHeader>
      <Head>
        <title>Créer: {quiz?.name!}</title>
      </Head>
      <form
        id="quiz"
        ref={formRef}
        className="p-4 md:px-8 min-h-fit-screen flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="text-3xl font-bold focus-visible:outline-transparent -mb-2 flex-grow max-w-full
            border-b-2 border-transparent border-spacing-1 focus-visible:border-black overflow-y-visible"
          {...register("name", { required: true })}
        />
        <div className="grid gap-4 md:gap-8 grid-cols-3 flex-grow">
          <div className="col-span-3 sm:col-span-1 flex flex-col">
            <h2 className="text-lg mb-2">Informations</h2>
            <fieldset className="w-full bg-main-10 rounded p-4 flex flex-col gap-2 flex-grow shadow-sm">
              <Input
                name="singleAnswer"
                errors={errors}
                label="Réponse unique"
                check
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("singleAnswer")}
                />
              </Input>
              <Input
                name="negativePoints"
                errors={errors}
                label="Points négatifs"
                check
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("negativePoints")}
                />
              </Input>
              <Input
                name="shuffle"
                errors={errors}
                label="Questions mélangées"
                check
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("shuffle")}
                />
              </Input>
              <div>
                <p>Catégories (3 max)</p>
                <CategoryBox
                  categories={categories}
                  selected={selected}
                  select={select}
                  unselect={unselect}
                />
              </div>
              <Input
                name="desc"
                errors={errors}
                label="Description"
                className="group"
              >
                <textarea
                  className="input border-none bg-main-10 hidden group-hover:block focus-visible:block"
                  rows={4}
                  {...register("desc")}
                />
                <div className="input border-none min-h-[3rem] bg-main-10 group-hover:hidden group-focus-within:hidden">
                  <Latex>{watch().desc}</Latex>
                </div>
              </Input>
            </fieldset>
          </div>
          <div className="flex-grow col-span-3 sm:col-span-2 flex flex-col">
            <h2 className="text-lg mb-2">Questions ({questions.length})</h2>
            <fieldset className="bg-main-10 rounded p-4 flex flex-col gap-4 flex-grow">
              {questions.map((q, index) => (
                <div
                  key={`q${index}`}
                  className="bg-main-20 rounded p-4 flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    dispatch(
                      setModal({
                        modal: "addQuestion",
                        props: { question: q, qIndex: index },
                      })
                    )
                  }
                >
                  <div className="flex flex-col">
                    <div className="flex gap-2 flex-wrap">
                      <p className="font-bold">
                        Question #{index + 1} ({q.answers.length} réponses,{" "}
                        {q.answers.some((a) => a.correct)
                          ? "corrigées"
                          : "non corrigées"}
                        )
                      </p>
                      {q.tags?.map((tag) => (
                        <span
                          key={q.prompt + tag}
                          className="py-0.5 px-2 text-sm bg-main-5 rounded-full w-max"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Latex>{q.prompt}</Latex>
                  </div>
                  <button
                    className="text-slate-600 text-lg"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(removeQuestion(index))
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              ))}
              <button
                className="button"
                type="button"
                onClick={() => dispatch(setModal({ modal: "addQuestion" }))}
              >
                Ajouter une question
              </button>
            </fieldset>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-4">
            <button className="button" type="submit" form="quiz">
              Sauvegarder{loading && <Spinner small white />}
            </button>
            <button
              className="button bg-main-20 text-main-100"
              type="submit"
              onClick={publish}
            >
              Publier
            </button>
          </div>
          <Popup
            position="left"
            popup="QOAT utilise KaTeX ! Découvrez tout ce que vous pouvez faire avec"
          >
            <Link href="/katex" passHref>
              <a className="relative text-xl" target="_blank" rel="noreferrer">
                <div className="-z-10">
                  <Latex>$$\KaTeX$$</Latex>
                </div>
              </a>
            </Link>
          </Popup>
        </div>
      </form>
    </WithHeader>
  )
}

export default CreateQuiz

type Props = {
  quiz: DBQuiz | null
  quizId: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const id = context.params?.id as string

  const quiz = (
    await adminDB.doc(`quizzes/${id}`).get()
  ).data() as unknown as DBQuiz

  return {
    props: {
      quiz: quiz ?? null,
      quizId: id,
    },
  }
}
