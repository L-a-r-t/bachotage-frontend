import { Dialog, Transition } from "@headlessui/react"
import { useEffect, useState, Fragment } from "react"
import { useTDispatch, useTSelector } from "../../hooks/redux"
import { Modal as ModalTypes, setModal } from "../../store/modal.slice"
import LoginModal from "./LoginModal"
import AddQuestionModal from "./AddQuestionModal"
import PublishQuizModal from "./PublishQuizModal"
import DeleteDraftModal from "./DeleteDraftModal"
import SubmitAnswerModal from "./SubmitAnswerModal"

export default function Modal() {
  const { modal, props } = useTSelector((state) => state.modal)
  const [prev, setPrev] = useState<ModalTypes>("login")
  const [prevProps, setPrevProps] = useState<any>()
  const dispatch = useTDispatch()

  useEffect(() => {
    document.body.style.overflowY = Boolean(modal) ? "hidden" : "auto"
    if (modal) setPrev(modal)
  }, [modal])

  useEffect(() => {
    if (props) setPrevProps(props)
    else if (modal) setPrevProps(null)
  }, [props, modal])

  const map = {
    login: <LoginModal />,
    addQuestion: <AddQuestionModal {...prevProps} />,
    publishQuiz: <PublishQuizModal {...prevProps} />,
    deleteDraft: <DeleteDraftModal {...prevProps} />,
    submitAnswer: <SubmitAnswerModal {...prevProps} />,
  }

  // return modal
  //   ? createPortal(
  //       <div
  //         className="fixed flex justify-center items-center z-50 py-8
  //         top-0 left-0 w-screen h-screen bg-black bg-opacity-5"
  //         onClick={() => dispatch(setModal(null))}
  //       >
  //         <div
  //           className="w-clamp max-h-full min-h-1/2 p-8 bg-white border border-main rounded-2xl"
  //           onClick={(e) => e.stopPropagation()}
  //         >
  //           {modal}
  //         </div>
  //       </div>,
  //       document.body
  //     )
  //   : null
  return (
    <Transition show={Boolean(modal)} as={Fragment}>
      <Dialog onClose={() => dispatch(setModal({ modal: null }))}>
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition duration-100 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          as={Fragment}
        >
          <div className="fixed inset-0 bg-black/5 z-40" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 translate-y-6 opacity-0"
          enterTo="transform scale-100 translate-y-0 opacity-100"
          leave="transition duration-100 ease-in"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
          as={Fragment}
        >
          <div className="fixed inset-0 flex items-center justify-center z-50 py-8">
            <Dialog.Panel
              className="w-clamp max-h-full min-h-1/2 p-8 bg-white border 
            border-main/30 rounded-2xl shadow overflow-y-auto"
            >
              {map[modal ?? prev]}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}
