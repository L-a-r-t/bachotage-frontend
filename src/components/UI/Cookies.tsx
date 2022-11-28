import { Transition } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function CookiesBar() {
  const [cookiesAllowed, setCookiesAllowed] = useState<boolean | null>(false)
  const router = useRouter()

  useEffect(() => {
    const cookie = localStorage.getItem("cookies-allowed")
    setCookiesAllowed(cookie === null ? null : Boolean(cookie))
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookies-allowed", "true")
    setCookiesAllowed(true)
    router.reload()
  }

  const refuseCookies = () => {
    localStorage.setItem("cookies-allowed", "")
    setCookiesAllowed(false)
    router.reload()
  }

  return (
    <Transition
      show={cookiesAllowed === null}
      enter="transition duration-300 ease-out"
      enterFrom="transform translate-y-16 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-300 ease-in"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-16 opacity-0"
      className="fixed inset-x-0 bottom-0 p-4 w-full flex justify-between items-center bg-main-100 text-white"
    >
      <p>
        QOAT utilise des cookies pour sauvegarder vos préférences et à des fins
        analytiques (rien à des fins de traçage publicitaire !). Acceptez-vous l
        {"'"}utilisation de cookies tiers à des fins de statistiques anonymisées
        ? (Voir la{" "}
        <Link href="/privacy-policy" passHref>
          <a className="link text-white" target="_blank">
            politique de confidentialité
          </a>
        </Link>
        )
      </p>
      <button className="button min-w-max" onClick={refuseCookies}>
        {"Je refuse"}
      </button>
      <button className="button bg-white text-main-100" onClick={acceptCookies}>
        {"J'accepte"}
      </button>
    </Transition>
  )
}
