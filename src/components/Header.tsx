import { signOut } from "firebase/auth"
import { auth } from "firebaseconfig"
import Link from "next/link"
import { useRouter } from "next/router"
import { setAuth } from "store/auth.slice"
import { setAlert, setModal } from "store/modal.slice"
import { useTDispatch, useTSelector } from "../hooks/redux"
import LoginModal from "./Modal/LoginModal"
import Dropdown from "./UI/DropdownPopup"
import MobileHeader from "./UI/MobileHeader"

export default function Header({ sticky, className }: HeaderProps) {
  const dispatch = useTDispatch()
  const { user } = useTSelector((state) => state.auth)

  const router = useRouter()

  const logout = async () => {
    await signOut(auth)
    dispatch(setAuth(null))
    dispatch(setAlert({ message: "Vous avez été déconnecté", error: true }))
    router.push("/")
  }

  const links = [
    { href: "/account", label: "Profil" },
    { href: "/account/quizzes", label: "Mes quiz" },
    { href: "/account/history", label: "Historique" },
    { href: "/account/settings", label: "Préférences" },
  ]

  return (
    <>
      <MobileHeader />
      <div
        className={`hidden h-12 w-full sm:flex p-6 justify-between items-center
          bg-main-100 text-white font-bold relative z-10 ${
            sticky && "sticky top-0"
          } ${className}`}
      >
        <Link href="/" passHref>
          <a className="text-xl">QOAT</a>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/quiz/browse" passHref>
            <a>Chercher un quiz</a>
          </Link>
          {user && (
            <>
              <Link href="/quiz/create" passHref>
                <a>Créer un quiz</a>
              </Link>
              <Dropdown
                className="py-1 px-3 font-bold bg-white text-main-100 rounded"
                label={user.username}
                items={[
                  ...links.map((link) => (
                    <Link href={link.href} key={link.href} passHref>
                      <a className="text-main-100">{link.label}</a>
                    </Link>
                  )),
                  <button
                    key="headerlogoutbutton"
                    className="text-red-main"
                    onClick={() => logout()}
                  >
                    Déconnexion
                  </button>,
                ]}
              />
            </>
          )}
          {!user && (
            <button
              type="button"
              onClick={() => dispatch(setModal({ modal: "login" }))}
            >
              Se Connecter
            </button>
          )}
        </div>
      </div>
    </>
  )
}

type HeaderProps = {
  sticky?: boolean
  className?: string
}
