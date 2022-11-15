import QuizCard from "components/UI/QuizCard"
import Spinner from "components/UI/Spinner"
import { useProtect } from "hooks"
import { useTSelector } from "hooks/redux"
import Link from "next/link"
import { useGetDraftsQuery } from "store/quizApi"

export default function Drafts() {
  useProtect()
  const { user } = useTSelector((state) => state.auth)
  const { data: docs, isLoading } = useGetDraftsQuery({ uid: user?.uid ?? "" })

  if (isLoading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )

  return (
    <>
      {docs && docs.length > 0 ? (
        docs.map((quiz) => (
          <QuizCard
            quizId={quiz.id}
            options={["try", "edit", "delete"]}
            quiz={quiz}
            href={`/quiz/create/${quiz.id}`}
            key={quiz.id}
          />
        ))
      ) : (
        <div>
          <p className="text-center">Vous n{"'"}avez encore créé aucun quiz.</p>
          <div className="flex justify-center gap-4">
            <Link href="/quiz/create" passHref>
              <a className="button">Créer un quiz</a>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
