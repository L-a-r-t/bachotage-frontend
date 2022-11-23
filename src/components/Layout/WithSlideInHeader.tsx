import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown"
import Header from "components/Header"
import { useToggle } from "hooks/index"
import { PropsWithChildren, Fragment } from "react"
import { Transition } from "@headlessui/react"
import MobileHeader from "components/UI/MobileHeader"

export default function WithSlideInHeader({
  children,
  stickyHeader,
  className,
}: Props) {
  const [show, toggle] = useToggle(false)

  return (
    <>
      <MobileHeader />
      <div
        className={`absolute z-[5] top-0 left-0 w-full sm:flex justify-center items-center
      transition-all ${show ? "h-12" : "h-8"} hidden`}
      >
        <button onClick={() => toggle()} className="z-10">
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`transition ${
              show ? "transform rotate-180" : "transform rotate-0"
            }`}
          />
        </button>
        <Transition
          show={show}
          enter="transition duration-150 ease-out"
          enterFrom="transform -translate-y-12 opacity-0"
          enterTo="transform translate-y-0 opacity-100"
          leave="transition duration-100 ease-in"
          leaveFrom="transform translate-y-0 opacity-100"
          leaveTo="transform -translate-y-8 opacity-0"
          className="absolute top-0 left-0 w-full shadow bg-white z-[5]"
        >
          <Header
            sticky={stickyHeader}
            className={`bg-white text-main-100 ${className}`}
          />
        </Transition>
      </div>
      {children}
    </>
  )
}

type Props = PropsWithChildren & {
  stickyHeader?: boolean
  className?: string
}
