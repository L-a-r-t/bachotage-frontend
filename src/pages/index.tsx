import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import WithHeader from "components/Layout/WithHeader"
import AnimatedCount from "components/UI/AnimatedCount"
import { useTSelector } from "hooks/redux"
import useIntersection from "hooks/useIntersection"
import type { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRef } from "react"
import { ALPHABET } from "utils/consts"

const Home: NextPage<Props> = ({ env }) => {
  const { user } = useTSelector((state) => state.auth)
  const images = useRef<HTMLDivElement[]>([])
  const [image0showing, ref0] = useIntersection(0.7)
  const [image1showing, ref1] = useIntersection(0.7)
  const [image2showing, ref2] = useIntersection(0.7)

  const fakeResults = [
    ["f", "fx", "f", "t"],
    ["f", "f", "tx", "f"],
    ["f", "tx", "f", "f"],
    ["f", "t", "fx", "f"],
    ["f", "f", "tx", "f"],
    ["tx", "f", "f", "f"],
    ["t", "f", "f", "fx"],
    ["f", "tx", "f", "f"],
    ["tx", "f", "f", "f"],
    ["f", "f", "f", "tx"],
  ]
  const getStyle = (a: string) => {
    const color =
      a == "f" ? "blue-main" : a.includes("t") ? "green-main" : "red-main"
    return a.includes("x")
      ? `bg-${color} text-white border-${color}`
      : `bg-transparent text-${color} border-${color}`
  }

  return (
    <WithHeader
      className={`${
        image0showing || image1showing || image2showing
          ? "bg-white"
          : "bg-transparent"
      } text-main`}
      stickyHeader
    >
      <Head>
        <title>QOAT: Quizzes Of All Time</title>
        <meta
          name="description"
          content="Les meilleurs quiz sont sur QOAT ! (Quizzes Of All Time 🐐)"
        />
      </Head>
      <div className="relative flex flex-col justify-center items-center w-full h-screen md:h-fit-screen">
        <h1 className="text-6xl font-bold text-center mt-4">Booste ta note,</h1>
        <p>Vite fait bien fait!</p>
        <div className="button px-12 mt-16">
          {user ? (
            <Link href="/account/quizzes">
              <a>{"C'est parti !"}</a>
            </Link>
          ) : (
            <Link href="/quiz/browse">
              <a>{"C'est parti !"}</a>
            </Link>
          )}
        </div>
      </div>
      <div className="absolute inset-0 -z-[5] w-full overflow-x-hidden overflow-y-hidden h-screen">
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faCheck}
          className="top-[60%] left-[10%] absolute -z-10 animate-[rise-14_8s_linear_infinite] text-green-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faCheck}
          className="top-[80%] left-[40%] absolute -z-10 animate-[rise-14_6s_linear_infinite] text-green-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faCheck}
          className="top-[40%] left-[70%] absolute -z-10 animate-[rise-6_6.5s_linear_infinite] text-green-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faCheck}
          className="top-[80%] left-[90%] absolute -z-10 animate-[rise-10_5s_linear_infinite] text-green-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faCheck}
          className="top-[20%] left-[30%] absolute -z-10 animate-[rise-6_5.5s_linear_infinite] text-green-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faCheck}
          className="top-[30%] left-[60%] absolute -z-10 animate-[rise-14_8s_linear_infinite] text-green-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faXmark}
          className="top-[70%] left-[60%] absolute -z-10 animate-[rise-10_7.5s_linear_infinite] text-red-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faXmark}
          className="top-[70%] left-[10%] absolute -z-10 animate-[rise-6_6s_linear_infinite] text-red-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faXmark}
          className="top-[50%] left-[55%] absolute -z-10 animate-[rise-14_8.5s_linear_infinite] text-red-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faXmark}
          className="top-[60%] left-[85%] absolute -z-10 animate-[rise-14_6.5s_linear_infinite] text-red-main text-5xl"
        />
        <FontAwesomeIcon
          aria-hidden={true}
          icon={faXmark}
          className="top-[80%] left-[25%] absolute -z-10 animate-[rise-10_7s_linear_infinite] text-red-main text-5xl"
        />
      </div>
      <div className="relative w-full h-[200vh] flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-3 gap-4">
        <div className="pl-8 pr-4 sm:pr-0 sm:pl-4">
          <p className="text-2xl font-bold">Passe un quiz corrigé</p>
          <p className="text-gray-800">
            Permettre d{"'"}apprendre efficacement grâce à un environnement
            contrôlé et un {'"feedback"'} presque instantané, c{"'"}est notre
            cheval de bataille.
          </p>
        </div>
        <div className="p-6 pr-0 overflow-x-hidden" ref={ref0}>
          <div
            className={`w-full h-full rounded-l-lg bg-slate-100 shadow-lg shadow-slate-300/50 transition duration-[400ms] 
            transform relative gap-4 ${
              image0showing ? "translate-x-0" : "translate-x-3/4"
            } flex flex-col justify-between items-center p-4 sm:py-8`}
          >
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 text-sm">
              <span className="hidden sm:inline">Question </span>3/10
            </div>
            <p className="text-lg font-semibold">Quiz: Histoire française</p>
            <p className="text-center">
              En quelle année a débuté la Révolution Française ?
            </p>
            <div className="flex flex-col w-full sm:flex-row flex-wrap justify-center gap-4">
              {["1792", "1789", "1914", "1779"].map((date) => (
                <div
                  key={date}
                  className={`py-2 sm:py-4 w-full sm:w-auto px-6 text-center border border-blue-main ${
                    date == "1789"
                      ? "text-white bg-blue-main"
                      : "text-blue-main"
                  } rounded`}
                >
                  {date}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pl-8 pr-4 sm:pr-0 sm:pl-4">
          <p className="text-2xl font-bold">Vois tes stats</p>
          <p className="text-gray-800">
            Historique des tentatives, temps moyen passé sur chaque question
            question, décomposition des résultats par thématiques, la totale.
          </p>
        </div>
        <div className="p-6 pr-0 overflow-x-hidden" ref={ref1}>
          <div
            className={`w-full h-full rounded-l-lg bg-slate-100 shadow-lg shadow-slate-300/50 transition duration-[400ms] 
            transform overflow-y-hidden gap-4 ${
              image1showing ? "translate-x-0" : "translate-x-3/4"
            } flex flex-col justify-between items-center p-8`}
          >
            <p>Vous avez eu</p>
            <p className="text-4xl font-bold">
              {image1showing ? (
                <AnimatedCount target={7} duration={2000} />
              ) : (
                "7"
              )}
              /10
            </p>
            <div>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {fakeResults.map((q, index) => (
                  <div key={`q${index}`} className="flex flex-col items-center">
                    <p>Question {index + 1}</p>
                    <div className="flex gap-2">
                      {q.map((a, idx) => (
                        <div
                          key={`q${index}a${idx}`}
                          className={`w-4 h-4 text-center leading-4 border rounded text-xs ${getStyle(
                            a
                          )}`}
                        >
                          {ALPHABET[idx]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pl-8 pr-4 sm:pr-0 sm:pl-4">
          <p className="text-2xl font-bold">
            Tout le monde peut participer à la correction
          </p>
          <p className="text-gray-800">
            A chaque quiz son forum de discussion. Posez des questions,
            détaillez les réponses, faites des propositions de correction...
            Ici, on croit en l{"'"}intelligence collective !
          </p>
        </div>
        <div className="p-6 pr-0 overflow-x-hidden" ref={ref2}>
          <div
            className={`w-full h-full rounded-l-lg bg-slate-100 shadow-lg shadow-slate-300/50 transition duration-[400ms] 
            transform ${
              image2showing ? "translate-x-0" : "translate-x-3/4"
            } flex flex-col gap-4 p-4 sm:p-8`}
          >
            <p className="text-lg font-bold text-center">Question 7</p>
            <div className="p-4 bg-slate-200 rounded w-10/12">
              <p>
                {"Quelqu'un a trouvé pourquoi la réponse n'est pas Clovis ?"}
              </p>
              <p className="float-right italic">Martin</p>
            </div>
            <div className="flex">
              <div className="w-2/12" />
              <div className="p-4 bg-slate-200 rounded w-10/12">
                <p>
                  {
                    "Même si Clovis est le premier roi des Francs, la dynastie des mérovingiens commence bien avec Childéric 1er qui est d'ailleurs le père de Clovis ;)"
                  }
                </p>
                <p className="float-right italic">Jeanne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="relative w-full h-screen flex flex-col">
        <p className="text-2xl font-bold text-center">
          {"Il n'y a pas le quiz qu'il te faut ? Crée-le !"}
        </p>
        <div className="my-4 mx-8 rounded-lg bg-slate-100 flex-grow" />
      </div> */}
    </WithHeader>
  )
}

export default Home

type Props = {
  env: string
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      env: process.env.VERCEL_ENV as string,
    },
  }
}
