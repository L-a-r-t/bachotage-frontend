import WithHeader from "components/Layout/WithHeader"
import Spinner from "components/UI/Spinner"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { httpsCallable } from "firebase/functions"
import { auth, functions } from "firebaseconfig"
import { useTDispatch, useTSelector } from "hooks/redux"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { setAlert } from "store/reducers/modal.slice"
import { OnSigninReq, OnSigninRes } from "types/functions"

const Authenticate: NextPage = ({ query }: any) => {
  const [error, setError] = useState<any>(null)
  const { user } = useTSelector((state) => state.auth)

  const router = useRouter()
  const dispatch = useTDispatch()

  useEffect(() => {
    ;(async () => {
      const { firstName, lastName } = query
      if (isSignInWithEmailLink(auth, location.href)) {
        try {
          let email = localStorage.getItem("email")
          if (!email) {
            email = prompt("Merci de réécrire votre email")
          }
          if (!email) {
            const err = "Pas d'email trouvé pour finir la connexion"
            setError(err)
            return
          }
          const res = await signInWithEmailLink(auth, email, location.href)
          localStorage.removeItem("email")

          if (firstName) localStorage.setItem("username", firstName as string)

          const onSignin = httpsCallable<OnSigninReq, OnSigninRes>(
            functions,
            "onSignin"
          )
          await onSignin({
            uid: res.user.uid,
            email,
            firstName,
            lastName,
          })
        } catch (err) {
          setError(err)
        }
      } else {
        router.push("/")
      }
    })()
  }, [])

  useEffect(() => {
    if (error) {
      console.error(error)
      dispatch(
        setAlert({ message: "Oups ! Il y a eu une erreur.", error: true })
      )
    }
  }, [error])

  return (
    <WithHeader>
      <Head>
        <title>{user ? "Connecté !" : "Connexion..."}</title>
      </Head>
      <div className="responsiveLayout items-center">
        {!user && <Spinner />}
        {user && (
          <>
            <h2 className="text-2xl font-bold">Connexion réussie!</h2>
            <p>
              Vous pouvez à présent fermer cette fenêtre et revenir à vos
              activités. :)
            </p>
          </>
        )}
      </div>
    </WithHeader>
  )
}

export default Authenticate

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      query: context.query,
    },
  }
}
