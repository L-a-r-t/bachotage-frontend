import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTSelector } from "hooks/redux"
import Latex from "react-latex"
import { Message } from "types/discuss"
import { formatDate } from "utils/functions"
import Spinner from "./Spinner"

export default function SentMessage({
  message,
  index,
  qIndex,
  voteMsg,
  loading,
}: MessageProps) {
  const { user } = useTSelector((state) => state.auth)

  const vote = async (vote: -1 | 0 | 1, msgIndex: number) => {
    await voteMsg(vote, msgIndex, qIndex)
  }

  return (
    <div
      className={`${
        message.authorId == user?.uid ? "bg-main/5" : "bg-main/10"
      } px-4 py-2 rounded`}
    >
      <p className="whitespace-pre-wrap">
        <Latex>{message.content}</Latex>
      </p>
      <div className="flex justify-end gap-4">
        <div className="flex gap-2">
          <button
            className={`${message.vote == 1 && "text-green-main"}`}
            onClick={() => vote(message.vote == 1 ? 0 : 1, index)}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          {message.score}
          <button
            className={`${message.vote == -1 && "text-red-main"}`}
            onClick={() => vote(message.vote == -1 ? 0 : -1, index)}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
        <div className="italic flex gap-2 items-center">
          {message.author}
          {message.authorId == user?.uid && loading && <Spinner small />}
        </div>
        <div className="text-black/50">
          {formatDate(message.published._seconds)}
        </div>
      </div>
    </div>
  )
}

type MessageProps = {
  message: Message
  index: number
  qIndex: number
  voteMsg: (vote: 0 | 1 | -1, msgIndex: number, qIndex: number) => Promise<void>
  loading?: boolean
}
