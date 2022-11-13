import { onAuthStateChanged } from "firebase/auth"
import {
  QuerySnapshot,
  DocumentSnapshot,
  getDoc,
  DocumentReference,
  getDocs,
  Query,
  QueryDocumentSnapshot,
  query as _query,
  startAfter,
} from "firebase/firestore"
import { auth } from "firebaseconfig"
import { clamp } from "utils/functions"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { setAlert } from "store/modal.slice"
import { useTDispatch, useTSelector } from "./redux"

export function useStepper(steps: number) {
  const [currentStep, setCurrentStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)

  const nextStep = () => {
    const next = Math.min(steps - 1, currentStep + 1)
    setCurrentStep(next)
    setMaxStep((prev) => Math.max(prev, next))
  }

  const toStep = (index: number) => {
    setCurrentStep(clamp(0, index, maxStep))
  }

  const stepperProps = {
    currentStep,
    steps,
    toStep,
    nextStep,
  }

  return {
    currentStep,
    stepperProps,
  }
}

export function useProtect(
  authorizedId?: string,
  unauthorizedMessage?: string
) {
  const [redirect, setRedirect] = useState(true)
  const { user: reduxUser } = useTSelector((state) => state.auth)
  const dispatch = useTDispatch()
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(
          setAlert({
            message: "Vous devez être connecté pour voir cette page",
            error: true,
          })
        )
        router.replace("/")
        return
      }
      if (authorizedId && user.uid != authorizedId) {
        dispatch(
          setAlert({
            message: unauthorizedMessage ?? "Accès refusé",
            error: true,
          })
        )
        router.replace("/")
        return
      }
      setRedirect(false)
    })

    return unsub
  }, [router])

  return { user: reduxUser, redirect }
}

export const useGetDoc = <T>(
  reference: DocumentReference<unknown>,
  dependencies?: any[]
) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>()
  const [doc, setDoc] = useState<DocumentSnapshot<T>>()

  useEffect(() => {
    if (
      dependencies &&
      dependencies.some((dep) => dep === undefined || dep === null)
    ) {
      return
    }
    if (data) return
    getDoc(reference).then((res) => {
      setDoc(res as DocumentSnapshot<T>)
      setData(res.data() as T)
      setLoading(false)
    })
  }, [reference, dependencies])

  return { loading, data, doc }
}

export const useGetDocs = <T>(query: Query<unknown>, dependencies?: any[]) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T[]>()
  const [docs, setDocs] = useState<QueryDocumentSnapshot<T>[]>()
  const [nextQuery, setNextQuery] = useState<Query<unknown>>()

  useEffect(() => {
    if (
      dependencies &&
      dependencies.some((dep) => dep === undefined || dep === null)
    ) {
      return
    }
    if (data) return
    fetch()
  }, [query, dependencies])

  const fetch = async () => {
    try {
      setLoading(true)
      const res = await getDocs(query)
      const _docs = res.docs as QueryDocumentSnapshot<T>[]
      const _data = res.docs.map((doc) => doc.data() as T)
      setDocs(_docs)
      setData(_data)
      setNextQuery(_query(query, startAfter(_docs[_docs.length - 1])))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const next = async () => {
    if (
      !nextQuery ||
      (dependencies &&
        dependencies.some((dep) => dep === undefined || dep === null))
    ) {
      return false
    }
    try {
      setLoading(true)
      const res = await getDocs(nextQuery)
      const _docs = res.docs as QueryDocumentSnapshot<T>[]
      const _data = res.docs.map((doc) => doc.data() as T)
      setDocs((prev) => (prev ? [...prev, ..._docs] : _docs))
      setData((prev) => (prev ? [...prev, ..._data] : _data))
      return true
    } catch (err) {
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setDocs(undefined)
    setData(undefined)
  }

  return { loading, data, docs, next, reset }
}

export const useToggle = (defaultValue: boolean) => {
  const [state, setState] = useState(defaultValue)

  const toggle = (value?: boolean) => {
    setState((prev) => value ?? !prev)
  }

  return [state, toggle] as [boolean, (value?: boolean) => void]
}
