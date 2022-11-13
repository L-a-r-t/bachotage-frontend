import QuizCard from "components/UI/QuizCard"
import Spinner from "components/UI/Spinner"
import { collection, query, where } from "firebase/firestore"
import { db } from "firebaseconfig"
import { useGetDocs, useProtect } from "hooks"
import { useTSelector } from "hooks/redux"
import Link from "next/link"
import { DBQuiz } from "types/quiz"

export default function Drafts() {
  useProtect()
  const { user } = useTSelector((state) => state.auth)
  const { docs, loading } = useGetDocs<DBQuiz>(
    query(
      collection(db, "quizzes"),
      where("published", "==", false),
      where("authorId", "==", user?.uid ?? "")
    ),
    [user]
  )

  if (loading)
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
            quiz={quiz.data()}
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
