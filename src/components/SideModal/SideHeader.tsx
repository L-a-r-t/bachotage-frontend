import { Menu, Transition } from "@headlessui/react"
import { signOut } from "firebase/auth"
import { auth } from "firebaseconfig/index"
import { useTDispatch, useTSelector } from "hooks/redux"
import Link from "next/link"
import { useRouter } from "next/router"
import { Fragment } from "react"
import { setAuth } from "store/auth.slice"
import { setAlert, setModal, setSideModal } from "store/modal.slice"

export default function SideHeader() {
  const dispatch = useTDispatch()
  const { user } = useTSelector((state) => state.auth)
  const router = useRouter()

  const logout = async () => {
    await signOut(auth)
    dispatch(setAuth(null))
    dispatch(setSideModal({ modal: null }))
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
    <div className="flex flex-col gap-12 p-8 h-full max-h-full text-main font-semibold text-xl">
      <Link href="/" passHref>
        <a className="text-3xl text-center font-bold">Bachotage</a>
      </Link>
      <div className="flex flex-col items-start gap-4">
        <div className="w-full border-b border-main -my-1" />
        {/* <Link href="/quiz/browse" passHref>
          <a onClick={() => dispatch(setSideModal({ modal: null }))}>
            Chercher un quiz
          </a>
        </Link>
        <div className="w-full border-b border-main -my-1" /> */}
        {user && (
          <>
            <Link href="/quiz/create" passHref>
              <a onClick={() => dispatch(setSideModal({ modal: null }))}>
                Créer un quiz
              </a>
            </Link>
            <div className="w-full border-b border-main -my-1" />
            <Menu as={Fragment}>
              <Menu.Button>Théo</Menu.Button>
              <Transition
                show={router.asPath.includes("account") || undefined}
                enter="transition duration-150 ease-out"
                enterFrom="transform scale-y-75 -translate-y-20 opacity-0"
                enterTo="transform scale-y-100 translate-y-0 opacity-100"
                leave="transition duration-150 ease-in"
                leaveFrom="transform scale-y-100 translate-y-0 opacity-100"
                leaveTo="transform scale-y-75 -translate-y-10 opacity-0"
                as={Fragment}
              >
                <Menu.Items
                  static={router.asPath.includes("account") || undefined}
                  className="flex flex-col items-start gap-4 w-full text-base"
                >
                  <div className="w-full border-b border-main -my-1" />
                  {links.map((link) => (
                    <>
                      <Menu.Item key={link.href}>
                        <div>
                          <Link href={link.href} passHref>
                            <a
                              className="text-main pl-8"
                              onClick={() =>
                                dispatch(setSideModal({ modal: null }))
                              }
                            >
                              {link.label}
                            </a>
                          </Link>
                        </div>
                      </Menu.Item>
                      <div
                        className="w-10/12 border-b border-main -my-1"
                        key={`${link.href}div`}
                      />
                    </>
                  ))}
                  <Menu.Item>
                    <button
                      key="headerlogoutbutton"
                      className="text-red-main pl-8"
                      onClick={() => logout()}
                    >
                      Logout
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
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
  )
}
