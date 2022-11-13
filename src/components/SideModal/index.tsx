import { Dialog, Transition } from "@headlessui/react"
import { useEffect, useState, Fragment } from "react"
import { useTDispatch, useTSelector } from "../../hooks/redux"
import {
  setSideModal,
  SideModal as SideModalTypes,
} from "../../store/modal.slice"
import DiscussQuestion from "./DiscussQuestion"
import SideHeader from "./SideHeader"

export default function SideModal() {
  const { sideModal, sideProps } = useTSelector((state) => state.modal)
  const [prev, setPrev] = useState<SideModalTypes>("discussQuestion")
  const [prevProps, setPrevProps] = useState<any>()

  const dispatch = useTDispatch()

  useEffect(() => {
    document.body.style.overflowY = Boolean(sideModal) ? "hidden" : "auto"
    if (sideModal) setPrev(sideModal)
  }, [sideModal])

  useEffect(() => {
    if (sideProps) setPrevProps(sideProps)
    else if (sideModal) setPrevProps(null)
  }, [sideProps, sideModal])

  const map = {
    discussQuestion: <DiscussQuestion {...prevProps} />,
    header: <SideHeader />,
  }

  return (
    <Transition show={Boolean(sideModal)} as={Fragment}>
      <Dialog onClose={() => dispatch(setSideModal({ modal: null }))}>
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          as={Fragment}
        >
          <div className="fixed inset-0 bg-black/5 z-20" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          enter="transition duration-150 ease-out"
          enterFrom="transform translate-x-20 opacity-0"
          enterTo="transform translate-x-0 opacity-100"
          leave="transition duration-100 ease-in"
          leaveFrom="transform translate-x-0 opacity-100"
          leaveTo="transform translate-x-12 opacity-0"
          as={Fragment}
        >
          <div className="fixed inset-0 flex justify-end items-stretch z-30">
            <Dialog.Panel
              className={`${
                sideModal == "discussQuestion" ? "w-clamp-xl" : "w-clamp-64"
              } max-h-full bg-white border-l border-main/50`}
            >
              {map[sideModal ?? prev]}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
