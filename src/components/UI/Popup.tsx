import { Transition } from "@headlessui/react"
import type { PropsWithChildren } from "react"
import { useState, Fragment, ReactNode } from "react"

export default function Popup({ children, position, popup }: PopupProps) {
  const [show, setShow] = useState(false)

  const pos = {
    up: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    down: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  }

  return (
    <span className="relative flex items-stretch">
      <span
        className="relative"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      <Transition
        show={show}
        as={Fragment}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`absolute ${pos[position]} z-20`}>
          <div
            className={`rounded text-sm py-1 px-2 bg-slate-900 text-white bg-opacity-80 w-max max-w-sm`}
          >
            {popup}
          </div>
        </div>
      </Transition>
    </span>
  )
}

type PopupProps = PropsWithChildren & {
  position: "up" | "down" | "right" | "left"
  popup: string | ReactNode
}
