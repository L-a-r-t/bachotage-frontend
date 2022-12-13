import { GetServerSideProps, NextPage } from "next"
import { useEffect, useState } from "react"
import {
  answer,
  endQuiz as _endQuiz,
  initQuiz,
  previous,
  skip,
  startQuiz,
} from "store/quiz.slice"
import { useTDispatch, useTSelector } from "hooks/redux"
import { Change, DBQuiz } from "types/quiz"
import Head from "next/head"
import { useRouter } from "next/router"
import { ALPHABET } from "utils/consts"
import dayjs from "dayjs"
import { adminDB } from "firebaseconfig/admin"
import { setAlert } from "store/modal.slice"
import Latex from "react-latex"
import Popup from "components/UI/Popup"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWarning } from "@fortawesome/free-solid-svg-icons/faWarning"
import {
  arrayUnion,
  doc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { AttemptQuestion } from "types/user"
import WithSlideInHeader from "components/Layout/WithSlideInHeader"
import Spinner from "components/UI/Spinner"
import Link from "next/link"
import { useToggle } from "hooks/index"
import { check } from "utils/functions"
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons/faCircleQuestion"

const TryQuiz: NextPage<Props> = ({ quizProp }) => {
  const dispatch = useTDispatch()
  const [answers, setAnswers] = useState(new Set<number>())
  const [questionTime, setQuestionTime] = useState(dayjs())
  const [quizLength, setQuizLength] = useState(-1)
  const [maxLength, setMaxLength] = useState(quizProp?.questions.length ?? 1)
  const [quizTags, setQuizTags] = useState<string[]>([])
  const [attemptTags, setAttemptTags] = useState<Set<string>>(new Set<string>())
  const [inclusive, toggleInclusive] = useToggle(true)
  const { user } = useTSelector((state) => state.auth)

  const {
    quiz,
    qIndex,
    answers: savedAnswers,
  } = useTSelector((state) => state.quiz)

  const router = useRouter()

  useEffect(() => {
    if (!quizProp) {
      dispatch(setAlert({ message: "Ce quiz n'existe pas", error: true }))
      router.replace("/")
      return
    }
    dispatch(initQuiz(quizProp))
  }, [quizProp]) //eslint-disable-line

  useEffect(() => {
    if (qIndex == quiz?.questions.length) {
      endQuiz()
    }
  }, [qIndex, quiz])

  useEffect(() => {
    setQuizLength((curr) =>
      curr == 0 ? Math.min(5, maxLength) : Math.min(curr, maxLength)
    )
  }, [maxLength])

  useEffect(() => {
    if (!quiz || quizTags.length == 0) return
    const newTags = new Set(quizTags.filter((tag) => !attemptTags.has(tag)))
    setAttemptTags(newTags)
    setMaxLength(
      quiz.questions.filter((q) =>
        q.tags.some((t) => check(newTags.has(t), inclusive))
      ).length
    )
  }, [inclusive])

  useEffect(() => {
    if (quiz) {
      setQuizLength(Math.min(quiz.questions.length, 5))
      const tagsSet = quiz.questions.reduce((set, q) => {
        q.tags.forEach((t) => {
          if (!set.has(t)) set.add(t)
        })
        return set
      }, new Set<string>())
      setQuizTags(Array.from(tagsSet))
      setAttemptTags(tagsSet)
    }
  }, [quiz])

  const handleTag = (tag: string) => {
    if (!quiz) return
    const tags = new Set(attemptTags)
    tags.has(tag) ? tags.delete(tag) : tags.add(tag)
    setAttemptTags(tags)
    setMaxLength(
      quiz.questions.filter((q) =>
        q.tags.some((t) => check(tags.has(t), inclusive))
      ).length
    )
  }

  const handleAnswer = (idx: number) => {
    setAnswers((prev) => {
      if (quiz?.singleAnswer) return new Set([idx])
      const curr = new Set(prev)
      if (curr.has(idx)) curr.delete(idx)
      else curr.add(idx)
      return curr
    })
  }

  const handlePrevious = () => {
    setAnswers(
      new Set<number>(savedAnswers[qIndex - 1].ans.map((ans) => ans.index))
    )
    setQuestionTime(dayjs())
    dispatch(previous())
  }

  const submitAnswers = () => {
    const time = dayjs().diff(questionTime, "s")
    setQuestionTime(dayjs())
    dispatch(answer({ answers: Array.from(answers), time }))
    setAnswers(
      new Set<number>(savedAnswers[qIndex + 1]?.ans.map((ans) => ans.index))
    )
  }

  const start = () => {
    setQuestionTime(dayjs())
    dispatch(
      startQuiz({
        length: quizLength,
        tags: Array.from(attemptTags),
        filter: inclusive,
      })
    )
  }

  const endQuiz = async () => {
    if (!quiz) return
    const answersFeedback = savedAnswers.reduce((acc, q, index) => {
      const dbIndex = quiz.questions[index].index
      const rawQuestionScore = Math.max(
        quiz.negativePoints ? -999 : 0,
        q.ans.reduce((score, ans) => score + (ans.correct ? 1 : -1), 0)
      )
      const userAnswers = q.ans.map((ans) => ans.index)
      const answers = quiz.questions[index].answers.map((ans, idx) => ({
        correct: ans.correct,
        index: ans.index,
        selected: userAnswers.includes(idx),
      }))
      const questionScore =
        rawQuestionScore / answers.filter((ans) => ans.correct).length
      acc.push({
        score: questionScore,
        answers,
        time: q.time,
        index: dbIndex,
        tags: quiz.questions[index].tags,
      })
      return acc
    }, [] as AttemptQuestion[])
    const score = answersFeedback.reduce((acc, ans) => (acc += ans.score), 0)
    const time = answersFeedback.reduce((t, ans) => (t += ans.time), 0)
    const attempt = {
      quizId: router.query.id as string,
      quizName: quiz.name,
      quizVersion: quiz.version,
      date: { _seconds: dayjs().unix(), _nanoseconds: 0 },
      score,
      time,
      questions: answersFeedback,
      uid: user?.uid ?? "",
    }
    const attemptId = `${attempt.quizId}-${attempt.date._seconds}`
    const tempRef = doc(db, "quizzes", attempt.quizId, "data", "temp")
    const quizRef = doc(db, "quizzes", attempt.quizId)
    setDoc(tempRef, { history: arrayUnion(attempt) }, { merge: true })
    updateDoc(quizRef, { tries: increment(1) })
    if (!user) {
      dispatch(_endQuiz(attempt))
      router.replace(`/quiz/${attempt.quizId}/results`)
    } else {
      const attemptRef = doc(db, "users", user.uid, "history", attemptId)
      await setDoc(attemptRef, attempt)
      router.replace({
        pathname: `/quiz/${attempt.quizId}/results`,
        query: { u: user.uid, t: attempt.date._seconds },
      })
    }
  }

  return (
    <WithSlideInHeader>
      <Head>
        <title>Tentative: {quiz?.name ?? ""}</title>
      </Head>
      <div className="p-4 sm:p-8 h-screen">
        {!quiz && (
          <div className="h-full rounded-xl bg-main-10 flex justify-center items-center">
            <Spinner />
          </div>
        )}
        {quiz && qIndex == -1 && quiz.questions.length == 0 && (
          <>
            <div className="h-full rounded-xl bg-main-10 flex flex-col gap-4 justify-center items-center">
              <h1 className="text-center text-xl sm:text-2xl font-bold">
                Quiz: {quiz?.name}
              </h1>
              <p>
                Les questions de ce quiz ne sont pas encore corrigées.
                Contribuez à la correction !
              </p>
              <Link href={`/quiz/${router.query.id as string}`} passHref>
                <a className="button w-fit">Retour au quiz</a>
              </Link>
            </div>
          </>
        )}
        {quiz && qIndex == -1 && quiz.questions.length > 0 && (
          <>
            <div className="h-full rounded-xl bg-main-10 flex flex-col gap-4 justify-center items-center">
              <h1 className="text-center text-xl sm:text-2xl font-bold">
                Quiz: {quiz?.name}
              </h1>
              <p className="text-center">
                {quiz.shuffle ? (
                  <input
                    className="input inline w-12"
                    type="number"
                    value={quizLength}
                    onChange={(e) => setQuizLength(Number(e.target.value))}
                    max={
                      quizTags.length > 0
                        ? quiz.questions.filter((q) =>
                            q.tags.some((t) =>
                              check(attemptTags.has(t), inclusive)
                            )
                          ).length
                        : quiz.questions.length
                    }
                    min={0}
                  />
                ) : (
                  `${quiz.questions.length} `
                )}
                questions à{" "}
                {quiz?.singleAnswer ? "réponse unique" : "réponses multiples"}
              </p>
              <button
                className="button w-fit"
                disabled={quizLength == 0}
                onClick={start}
              >
                Commencer !
              </button>
              <div className="w-clamp">
                <div className="flex justify-center items-center gap-2 my-4">
                  <Popup
                    position="up"
                    popup="Les catégories de questions à inclure/exclure de votre tentative."
                  >
                    Filtres <FontAwesomeIcon icon={faCircleQuestion} />
                  </Popup>
                  <div onClick={() => toggleInclusive()}>
                    <button
                      className={`px-2 py-0.5 rounded-l ${
                        inclusive
                          ? "bg-green-main text-white"
                          : "bg-white text-main-100"
                      } text-sm`}
                    >
                      Inclusifs
                    </button>
                    <button
                      className={`px-2 py-0.5 rounded-r ${
                        inclusive
                          ? "bg-white text-main-100"
                          : "bg-red-main text-white"
                      } text-sm`}
                    >
                      Exclusifs
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {quizTags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleTag(tag)}
                      className={`py-1 px-3 rounded-full ${
                        attemptTags.has(tag) ? "bg-main-100" : "bg-main-50"
                      } text-white text-sm cursor-pointer`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {quiz && qIndex >= 0 && qIndex < quiz.questions.length && (
          <>
            <div
              className="relative p-6 min-h-full sm:h-full rounded-xl bg-main-10 
              flex flex-col justify-between items-center gap-4"
            >
              <div className="absolute top-2 right-0 sm:top-6 sm:right-6 flex w-full justify-center sm:w-auto sm:justify-start gap-2 items-center text-lg">
                {quiz.changes[quiz.questions[qIndex].index] !== null && (
                  <Popup
                    position="left"
                    popup="La réponse à cette question est débattue"
                  >
                    <FontAwesomeIcon
                      icon={faWarning}
                      className="text-yellow-500 text-xl"
                    />
                  </Popup>
                )}
                <p className="font-bold">
                  {qIndex + 1}/{quiz.questions.length}
                </p>
              </div>
              <h1 className="text-center text-xl sm:text-2xl font-bold mt-2 sm:mt-0">
                Quiz: {quiz.name}
              </h1>
              <h2
                className={`text-center text-xl ${
                  quiz.questions[qIndex].prompt.length > 50 ? "" : "sm:text-2xl"
                }`}
              >
                <Latex>{quiz.questions[qIndex].prompt}</Latex>
              </h2>
              <div className="flex flex-col justify-between items-center gap-4">
                <span className="flex flex-col sm:flex-row sm:justify-center gap-4">
                  {quiz.questions[qIndex].answers.map((ans, idx) => (
                    <button
                      key={ans.text}
                      className={`relative button min-w-36 max-w-full sm:max-w-1/4 justify-center bg-transparent 
                      border-2 border-blue-main transition-colors duration-300
                      ${
                        answers.has(idx)
                          ? "bg-blue-main text-white"
                          : "text-black"
                      }`}
                      onClick={() => handleAnswer(idx)}
                    >
                      <span className="absolute top-0.5 right-2">
                        {ALPHABET[idx]}
                      </span>
                      <Latex>{ans.text}</Latex>
                    </button>
                  ))}
                </span>
                <div className="flex flex-col-reverse sm:flex-row gap-4">
                  {qIndex > 0 && (
                    <button
                      className="button bg-transparent text-black text-lg"
                      onClick={handlePrevious}
                    >
                      Précedent
                    </button>
                  )}
                  <button className="button text-lg" onClick={submitAnswers}>
                    {qIndex == quiz.questions.length - 1
                      ? "Terminer"
                      : answers.size > 0
                      ? "Répondre"
                      : "Sauter"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </WithSlideInHeader>
  )
}

export default TryQuiz

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const quizId = context.params?.id as string

  const quizRef = adminDB.doc(`quizzes/${quizId}`)
  const quizDoc = await quizRef.get()

  if (!quizDoc.exists)
    return {
      props: {
        quizProp: null,
      },
    }
  const quizProp = JSON.parse(JSON.stringify(quizDoc.data() as DBQuiz))

  return {
    props: {
      quizProp,
    },
  }
}

type Props = {
  quizProp: DBQuiz | null
}
