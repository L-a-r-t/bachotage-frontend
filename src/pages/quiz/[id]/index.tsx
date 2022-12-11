import { adminDB } from "firebaseconfig/admin"
import { GetServerSideProps, NextPage } from "next"
import { DBQuiz } from "types/quiz"
import { Fragment, useEffect, useState, useRef } from "react"
import { useTDispatch, useTSelector } from "hooks/redux"
import { useRouter } from "next/router"
import { setAlert, setModal } from "store/modal.slice"
import WithHeader from "components/Layout/WithHeader"
import { Tab } from "@headlessui/react"
import Link from "next/link"
import Spinner from "components/UI/Spinner"
import Pagination from "components/UI/Pagination"
import usePagination from "hooks/usePagination"
import { httpsCallable } from "firebase/functions"
import { db, functions } from "firebaseconfig"
import { pickSortingOption, setDiscussion } from "store/discussion.slice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Latex from "react-latex"
import useMessage from "hooks/useMessage"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane"
import { faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons/faArrowUpWideShort"
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons/faArrowDownWideShort"
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons/faBookmark"
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons/faBookmark"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical"
import { faFlag } from "@fortawesome/free-solid-svg-icons/faFlag"
import WIP from "components/UI/WIP"
import ProposedChange from "components/Modules/ProposedChange"
import Message from "components/UI/Message"
import { formatDate, formatTime, protect, sortMessages } from "utils/functions"
import DropdownPopup from "components/UI/DropdownPopup"
import Popup from "components/UI/Popup"
import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { setAuth } from "store/auth.slice"
import { Attempt, LightQuiz } from "types/user"
import Head from "next/head"
import { useGetQuizHistoryQuery } from "store/historyApi"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Line, getElementAtEvent } from "react-chartjs-2"
import dayjs from "dayjs"
import AnimatedCount from "components/UI/AnimatedCount"
import TipOfTheDay from "components/UI/Tip"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const AboutQuiz: NextPage<Props> = ({ quizProp, quizId, tab }) => {
  const [quiz, setQuiz] = useState(quizProp)
  const dispatch = useTDispatch()
  const router = useRouter()
  const chartRef = useRef<any>()
  const timesRef = useRef<any>()
  const [message, setMessage] = useState("")
  const [longAnswers, setLongAnswers] = useState(false)
  const [page, setPage] = useState(1)
  const { sendMsg: send, loading, voteMsg } = useMessage()
  const { user } = useTSelector((state) => state.auth)
  const { data: userHistory, isLoading } = useGetQuizHistoryQuery({
    quizId,
    uid: user?.uid ?? "",
  })
  const { discussion, discussionQuizId, currentSort } = useTSelector(
    (state) => state.discussion
  )
  const { paginationProps: pProps, handlePagination } = usePagination({
    defaultCurrentPage: 1,
    defaultPageSize: 1,
    total: quiz?.questions.length ?? 1,
  })

  useEffect(() => {
    if (!quiz) {
      dispatch(setAlert({ message: "Ce quiz n'existe pas.", error: true }))
      router.replace("/")
    }
  }, [quiz, router]) // eslint-disable-line

  useEffect(() => {
    if (discussion && discussionQuizId == quizId) return
    else dispatch(setDiscussion(null))
    if (!user) return
    ;(async () => {
      const getDiscussion = httpsCallable(functions, "getDiscussion")
      const newDiscussion = (await getDiscussion({ quizId })).data
      if (!newDiscussion) return
      dispatch(
        setDiscussion({
          discussion: Object.values(newDiscussion),
          quizId: quizId as string,
        })
      )
    })()
  }, [discussion, discussionQuizId, user])

  useEffect(() => {
    if (!quiz) return
    const newPage = pProps.currentPage - 1
    setPage(newPage)
    setLongAnswers(
      quiz.questions[newPage].answers.some((ans) => ans.text.length > 64)
    )
  }, [pProps.currentPage, quiz])

  const sendMsg = protect(async () => {
    const msg = message
    setMessage("")
    await send(msg, pProps.currentPage - 1)
  })

  const saveQuiz = protect(async () => {
    if (!user || !user.data || !quiz) return
    const dataRef = doc(db, "users", user.uid, "private", "data")
    const lightQuiz: LightQuiz = { ...quiz, id: quizId }
    await updateDoc(dataRef, {
      savedQuizzes: arrayUnion(lightQuiz),
    })
    dispatch(
      setAuth({
        ...user,
        data: {
          ...user.data,
          savedQuizzes: [...user.data.savedQuizzes, lightQuiz],
        },
      })
    )
    dispatch(
      setAlert({
        message:
          "Quiz enregistré ! Vous pouvez à présent y accéder depuis votre profil",
      })
    )
  })

  const unsaveQuiz = protect(async () => {
    if (!user || !user.data) return
    const dataRef = doc(db, "users", user.uid, "private", "data")
    const newArr = user.data.savedQuizzes.filter((q) => q.id != quizId)
    await updateDoc(dataRef, {
      savedQuizzes: newArr,
    })
    dispatch(setAuth({ ...user, data: { ...user.data, savedQuizzes: newArr } }))
    dispatch(
      setAlert({
        message: "Quiz retiré de la liste des quiz enregistés",
      })
    )
  })

  const onHistoryClick = (e: any) => {
    if (!getElementAtEvent(chartRef.current, e)[0]) return
    const data = (getElementAtEvent(chartRef.current, e)[0].element as any)
      .$context.raw as HistoryChartData
    router.push({
      pathname: `/quiz/${router.query.id as string}/results`,
      query: { u: data.uid, t: data.t },
    })
  }

  const sortOptions = {
    recent: (
      <>
        <FontAwesomeIcon icon={faArrowUpWideShort} /> Récent
      </>
    ),
    old: (
      <>
        <FontAwesomeIcon icon={faArrowDownWideShort} /> Ancien
      </>
    ),
    relevant: (
      <>
        <FontAwesomeIcon icon={faCheck} /> Pertinent
      </>
    ),
  }

  const tabs = ["Général", "Discussion", "Mes stats"]

  return quiz ? (
    <WithHeader className="bg-main-100 text-white">
      <Head>
        <title>Quiz: {quizProp?.name!}</title>
        <meta name="description" content={quizProp?.desc!} />
      </Head>
      <div className="min-h-fit-screen flex flex-col">
        <div className="pb-9 md:pb-12 pt-8 sm:pt-3 px-8 md:px-12 grid grid-cols-3 gap-10 items-center bg-main-100 rounded-b-3xl text-white">
          <div className="col-span-3 md:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Quiz: {quiz.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {quiz.categories.map((category) => (
                <span
                  key={category}
                  className="py-1 px-3 rounded-full bg-white text-main-100 text-sm min-w-max"
                >
                  {category}
                </span>
              ))}
              <div className="text-lg">
                {user?.data &&
                user.data.savedQuizzes.some((q) => q.id == quizId) ? (
                  <Popup position="down" popup="Quiz enregistré">
                    <button aria-label="Retirer" onClick={unsaveQuiz}>
                      <FontAwesomeIcon icon={fasBookmark} />
                    </button>
                  </Popup>
                ) : (
                  <Popup position="down" popup="Enregistrer le quiz">
                    <button aria-label="Enregistrer" onClick={saveQuiz}>
                      <FontAwesomeIcon icon={farBookmark} />
                    </button>
                  </Popup>
                )}
              </div>
              <DropdownPopup
                label={<FontAwesomeIcon icon={faEllipsisVertical} />}
                items={[
                  <Link
                    href={`/quiz/${router.query.id as string}/try`}
                    key="Tentative"
                  >
                    <a className="text-black">Tentative</a>
                  </Link>,
                  user?.data && (
                    <button
                      className="text-black"
                      onClick={
                        user.data.savedQuizzes.some((q) => q.id == quizId)
                          ? unsaveQuiz
                          : saveQuiz
                      }
                      key="Enregistrer"
                    >
                      {user.data.savedQuizzes.some((q) => q.id == quizId)
                        ? "Enregistré"
                        : "Enregistrer"}
                    </button>
                  ),
                  // <button
                  //   className="text-black"
                  //   key="Signalerlequiz"
                  //   onClick={() =>
                  //     dispatch(
                  //       setAlert({
                  //         message: "Votre signalement a été pris en compte",
                  //       })
                  //     )
                  //   }
                  // >
                  //   <FontAwesomeIcon icon={faFlag} /> Signaler
                  // </button>,
                ]}
              />
            </div>
          </div>
          <Link href={`/quiz/${router.query.id as string}/try`}>
            <a className="button bg-white text-main-100 col-span-3 md:col-span-1">
              Tentative
            </a>
          </Link>
        </div>
        <Tab.Group defaultIndex={tab || 0} as={Fragment}>
          <Tab.List className="flex justify-center sm:justify-start px-8 sm:px-12 pt-2">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className="py-1 px-2 font-semibold rounded text-main-100 
                ui-selected:bg-main-100 ui-selected:text-white"
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="px-4 md:px-8 flex-grow mt-2">
            <Tab.Panel className="grid grid-cols-3 grid-rows-2 gap-4 sm:gap-8 min-h-full">
              <div className="p-4 col-span-3 sm:col-span-2">
                <p className="text-xl">
                  <span className="font-bold">{quiz.questions.length}</span>{" "}
                  questions |{" "}
                  {quiz.singleAnswer ? "réponse unique" : "réponses multiples"}
                  {quiz.negativePoints && " | points négatifs"}
                </p>
                <Latex>{quiz.desc}</Latex>
              </div>
              <div className="bg-main-10 col-span-3 sm:col-span-1 rounded p-4 flex flex-col">
                <h2 className="font-semibold">Mon score moyen</h2>
                <div className="flex-grow flex items-center justify-center">
                  {userHistory ? (
                    userHistory.attempts.length > 0 ? (
                      <p className="text-4xl font-bold">
                        <AnimatedCount
                          target={
                            Math.round(
                              (10 *
                                userHistory.attempts.reduce(
                                  (acc, attempt) =>
                                    (acc +=
                                      Math.round(
                                        (attempt.score * 100) /
                                          attempt.questions.length
                                      ) / 10),
                                  0
                                )) /
                                userHistory.attempts.length
                            ) / 10
                          }
                          duration={1000}
                        />
                        /10
                      </p>
                    ) : (
                      <p>{"Vous n'avez encore jamais passé ce quiz"}</p>
                    )
                  ) : (
                    <div className="flex flex-col items-center">
                      <p>Connectez-vous pour accéder à vos statistiques</p>
                      <button
                        className="button"
                        onClick={() => dispatch(setModal({ modal: "login" }))}
                      >
                        Se connecter
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-main-10 rounded p-4 col-span-3 sm:col-span-2">
                <h2 className="font-semibold">Je sais pas quoi mettre ici</h2>
                <div className="flex justify-center">
                  <div className="w-32">
                    <WIP />
                  </div>
                </div>
              </div>
              <div className="bg-main-10 rounded p-4 overflow-y-auto col-span-3 sm:col-span-1">
                <h2 className="font-semibold">Mises à jour</h2>
                {quiz.questions.some((q, idx) => quiz.changes[idx]) ? (
                  <div className="flex flex-col gap-2">
                    {quiz.questions.map((q, idx) => {
                      const change = quiz.changes[idx]
                      if (!change) return null
                      return (
                        <p key={`dashboardChange${idx}`}>Question #{idx + 1}</p>
                      )
                    })}
                  </div>
                ) : (
                  <p>Il n{"'"}y a pas de proposition de mise à jour du quiz</p>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel className="-pt-4 pb-4">
              {!discussion ? (
                user ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p>Vous devez être connecté pour voir la discussion</p>
                    <button
                      className="button"
                      onClick={() => dispatch(setModal({ modal: "login" }))}
                    >
                      Se connecter
                    </button>
                  </div>
                )
              ) : (
                <div className="flex flex-col-reverse md:flex-row justify-center gap-4">
                  <div className="w-clamp mx-auto md:mx-0 flex-shrink flex flex-col gap-4">
                    <div className="flex gap-2 justify-center items-center">
                      <p className="font-bold">Question</p>
                      <Pagination
                        {...pProps}
                        onChange={handlePagination}
                        showJumper
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quiz.questions[page].tags?.map((tag) => (
                        <span
                          className="py-1 px-2 bg-main-50 text-white text-sm rounded-full"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-center text-xl">
                      <Latex>{quiz.questions[page].prompt}</Latex>
                    </p>
                    <div className="flex flex-col justify-between items-center gap-4">
                      <span
                        className={`flex flex-col w-full ${
                          longAnswers
                            ? ""
                            : "md:w-auto md:flex-row md:justify-center md:flex-wrap"
                        } gap-4`}
                      >
                        {quiz.questions[page].answers.map((ans) => (
                          <button
                            key={ans.text}
                            type="button"
                            className={`relative button min-w-36 ${
                              longAnswers ? "" : "md:max-w-1/4"
                            } justify-center bg-transparent
                              ${
                                ans.correct
                                  ? "border-2 border-green-main text-green-main"
                                  : "border border-blue-main text-blue-main"
                              } cursor-default text-sm`}
                          >
                            <Latex>{ans.text}</Latex>
                          </button>
                        ))}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {userHistory?.stats.timeAverages[page] ? (
                        <span className="text-center">
                          Vous passez en moyenne{" "}
                          <span className="font-bold">
                            {formatTime(userHistory.stats.timeAverages[page])}{" "}
                          </span>
                          sur cette question
                        </span>
                      ) : (
                        <span className="text-center">
                          Vous n{"'"}avez pas encore passé cette question
                        </span>
                      )}
                      <div className="relative group">
                        <div
                          className={`input border-none min-h-[6.5rem] bg-main-10 pr-8 group-hover:hidden group-focus-within:hidden ${
                            message === "" && "text-black/50"
                          }`}
                        >
                          <Latex>
                            {message === ""
                              ? "Contribuez à la discussion"
                              : message}
                          </Latex>
                        </div>
                        <textarea
                          className="input bg-main-10 border-none resize-none pr-8 hidden group-hover:block focus-visible:block placeholder:text-black/50"
                          placeholder={
                            discussion[page].length == 0
                              ? "Posez une question ou donnez une explication"
                              : "Contribuez à la discussion"
                          }
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                        />
                        <button
                          className="absolute right-3 top-1"
                          disabled={!Boolean(user)}
                          onClick={sendMsg}
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                      <div className="flex justify-end -mt-1">
                        <span className="flex gap-2 items-center">
                          Tri :
                          <DropdownPopup
                            label={sortOptions[currentSort]}
                            className="bg-main-10 py-2 px-4 rounded"
                            position="up"
                            items={(
                              Object.keys(sortOptions) as Array<
                                keyof typeof sortOptions
                              >
                            ).map((option) => (
                              <button
                                key={`sort-${option}`}
                                onClick={() =>
                                  dispatch(pickSortingOption(option))
                                }
                              >
                                {sortOptions[option]}
                              </button>
                            ))}
                          />
                        </span>
                      </div>
                      {sortMessages(discussion[page], currentSort).map((m) => (
                        <Message
                          key={`m${m.index}`}
                          message={m}
                          index={m.index}
                          qIndex={page}
                          voteMsg={voteMsg}
                          loading={loading}
                        />
                      ))}
                      {discussion[page].length == 0 && (
                        <p className="text-center">
                          {
                            "Il n'y pas encore de messages au sujet de cette question"
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="relative flex flex-col items-stretch md:w-72 pt-8">
                    <div className="md:sticky md:top-4 bg-main-10 p-4 min-h-48 rounded">
                      <ProposedChange quiz={quiz} qIndex={page} />
                    </div>
                    <div className="flex-grow" />
                  </div>
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel className="-pt-4 pb-4">
              {isLoading || !userHistory ? (
                user ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p>Vous devez être connecté pour voir vos statistiques</p>
                    <button
                      className="button"
                      onClick={() => dispatch(setModal({ modal: "login" }))}
                    >
                      Se connecter
                    </button>
                  </div>
                )
              ) : userHistory.attempts.length > 0 ? (
                <div className="responsiveLayout">
                  {userHistory.stats.byTag.length > 0 && (
                    <Bar
                      options={{
                        responsive: true,
                        indexAxis: "y",
                        parsing: {
                          xAxisKey: "stat",
                          yAxisKey: "tag",
                        },
                      }}
                      data={{
                        labels: userHistory.stats.byTag.map((tag) => tag.tag),
                        datasets: [
                          {
                            label: "Taux de réussite",
                            data: userHistory.stats.byTag.map((tag) => ({
                              tag: tag.tag,
                              stat:
                                Math.round(
                                  (tag.score * 100) / tag.questions.length
                                ) / 100,
                            })),
                            backgroundColor: "rgb(17, 94, 87)",
                          },
                        ],
                      }}
                    />
                  )}
                  <Bar
                    ref={chartRef}
                    onClick={onHistoryClick}
                    options={{
                      responsive: true,
                      scales: {
                        xAxes: { display: true },
                        y1: {
                          type: "linear",
                          position: "left",
                          display: true,
                          beginAtZero: true,
                        },
                        y2: {
                          type: "linear",
                          position: "right",
                          display: true,
                          grid: {
                            drawOnChartArea: false,
                          },
                          beginAtZero: true,
                        },
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            title: (ctx) => {
                              const raw = ctx[0].raw as HistoryChartData
                              return `${raw.score}/${
                                raw.questions
                              } - ${formatTime(raw.time)}`
                            },
                            label: (ctx) => {
                              const raw = ctx.raw as HistoryChartData
                              return `Score: ${raw.score}/${raw.questions}`
                            },
                            afterBody: (ctx) => {
                              const raw = ctx[0].raw as HistoryChartData
                              return `Durée: ${formatTime(raw.time)}`
                            },
                          },
                        },
                      },
                      parsing: {
                        yAxisKey: "stat",
                        xAxisKey: "t",
                      },
                    }}
                    data={{
                      labels: userHistory.attempts.map((a) =>
                        formatDate(a.date._seconds)
                      ),
                      datasets: [
                        {
                          label: "Score (équivalent /10)",
                          yAxisID: "y1",
                          data: userHistory.attempts.map(
                            (attempt) =>
                              ({
                                uid: attempt.uid,
                                score: attempt.score,
                                stat:
                                  Math.round(
                                    (attempt.score * 100) /
                                      attempt.questions.length
                                  ) / 10,
                                time: attempt.time,
                                questions: attempt.questions.length,
                                date: dayjs(
                                  attempt.date._seconds * 1000
                                ).format("DD/MM - HH[h]mm"),
                                quizId: attempt.quizId,
                                t: attempt.date._seconds,
                              } as HistoryChartData)
                          ),
                          backgroundColor: "rgb(17, 94, 87)",
                        },
                        {
                          label: "Durée (secondes)",
                          yAxisID: "y2",
                          hidden: true,
                          data: userHistory.attempts.map(
                            (attempt) =>
                              ({
                                uid: attempt.uid,
                                score: attempt.score,
                                stat: attempt.time,
                                time: attempt.time,
                                questions: attempt.questions.length,
                                date: dayjs(
                                  attempt.date._seconds * 1000
                                ).format("DD/MM - HH[h]mm"),
                                quizId: attempt.quizId,
                                t: attempt.date._seconds,
                              } as HistoryChartData)
                          ),
                          backgroundColor: "rgb(147, 229, 223)",
                        },
                      ],
                    }}
                  />
                  <Bar
                    ref={timesRef}
                    options={{
                      responsive: true,
                      scales: {
                        xAxes: { display: true },
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            title: (ctx) => {
                              const raw = ctx[0].raw as TimeChartData
                              return raw.question
                            },
                            label: (ctx) => {
                              const raw = ctx.raw as TimeChartData
                              return `Temps: ${formatTime(raw.time)}`
                            },
                          },
                        },
                      },
                      parsing: {
                        yAxisKey: "time",
                        xAxisKey: "index",
                      },
                    }}
                    data={{
                      labels: userHistory.stats.timeAverages.map(
                        (a, index) => index
                      ),
                      datasets: [
                        {
                          label: "Temps moyen par question (secondes)",
                          data: userHistory.stats.timeAverages.map(
                            (stat, index) => ({
                              index: index + 1,
                              question: `Question #${index + 1}`,
                              time: stat ?? 0,
                            })
                          ),
                          backgroundColor: "rgb(17, 94, 87)",
                        },
                      ],
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p>{"Vous n'avez encore jamais passé ce quiz"}</p>
                  <Link href={`/quiz/${router.query.id as string}/try`}>
                    <a className="button">Tentative</a>
                  </Link>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <TipOfTheDay />
    </WithHeader>
  ) : null
}

type HistoryChartData = {
  score: number
  stat: number
  time: number
  questions: number
  date: string
  quizId: string
  uid: string
  t: number
}

type TimeChartData = { index: number; question: string; time: number }

export default AboutQuiz

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const quizId = context.params?.id as string
  const tab = context.query.tab as number | undefined

  const quizRef = adminDB.doc(`quizzes/${quizId}`)
  const quizDoc = await quizRef.get()

  if (!quizDoc.exists)
    return {
      props: {
        quizProp: null,
        quizId,
        tab: null,
      },
    }

  const quizProp = JSON.parse(JSON.stringify(quizDoc.data() as DBQuiz))

  return {
    props: {
      quizProp,
      quizId,
      tab: tab ?? null,
    },
  }
}

type Props = {
  quizProp: DBQuiz | null
  quizId: string
  tab: number | null
}
