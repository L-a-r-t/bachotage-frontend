import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark"
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons/faThumbsUp"
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons/faThumbsDown"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Transition } from "@headlessui/react"
import dayjs from "dayjs"
import { useToggle } from "hooks/index"
import { useEffect, useState } from "react"
import { useGetRandomTipQuery } from "store/globalApi"
import { doc, increment, updateDoc } from "firebase/firestore"
import { db } from "firebaseconfig/index"

export default function TipOfTheDay() {
  const [show, toggle] = useToggle(false)
  const [prevId, setPrevId] = useState("")
  const { data: tip } = useGetRandomTipQuery({ prevId: prevId })

  useEffect(() => {
    const prevDate = localStorage.getItem("previousTipDate")
    setPrevId(localStorage.getItem("previousTipId") ?? "")
    const showNewTip = dayjs().diff(dayjs(Number(prevDate))) / 1000 / 3600 >= 4
    toggle(showNewTip)
  }, [])

  const hide = () => {
    const date = dayjs().valueOf()
    localStorage.setItem("previousTipDate", date.toString())
    localStorage.setItem("previousTipId", tip?.id ?? "")
    toggle(false)
  }

  const upvote = () => {
    const tipDoc = doc(db, "global", "tips", "collection", tip?.id ?? "")
    updateDoc(tipDoc, { upvotes: increment(1) })
    hide()
  }

  const downvote = () => {
    const tipDoc = doc(db, "global", "tips", "collection", tip?.id ?? "")
    updateDoc(tipDoc, { downvotes: increment(1) })
    hide()
  }

  return (
    <Transition
      show={Boolean(tip) && show}
      enter="transition duration-100 ease-out"
      enterFrom="transform translate-y-4 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-150 ease-in"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-75 opacity-0"
      className="fixed right-0 bottom-0 p-4 w-full h-[40%] sm:w-clamp-64 z-10"
    >
      <div className="relative w-full h-full p-4 bg-main-5 border border-main-20 rounded shadow flex flex-col justify-between">
        <button className="absolute top-0 right-2" onClick={hide}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <div className="overflow-y-auto">
          <h2 className="font-bold text-lg text-center mb-2">
            Conseil du jour
          </h2>
          <p className="text-justify">{tip?.content}</p>
        </div>
        <div className="flex justify-center gap-8 text-2xl">
          <button className="text-red-800/50" onClick={downvote}>
            <FontAwesomeIcon icon={faThumbsDown} />
          </button>
          <button className="text-green-800/50" onClick={upvote}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>
        </div>
      </div>
    </Transition>
  )
}
