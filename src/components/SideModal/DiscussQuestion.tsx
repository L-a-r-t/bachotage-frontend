import Input from "components/UI/Input"
import { useTSelector } from "hooks/redux"
import { FieldValues, useForm } from "react-hook-form"
import { useEffect, useState, Fragment } from "react"
import Spinner from "components/UI/Spinner"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useMessage from "hooks/useMessage"
import { Tab } from "@headlessui/react"
import { AppQuiz, Change, DBQuiz } from "types/quiz"
import ProposedChange from "components/Modules/ProposedChange"
import SentMessage from "components/UI/Message"
import { protect } from "utils/functions"
import Latex from "react-latex"

export default function DiscussQuestion({ quiz: _quiz, qIndex }: Props) {
  const [change, setChange] = useState<Change | null>(null)
  const { dbQuiz: dbQuiz, dbIndex } = useTSelector((state) => state.quiz)
  const { user } = useTSelector((state) => state.auth)
  const { discussion } = useTSelector((state) => state.discussion)
  const { sendMsg: send, loading, voteMsg } = useMessage()
  const [quiz, setQuiz] = useState(_quiz ?? dbQuiz)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm()

  useEffect(() => {
    setQuiz(_quiz ?? dbQuiz)
  }, [_quiz, dbQuiz])

  useEffect(() => {
    if (!quiz) return
    setChange(quiz.changes[qIndex])
  }, [quiz, qIndex])

  const sendMsg = protect(async (data: FieldValues) => {
    setValue("msg", "")
    await send(data.msg, qIndex ?? -1)
  })

  return !quiz || !discussion ? (
    <div className="flex justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <div className="flex flex-col p-4 sm:p-8 h-full max-h-full">
      <Tab.Group>
        <Tab.List className="flex justify-center gap-2">
          <Tab
            className="py-2 px-4 text-main bg-white rounded transition font-semibold
            duration-300 ease-in-out ui-selected:text-white ui-selected:bg-main"
          >
            Discussion
          </Tab>
          <Tab
            className={`py-2 px-4 bg-white rounded transition font-semibold
            duration-300 ease-in-out ui-selected:text-white ui-selected:bg-main
            ${change ? "text-yellow-500" : "text-main"}`}
          >
            Réponses
          </Tab>
        </Tab.List>
        <Tab.Panels as={Fragment}>
          <Tab.Panel className="h-full max-h-[calc(100%-2.5rem)] flex flex-col justify-between">
            <div className="flex flex-col gap-2 mt-4 sm:px-4 pb-4 overflow-y-auto flex-shrink">
              <h2>Question #{qIndex + 1}</h2>
              {discussion[qIndex].length == 0 && (
                <p>
                  {"Il n'y pas encore de messages au sujet de cette question"}
                </p>
              )}
              {discussion[qIndex].map((m, idx) => (
                <SentMessage
                  key={`md${idx}${m.authorId}`}
                  message={m}
                  index={idx}
                  qIndex={dbIndex}
                  voteMsg={voteMsg}
                  loading={loading}
                />
              ))}
            </div>
            <form
              id="sendMsg"
              onSubmit={handleSubmit(sendMsg)}
              className="mt-4"
            >
              <Input name="msg" errors={errors} className="relative group">
                <textarea
                  className="input border-none bg-main/10 hidden group-hover:block focus-visible:block placeholder:text-black/50 pr-8"
                  placeholder={
                    discussion[qIndex].length == 0
                      ? "Posez une question ou donnez une explication"
                      : "Ecrire un message..."
                  }
                  {...register("msg", { required: true })}
                  rows={3}
                />
                <div
                  className={`input border-none pr-8 min-h-[5rem] bg-main/10 group-hover:hidden group-focus-within:hidden ${
                    watch().msg === "" && "text-black/50"
                  }`}
                >
                  <Latex>
                    {watch().msg === "" ? "Ecrire un message..." : watch().msg}
                  </Latex>
                </div>
                <button
                  className="absolute right-3 top-1"
                  type="submit"
                  form="sendMsg"
                  disabled={!Boolean(user)}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </Input>
            </form>
          </Tab.Panel>
          <Tab.Panel className="h-full overflow-y-auto">
            <div className="flex flex-col gap-4 p-4 flex-shrink">
              <ProposedChange quiz={quiz} qIndex={qIndex} />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

type Props = {
  quiz?: DBQuiz
  qIndex: number
}
