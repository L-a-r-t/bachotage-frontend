import QuizCard from "components/UI/QuizCard"
import Spinner from "components/UI/Spinner"
import { useProtect } from "hooks"
import { useTSelector } from "hooks/redux"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Saved() {
  useProtect()
  const { user } = useTSelector((state) => state.auth)
  const [loading, setLoading] = useState(!Boolean(user?.data))

  useEffect(() => {
    setLoading(!Boolean(user?.data))
  }, [user])

  if (loading)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )

  return (
    <>
      {user?.data && user.data.savedQuizzes.length > 0 ? (
        user.data.savedQuizzes.map((quiz) => (
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
            Vous n{"'"}avez encore enregistré aucun quiz.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/quiz/browse" passHref>
              <a className="button">Rechercher un quiz</a>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
