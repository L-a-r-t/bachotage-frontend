import Popup from "components/UI/Popup"
import Spinner from "components/UI/Spinner"
import { signOut } from "firebase/auth"
import { auth } from "firebaseconfig"
import { useProtect } from "hooks/index"
import { useTDispatch, useTSelector } from "hooks/redux"
import Link from "next/link"
import { useRouter } from "next/router"
import { PropsWithChildren } from "react"
import { setAuth } from "store/auth.slice"
import { setAlert } from "store/modal.slice"
import WithHeader from "./WithHeader"

export default function AccountLayout({ children, active }: Props) {
  const router = useRouter()
  const dispatch = useTDispatch()
  const { user } = useTSelector((state) => state.auth)

  const isActive = (key: string) => {
    if (key == active) {
      return "text-main font-semibold"
    } else {
      return "hover:text-green-800 font-semibold"
    }
  }

  const logout = async () => {
    await signOut(auth)
    dispatch(setAuth(null))
    dispatch(setAlert({ message: "Vous avez été déconnecté", error: true }))
    router.push("/")
  }

  const titlesMap = {
    dashboard: "Mon compte",
    quizzes: "Mes quiz",
    history: "Historique",
    settings: "Préférences",
  }

  return (
    <WithHeader>
      <div className="w-clamp-xl mx-auto flex flex-col md:flex-row h-fit-screen gap-4 py-4 md:gap-8">
        <div className="flex flex-col gap-4 w-full sm:w-64 p-4 bg-main/10 rounded">
          {user ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl">{user?.username}</p>
              <p>
                J{"'"}ajouterai du contenu ici un moment donné, probablement des
                stats
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          )}
          <div className="hidden sm:block border-t w-3/4 mx-auto border-slate-700" />
          <div className="hidden sm:flex flex-col gap-2 items-start">
            <Link href="/account" passHref>
              <a className={isActive("dashboard")}>Mon compte</a>
            </Link>
            <Link href="/account/quizzes" passHref>
              <a className={isActive("quizzes")}>Mes quiz</a>
            </Link>
            <Link href="/account/history" passHref>
              <a className={isActive("history")}>Historique</a>
            </Link>
            <Link href="/account/settings" passHref>
              <a className={isActive("settings")}>Préférences</a>
            </Link>
            <button
              className="text-red-600 hover:text-red-800 font-semibold"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex-grow h-full overflow-y-auto md:pr-4">
          <h1 className="text-center text-xl font-bold mb-2">
            {titlesMap[active]}
          </h1>
          <div className="flex flex-col gap-4">{children}</div>
        </div>
      </div>
    </WithHeader>
  )
}

type Props = PropsWithChildren & {
  active: "dashboard" | "quizzes" | "history" | "settings"
}
