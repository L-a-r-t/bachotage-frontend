import QuizCard from "components/UI/QuizCard"
import Spinner from "components/UI/Spinner"
import { useProtect } from "hooks"
import { useTSelector } from "hooks/redux"
import Link from "next/link"
import { useGetPublishedQuery } from "store/quizApi"

export default function Published() {
  useProtect()
  const { user } = useTSelector((state) => state.auth)
  const { data: docs, isLoading } = useGetPublishedQuery({
    uid: user?.uid ?? "",
  })

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
            options={["try"]}
            quizId={quiz.id}
            quiz={quiz}
            href={`/quiz/${quiz.id}`}
            key={quiz.id}
          />
        ))
      ) : (
        <div>
          <p className="text-center">
            Vous n{"'"}avez encore publié aucun quiz.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/quiz/create" passHref>
              <a className="button">Créer un quiz</a>
            </Link>
            <Link href="/account/quizzes/drafts" passHref>
              <a className="button bg-main/10 text-slate-800">Brouillons</a>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
