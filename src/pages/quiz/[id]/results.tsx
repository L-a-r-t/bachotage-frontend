import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft"
import { faWarning } from "@fortawesome/free-solid-svg-icons/faWarning"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AnimatedCount from "components/UI/AnimatedCount"
import Pagination from "components/UI/Pagination"
import dayjs from "dayjs"
import { httpsCallable } from "firebase/functions"
import { functions } from "firebaseconfig"
import { ALPHABET } from "utils/consts"
import { useTDispatch, useTSelector } from "hooks/redux"
import usePagination from "hooks/usePagination"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Latex from "react-latex"
import { setDiscussion } from "store/discussion.slice"
import { setSideModal } from "store/modal.slice"
import { toQuestion } from "store/quiz.slice"
import Popup from "components/UI/Popup"
import { Popover, Transition } from "@headlessui/react"
import { protect } from "utils/functions"
import { Attempt } from "types/user"
import { adminDB } from "firebaseconfig/admin"
import { DBQuiz } from "types/quiz"
import WithSlideInHeader from "components/Layout/WithSlideInHeader"
import Link from "next/link"
import TipOfTheDay from "components/UI/Tip"

const QuizResults: NextPage<Props> = ({ attempt: _attempt, quiz: _quiz }) => {
  const dispatch = useTDispatch()
  const { user } = useTSelector((state) => state.auth)
  const {
    dbQuiz: dbQuiz,
    feedback,
    qIndex: _qIndex,
  } = useTSelector((state) => state.quiz)
  const { discussion, discussionQuizId } = useTSelector(
    (state) => state.discussion
  )
  const [minutes, setMinutes] = useState(0)
  const [recap, setRecap] = useState(true)

  const [attempt, setAttempt] = useState(_attempt ?? feedback)
  const [quiz, setQuiz] = useState(_quiz ?? dbQuiz)
  const [qIndex, setqIndex] = useState(attempt?.questions[_qIndex]?.index ?? -1)

  useEffect(() => {
    setAttempt(_attempt ?? feedback)
  }, [feedback, _attempt])

  useEffect(() => {
    setQuiz(_quiz ?? dbQuiz)
  }, [_quiz, dbQuiz])

  useEffect(() => {
    setqIndex(attempt?.questions[_qIndex]?.index ?? -1)
  }, [_qIndex, attempt])

  const getStyle = (
    answer: { index: number; selected: boolean; correct: boolean },
    proposedAnswer: boolean
  ) => {
    if (!answer.correct && !answer.selected && !proposedAnswer)
      return "bg-transparent border-blue-main text-blue-main"
    if (!answer.correct && !answer.selected && proposedAnswer)
      return "bg-transparent border-2 border-yellow-500 text-blue-main"
    let style = "border-2"
    const color = answer.correct ? "green-main" : "red-main"
    const bgColor = answer.selected ? color : "transparent"
    const borderColor = proposedAnswer ? "yellow-500" : color
    style += ` bg-${bgColor} text-${
      bgColor == "transparent" ? color : "white"
    } border-${borderColor}`
    return style
  }

  const router = useRouter()
  const { paginationProps, handlePagination } = usePagination({
    defaultCurrentPage: qIndex,
    defaultPageSize: 1,
    total: attempt?.questions.length ?? 1,
    onChange: ({ currentPage }) => {
      dispatch(toQuestion(currentPage - 1))
    },
  })

  useEffect(() => {
    if (!attempt || !quiz) {
      router.replace(`/quiz/${router.query.id}`)
    }
    setMinutes(Math.floor((attempt?.time ?? 0) / 60))
  }, [attempt, quiz])

  useEffect(() => {
    if (discussion && discussionQuizId == router.query.id) return
    else dispatch(setDiscussion(null))
    if (!user) return
    ;(async () => {
      const getDiscussion = httpsCallable(functions, "getDiscussion")
      const newDiscussion = (
        await getDiscussion({ quizId: router.query.id as string })
      ).data
      if (!newDiscussion) return
      dispatch(
        setDiscussion({
          discussion: Object.values(newDiscussion),
          quizId: router.query.id as string,
        })
      )
    })()
  }, [discussion, discussionQuizId, user])

  const showDiscussion = protect(() => {
    if (!quiz?.published) return
    dispatch(
      setSideModal({ modal: "discussQuestion", props: { quiz, qIndex } })
    )
  }, "Vous devez être connecté pour voir la discussion")

  return (
    <WithSlideInHeader>
      <Head>
        <title>{`Résultats: ${quiz?.name}`}</title>
      </Head>
      <div className="p-4 sm:p-8 h-screen">
        <div className="relative p-6 pt-10 sm:pt-6 min-h-full sm:h-full rounded-xl bg-main-10 flex flex-col justify-between items-center overflow-y-auto gap-6">
          <Link href={`/quiz/${router.query.id as string}`} passHref>
            <a>
              <h1 className="text-center text-xl sm:text-2xl font-bold">
                Quiz: {quiz?.name}
              </h1>
            </a>
          </Link>
          {attempt && recap && (
            <>
              <Link href={`/quiz/${router.query.id as string}`} passHref>
                <a className="absolute left-4 top-2 text-xl">
                  <FontAwesomeIcon icon={faHouse} />
                </a>
              </Link>
              <div className="flex flex-col justify-center items-center">
                <p>Ta note est de</p>
                <p className="text-5xl font-bold">
                  <AnimatedCount target={attempt?.score} duration={1500} />/
                  {attempt?.questions.length}
                </p>
                <p>
                  Temps total :{" "}
                  {minutes > 0
                    ? `${minutes}m${attempt.time - minutes * 60}s`
                    : `${attempt.time}s`}
                </p>
              </div>
              <div>
                {/* <p className="text-center font-bold mb-4">Recap</p> */}
                <ol className="flex flex-wrap gap-6 justify-center">
                  {attempt?.questions.map((q, index) => (
                    <li
                      key={`question${index}`}
                      className="cursor-pointer p-2 rounded-md transition duration-200 
                      border border-transparent hover:shadow-sm hover:border-gray-400"
                      onClick={() => {
                        handlePagination(index + 1, 1)
                        setRecap(false)
                      }}
                    >
                      <p className="text-center">
                        Question {index + 1} ({q.time}s)
                      </p>
                      <div className="flex gap-2 justify-center">
                        {q.answers.map((ans, idx) => {
                          return (
                            <div
                              key={`question${index}answer${idx}`}
                              className={`h-6 w-6 rounded-md border flex justify-center items-center ${getStyle(
                                ans,
                                Boolean(
                                  quiz?.changes[q.index]?.answers[ans.index]
                                    .correct
                                )
                              )}`}
                            >
                              {ALPHABET[idx]}
                            </div>
                          )
                        })}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
          {attempt && quiz && !recap && (
            <>
              <button
                className="absolute left-4 top-2 text-xl z-[1]"
                onClick={() => setRecap(true)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              {quiz.changes[qIndex] !== null && (
                <Popover className="absolute top-3 right-0 sm:right-4 w-full sm:w-auto flex justify-center">
                  <Popover.Button>
                    <Popup
                      position="left"
                      popup="La réponse à cette question est débattue"
                    >
                      <FontAwesomeIcon
                        icon={faWarning}
                        className="text-yellow-500 text-xl"
                      />
                    </Popup>
                  </Popover.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Popover.Panel
                      className="absolute top-full z-10 sm:left-auto sm:transform-none sm:right-0 w-72 bg-white p-4 rounded 
                      shadow border border-main-50 left-1/2 transform -translate-x-1/2 mt-2"
                    >
                      <p>
                        La réponse à cette question est débattue. Les
                        propositions de bonnes réponses sont encadrées en{" "}
                        <span className="font-bold text-yellow-500">jaune</span>
                        , les réponses non encadrées sont donc proposées comme
                        étant fausses.
                      </p>
                      <p
                        className="text-center mt-2 underline cursor-pointer"
                        onClick={showDiscussion}
                      >
                        Voir le débat
                      </p>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              )}
              <h2
                className="text-center text-xl sm:text-2xl cursor-help"
                onClick={showDiscussion}
              >
                <Latex>
                  {quiz.questions[attempt.questions[_qIndex].index].prompt}
                </Latex>
              </h2>
              <div className="flex flex-col justify-between items-center gap-4">
                <span className="flex flex-col sm:flex-row justify-center gap-4">
                  {attempt.questions[_qIndex].answers.map((ans, idx) => {
                    const qIndex = attempt?.questions[_qIndex]?.index ?? -1
                    const answer = quiz.questions[qIndex].answers[ans.index]
                    const proposedAnswer =
                      quiz.changes[qIndex]?.answers[ans.index].correct
                    const AnswerButton = ({ popup }: { popup?: boolean }) => (
                      <button
                        key={`${answer.text}button`}
                        type="button"
                        className={`relative button min-w-36 ${
                          !popup && "sm:max-w-1/4"
                        } 
                        justify-center border ${getStyle(
                          ans,
                          Boolean(proposedAnswer)
                        )} cursor-help h-full`}
                        onClick={showDiscussion}
                      >
                        <span
                          className="absolute top-0 right-0 px-1 border-l border-b border-inherit
                      rounded-bl-md"
                        >
                          {ALPHABET[idx]}
                        </span>
                        <Latex>{answer.text}</Latex>
                      </button>
                    )
                    if (!quiz.changes[qIndex])
                      return <AnswerButton key={`${idx}button`} />
                    if (ans.correct && !proposedAnswer)
                      return (
                        <Popup
                          key={answer.text}
                          position="up"
                          popup="Cette réponse est peut-être fausse"
                        >
                          <AnswerButton popup />
                        </Popup>
                      )
                    if (proposedAnswer && !ans.correct)
                      return (
                        <Popup
                          key={answer.text}
                          position="up"
                          popup="Cette réponse est peut-être vraie"
                        >
                          <AnswerButton popup />
                        </Popup>
                      )
                    return <AnswerButton key={`${idx}button`} />
                  })}
                </span>
                <Pagination onChange={handlePagination} {...paginationProps} />
              </div>
            </>
          )}
        </div>
      </div>
      <TipOfTheDay />
    </WithSlideInHeader>
  )
}

export default QuizResults

type Props = {
  attempt: Attempt | null
  quiz: DBQuiz | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { u, t } = context.query
  const id = context.params?.id as string

  if (!u || !t) {
    return {
      props: {
        attempt: null,
        quiz: null,
      },
    }
  }

  const attemptRef = adminDB.doc(`users/${u}/history/${id}-${t}`)
  const quizRef = adminDB.doc(`quizzes/${id}`)
  const res = await Promise.all([attemptRef.get(), quizRef.get()])
  const attempt = res[0].data() as Attempt
  const quiz = JSON.parse(JSON.stringify(res[1].data() as DBQuiz))

  return {
    props: {
      attempt: attempt ?? null,
      quiz: quiz ?? null,
    },
  }
}
