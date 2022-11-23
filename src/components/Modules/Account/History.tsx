import Spinner from "components/UI/Spinner"
import { collection, limit, orderBy, query } from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { useGetDocs } from "hooks/index"
import { useTSelector } from "hooks/redux"
import Link from "next/link"
import { Attempt } from "types/user"
import { formatDate } from "utils/functions"

export default function UserHistory() {
  const { user } = useTSelector((state) => state.auth)
  const { loading, data, next } = useGetDocs<Attempt>(
    query(
      collection(db, "users", user?.uid ?? "n", "history"),
      orderBy("date", "desc"),
      limit(10)
    ),
    [user]
  )

  if (!data) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      {data && data.length == 0 && (
        <p className="text-center">{"Vous n'avez encore passé aucun quiz"}</p>
      )}
      {data &&
        data.map((attempt) => {
          const minutes = Math.floor(attempt.time / 60)
          return (
            <div
              className="relative rounded bg-main-5"
              key={`${attempt.date._seconds}-${attempt.quizId}`}
            >
              <Link
                href={`/quiz/${attempt.quizId}/results?u=${user?.uid}&t=${attempt.date._seconds}`}
                passHref
              >
                <a className="w-full h-full sm:max-h-28 flex justify-between p-4">
                  <div className="flex gap-4">
                    <div className="text-3xl font-bold flex flex-col items-center justify-center">
                      {attempt.score}
                      <div className="border-b-2 border-black h-2 w-full" />
                      {attempt.questions.length}
                    </div>
                    <div className="my-auto">
                      <p className="text-xl font-semibold">
                        {attempt.quizName}
                      </p>
                      <p className="text-sm italic">
                        {formatDate(attempt.date._seconds)}
                      </p>
                      <p>
                        Durée :{" "}
                        {minutes > 0
                          ? `${minutes}m${attempt.time - minutes * 60}s`
                          : `${attempt.time}s`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col flex-wrap-reverse gap-2 w-fit">
                    {attempt.questions.map((q) => (
                      <div
                        key={`${attempt.date._seconds}-${q.index}`}
                        className={`rounded-sm h-2 w-2 ${
                          q.answers.some((a) => a.correct && a.selected)
                            ? q.answers.some((a) => a.correct && !a.selected)
                              ? "bg-yellow-500"
                              : "bg-green-main"
                            : "bg-red-main"
                        }`}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </div>
          )
        })}
      {data &&
        data.length > 0 &&
        (loading ? (
          <div className="flex justify-center">
            <Spinner small />
          </div>
        ) : (
          <button
            onClick={next}
            className="bg-transparent text-main-100 font-semibold"
          >
            Plus
          </button>
        ))}
    </>
  )
}
