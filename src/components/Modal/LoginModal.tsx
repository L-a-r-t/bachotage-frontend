import { auth } from "firebaseconfig/index"
import {
  ActionCodeSettings,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { useTDispatch, useTSelector } from "hooks/redux"
import { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { setAlert, setModal } from "store/modal.slice"
import { waitForEmail } from "store/auth.slice"
import Input from "components/UI/Input"
import Spinner from "components/UI/Spinner"
import { useRouter } from "next/router"
import { ERR_REQUIRED } from "utils/consts"
import usePassword from "hooks/usePassword"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons/faEyeSlash"
import { faEye } from "@fortawesome/free-regular-svg-icons/faEye"
import { FirebaseError } from "firebase/app"
import { isFirebaseError } from "utils/functions"

export default function LoginModal() {
  const dispatch = useTDispatch()
  const router = useRouter()
  const [username, setUsername] = useState(localStorage.getItem("username"))
  // const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordType, togglePassword] = usePassword()
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
    const { email, firstName, lastName, password } = data
    try {
      if (password == "") {
        const actionCodeSettings: ActionCodeSettings = {
          url: `${window?.location.origin}/authenticate${
            firstName ? `?firstName=${firstName}&lastName=${lastName}` : ""
          }`,
          handleCodeInApp: true,
        }
        localStorage.setItem("email", email)
        setLoading(true)
        await sendSignInLinkToEmail(auth, email as string, actionCodeSettings)
        dispatch(waitForEmail())
      } else {
        setLoading(true)
        const res = await signInWithEmailAndPassword(auth, email, password)
        dispatch(setAlert({ message: "Connecté !" }))
        auth.updateCurrentUser(res.user)
      }
    } catch (err) {
      console.error(err)
      if (isFirebaseError(err)) {
        if (err.code.includes("wrong-password")) {
          dispatch(
            setAlert({ message: "Le mot de passe est incorrect", error: true })
          )
          return
        }
        if (err.code.includes("user-not-found")) {
          dispatch(
            setAlert({ message: "Addresse email non reconnue", error: true })
          )
          return
        }
      }
      dispatch(
        setAlert({ message: "Oups, il y a eu un problème !", error: true })
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      {status == "idle" && (
        <>
          <div>
            <h2 className="text-2xl font-bold text-center">
              {username ? `Rebonjour, ${username} !` : "Créer un compte"}
            </h2>
            {username ? (
              <p className="text-gray-600 text-center">
                {
                  "N'écrivez que votre email si vous n'avez pas encore défini de mot de passe"
                }
              </p>
            ) : (
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
                    {...register("firstName", { required: ERR_REQUIRED })}
                  />
                </Input>
                <Input name="lastName" errors={errors}>
                  <input
                    placeholder="Nom"
                    className="input"
                    {...register("lastName", { required: ERR_REQUIRED })}
                  />
                </Input>
              </div>
            )}
            <Input name="email" errors={errors}>
              <input
                placeholder="Email"
                type="email"
                className="input"
                {...register("email", { required: ERR_REQUIRED })}
              />
            </Input>
            {username && (
              <Input name="password" errors={errors}>
                <input
                  placeholder="Mot de passe"
                  type={passwordType}
                  className="input pr-8"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 w-6 text-gray-500"
                  onClick={togglePassword}
                >
                  <FontAwesomeIcon
                    icon={passwordType === "password" ? faEyeSlash : faEye}
                  />
                </button>
              </Input>
            )}
            {!username && (
              <Input
                name="cgu"
                errors={errors}
                label="J'accepte les conditions générales d'utilisation"
                check
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register("cgu", { required: ERR_REQUIRED })}
                />
              </Input>
            )}
            <button className="button mt-2" type="submit">
              Connexion{loading && <Spinner small white />}
            </button>
          </form>
        </>
      )}
      {status == "pending" && (
        <h2>
          Nous avons envoyé un email à {localStorage.getItem("email")},
          consultez votre boite mail (pensez à vérifier le dossier spam si vous
          ne le voyez pas) pour finir votre connexion!
        </h2>
      )}
    </div>
  )
}
