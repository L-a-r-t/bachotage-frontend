import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical"
import Link from "next/link"
import { DBQuiz } from "types/quiz"
import DropdownPopup from "./DropdownPopup"
import { useTDispatch } from "hooks/redux"
import { setModal } from "store/modal.slice"
import { LightQuiz } from "types/user"
import Latex from "react-latex"

export default function QuizCard({ quiz, href, options, quizId }: Props) {
  const dispatch = useTDispatch()

  const map = {
    delete: (
      <button
        className="text-red-main hover:text-red-800"
        onClick={() =>
          dispatch(setModal({ modal: "deleteDraft", props: { quiz, quizId } }))
        }
      >
        Supprimer
      </button>
    ),
    try: (
      <Link href={`/quiz/${quizId}/try`} passHref>
        <a>Tentative</a>
      </Link>
    ),
    edit: (
      <Link href={href} passHref>
        <a>Modifier</a>
      </Link>
    ),
  }

  return (
    <div className="relative rounded bg-main/5">
      <DropdownPopup
        label={<FontAwesomeIcon icon={faEllipsisVertical} />}
        items={options.map((option) => map[option])}
        className="absolute right-2 top-2 w-4"
      />
      <Link href={href} passHref>
        <a className="w-full h-full">
          <div className="p-4">
            <h3 className="text-xl font-semibold">{quiz.name}</h3>
            <p className="text-sm italic">{quiz.questions.length} questions</p>
            <Latex>
              {`${quiz.desc.substring(0, 140)}
              ${quiz.desc.length > 140 ? "..." : ""}`}
            </Latex>
          </div>
        </a>
      </Link>
    </div>
  )
}

type Props = {
  quiz: Omit<LightQuiz, "id">
  quizId: string
  href: string
  options: ("try" | "delete" | "edit")[]
}
