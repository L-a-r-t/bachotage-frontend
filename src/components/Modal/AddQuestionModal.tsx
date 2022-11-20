import Input from "components/UI/Input"
import { ERR_REQUIRED } from "utils/consts"
import { useTDispatch, useTSelector } from "hooks/redux"
import { useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import Latex from "react-latex"
import { addQuestion, editQuestion } from "store/createQuestion.slice"
import { setAlert, setModal } from "store/modal.slice"
import { DBQuestion } from "types/quiz"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan"
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons/faCircleQuestion"
import Popup from "components/UI/Popup"
import CategoryBox from "components/Modules/CategoryBox"

export default function QuestionModal({ question, qIndex }: Props) {
  const dispatch = useTDispatch()
  const { tags: quizTags } = useTSelector((state) => state.createQuestion)
  const [visualize, setVisualize] = useState(false)
  const [tags, setTags] = useState(question?.tags ?? ([] as string[]))
  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: { ...question },
  })

  const [answersCount, setAnswersCount] = useState(
    question?.answers.length ?? 2
  )

  const onSubmit = (data: FieldValues) => {
    console.log(data)
    if (question && qIndex !== undefined) {
      dispatch(
        editQuestion({ question: { ...data, tags } as DBQuestion, qIndex })
      )
    } else {
      dispatch(addQuestion({ ...data, tags } as DBQuestion))
    }
    dispatch(setAlert({ message: "Question enregistrée" }))
    dispatch(setModal({ modal: null }))
  }

  const removeAnswer = (index: number) => {
    for (let i = index; i < answersCount; i++) {
      const answers = getValues("answers")
      if (answers?.[i + 1]) setValue(`answers.${i}`, answers[i + 1])
    }
    unregister(`answers.${answersCount - 1}`)
    setAnswersCount((curr) => curr - 1)
  }

  const select = (tag: string) => {
    setTags((prev) => [...prev, tag])
  }

  const unselect = (tag: string) => {
    const index = tags.indexOf(tag)
    setTags((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)])
  }

  return (
    <form
      className="flex flex-col gap-4 overflow-y-auto"
      id="question"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-center text-xl font-semibold">
        {question ? `Question #${1 + (qIndex ?? 0)}` : "Ajouter une question"}
      </h2>
      <Input name="prompt" errors={errors} label="Intitulé">
        {visualize && (
          <p className="text-lg">
            <Latex>{getValues("prompt")}</Latex>
          </p>
        )}
        {!visualize && (
          <textarea
            className="input"
            {...register("prompt", { required: ERR_REQUIRED })}
            placeholder="Quelle est la quadrature du cercle ?"
          />
        )}
      </Input>
      <div>
        <Popup
          position="down"
          popup="Ajoutez des tags pour spécifier le sujet traité par la question (ex: une question d'algrèbre dans un quiz de maths)"
        >
          Tags <FontAwesomeIcon icon={faCircleQuestion} />
        </Popup>
        <CategoryBox
          categories={quizTags.map((tag) => ({ name: tag }))}
          selected={tags}
          select={select}
          unselect={unselect}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h3>Réponses</h3>
          <button
            className="button-small"
            type="button"
            onClick={() => setVisualize((curr) => !curr)}
          >
            {visualize ? "Modifier" : "Prévisualiser"}
          </button>
        </div>
        {!visualize &&
          new Array(answersCount).fill(null).map((a, index) => (
            <Input
              key={`a${index}`}
              name={`answers.${index}.text`}
              errors={errors}
              check
            >
              <input
                className="input"
                {...register(`answers.${index}.text`, {
                  required: ERR_REQUIRED,
                })}
                placeholder="Réponse..."
              />
              <input
                className="checkbox w-8 h-8"
                type="checkbox"
                {...register(`answers.${index}.correct`)}
              />
              {answersCount > 2 && (
                <button
                  className="text-red-main font-bold"
                  type="button"
                  onClick={() => removeAnswer(index)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              )}
            </Input>
          ))}
        {visualize &&
          new Array(answersCount).fill(null).map((a, index) => (
            <Input
              key={`a${index}`}
              name={`answers.${index}.text`}
              errors={errors}
              check
            >
              <Latex>{getValues(`answers.${index}.text`)}</Latex>
              <input
                className="checkbox w-8 h-8"
                type="checkbox"
                {...register(`answers.${index}.correct`)}
              />
            </Input>
          ))}
      </div>
      {answersCount < 6 && (
        <button
          type="button"
          className="button-small bg-green-100 text-main"
          onClick={() => setAnswersCount((prev) => prev + 1)}
        >
          Ajouter une réponse
        </button>
      )}
      <button className="button" type="submit" form="question">
        Enregistrer
      </button>
    </form>
  )
}

type Props = {
  question?: DBQuestion
  qIndex?: number
}
