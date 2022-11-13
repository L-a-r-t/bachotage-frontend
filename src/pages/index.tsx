import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import WithHeader from "components/Layout/WithHeader"
import { useTDispatch, useTSelector } from "hooks/redux"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { setModal } from "store/modal.slice"

const Home: NextPage = () => {
  const { user } = useTSelector((state) => state.auth)
  const dispatch = useTDispatch()

  return (
    <WithHeader className="bg-transparent text-main">
      <Head>
        <title>Bachotage</title>
        <meta
          name="description"
          content="Bachotage t'aide dans tes révisions"
        />
      </Head>
      <div className="relative flex flex-col justify-center items-center w-full h-fit-screen">
        <h1 className="text-6xl font-bold text-center mt-4">Booste ta note,</h1>
        <p>Vite fait bien fait!</p>
        <div className="button px-12 mt-16">
          {user ? (
            <Link href="/account/quizzes">
              <a>{"C'est parti !"}</a>
            </Link>
          ) : (
            <button onClick={() => dispatch(setModal({ modal: "login" }))}>
              {"C'est parti !"}
            </button>
          )}
        </div>
      </div>
      <div className="absolute inset-0 -z-[5] w-full overflow-x-hidden overflow-y-hidden h-screen -mt-12">
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
      <div className="relative w-full h-fit-screen flex flex-col justify-center items-center"></div>
    </WithHeader>
  )
}

export default Home
