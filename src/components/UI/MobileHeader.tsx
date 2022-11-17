import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { useTDispatch, useTSelector } from "hooks/redux"
import { Transition } from "@headlessui/react"
import { setSideModal } from "store/modal.slice"
import { Fragment } from "react"

export default function MobileHeader() {
  const { sideModal } = useTSelector((state) => state.modal)
  const dispatch = useTDispatch()

  return (
    <Transition show={!Boolean(sideModal)} as={Fragment}>
      <button
        className="fixed top-2 right-4 z-10 sm:hidden text-4xl text-main mix-blend-difference"
        onClick={() => dispatch(setSideModal({ modal: "header" }))}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
    </Transition>
  )
}
