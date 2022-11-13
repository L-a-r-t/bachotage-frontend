import { auth } from "firebaseconfig"
import { ActionCodeSettings, sendSignInLinkToEmail } from "firebase/auth"
import { useTDispatch, useTSelector } from "hooks/redux"
import { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { setModal } from "store/modal.slice"
import { waitForEmail } from "store/auth.slice"
import Input from "components/UI/Input"
import Spinner from "components/UI/Spinner"
import { useRouter } from "next/router"

export default function LoginModal() {
  const dispatch = useTDispatch()
  const router = useRouter()
  const [username, setUsername] = useState(localStorage.getItem("username"))
  // const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { user, status } = useTSelector((state) => state.auth)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (user) dispatch(setModal({ modal: null }))
  }, [user, dispatch])

  const onSubmit = async (data: FieldValues) => {
    const { email, firstName, lastName } = data
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window?.location.origin}/authenticate${
        firstName ? `?firstName=${firstName}&lastName=${lastName}` : ""
      }`,
      handleCodeInApp: true,
    }
    localStorage.setItem("email", email)
    try {
      setLoading(true)
      await sendSignInLinkToEmail(auth, email as string, actionCodeSettings)
      dispatch(waitForEmail())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      {status == "idle" && (
        <>
          <div>
            <h2 className="text-2xl font-bold">
              {username ? `Rebonjour, ${username} !` : "Créer un compte"}
            </h2>
            {!username && (
              <p
                className="text-gray-600 underline cursor-pointer text-center"
                onClick={() => setUsername("inconnu")}
              >
                J{"'"}ai déjà un compte
              </p>
            )}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {!username && (
              <div className="flex gap-4">
                <Input name="firstName" errors={errors}>
                  <input
                    placeholder="Prénom"
                    className="input"
                    {...register("firstName", { required: true })}
                  />
                </Input>
                <Input name="lastName" errors={errors}>
                  <input
                    placeholder="Nom"
                    className="input"
                    {...register("lastName", { required: true })}
                  />
                </Input>
              </div>
            )}
            <Input name="email" errors={errors}>
              <input
                placeholder="Email"
                type="email"
                className="input"
                {...register("email", { required: true })}
              />
            </Input>
            <button className="button mt-2" type="submit">
              Connexion{loading && <Spinner small white />}
            </button>
          </form>
        </>
      )}
      {status == "pending" && (
        <h2>
          Nous avons envoyé un email à {localStorage.getItem("email")},
          consultez votre boite mail (dossier spam mais j{"'"}arrangerai ça en
          temps voulu) pour finir votre connexion!
        </h2>
      )}
    </div>
  )
}
