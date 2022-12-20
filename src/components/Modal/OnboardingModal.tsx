import Input from "components/UI/Input"
import { useTSelector, useTDispatch } from "hooks/redux"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { ERR_REQUIRED } from "utils/consts"
import usePassword from "hooks/usePassword"
import { setAlert, setModal } from "store/reducers/modal.slice"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons/faEye"
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons/faEyeSlash"
import Spinner from "components/UI/Spinner"
import { useUpdateOnboardedStatusMutation } from "store/apis/auth.api"

export default function OnboardingModal() {
  const { user } = useTSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [onboard] = useUpdateOnboardedStatusMutation()
  const [passwordType, togglePassword] = usePassword()
  const router = useRouter()
  const dispatch = useTDispatch()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()

  useEffect(() => {
    if (!user || user.data?.onboarded) {
      router.push("/")
    }
  }, [user])

  const onSubmit = async (data: FieldValues) => {
    try {
      if (!user?.data?.email) {
        throw new Error()
      }
      setLoading(true)
      await onboard({ uid: user.uid, password: data.password })
      dispatch(setAlert({ message: "Votre compte est prêt, bon bachotage !" }))
      dispatch(setModal({ modal: null }))
    } catch (err) {
      console.error(err)
      dispatch(
        setAlert({
          message:
            "Il y a un problème, essayez de vous déconnecter puis de vous reconnecter",
          error: true,
        })
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-center text-3xl font-bold mb-4">
        Enchanté, {user?.username}
      </h1>
      <p>
        Avant de vous laisser enchaîner les 10/10, on vous propose de créer un
        mot de passe d{"'"}au moins 8 caractères dont une majuscule, une
        minuscule et un chiffre (ça facilitera vos connexions futures)
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col my-4 gap-2 justify-center items-center">
          <Input name="password" errors={errors}>
            <input
              type={passwordType}
              className="input w-80 pr-8"
              placeholder="Mot de passe.."
              {...register("password", {
                required: ERR_REQUIRED,
                minLength: {
                  value: 8,
                  message: "Doit faire au moins 8 caractères",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
                  message:
                    "Doit contenir une majuscule, une minuscule et un chiffre",
                },
              })}
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
        </div>
        <div className="flex justify-center mt-2">
          <button className="button">
            Je me connecte!{loading && <Spinner small white />}
          </button>
        </div>
      </form>
    </>
  )
}
