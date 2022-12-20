import { useHits, useInstantSearch } from "react-instantsearch-hooks-web"
import Link from "next/link"
import Latex from "react-latex"
import Spinner from "components/UI/Spinner"

export default function Hits() {
  const { hits } = useHits<{
    name: string
    desc: string
    categories: string[]
  }>()
  const { status } = useInstantSearch()

  return (
    <div className="flex-grow h-full overflow-y-auto md:pr-4">
      {status == "loading" || status == "stalled" ? (
        <div className="flex justify-center items-center py-4 overflow-visible">
          <Spinner />
        </div>
      ) : (
        <p className="text-center text-lg mb-2">
          {hits.length > 0 ? hits.length : "Aucun"} résultat
          {hits.length > 1 ? "s" : ""}
        </p>
      )}
      <div className="flex flex-col gap-4">
        {hits.map((quiz) => (
          <div key={quiz.objectID} className="relative rounded bg-main-5">
            <Link href={`/quiz/${quiz.objectID}`} passHref>
              <a className="w-full h-full">
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{quiz.name}</h3>
                  <div className="flex gap-2 flex-wrap my-2">
                    {quiz.categories.map((category) => (
                      <span
                        key={quiz.objectID + category}
                        className="py-1 px-3 rounded-full bg-main-50 text-white text-sm min-w-max"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <Latex>
                    {/* Don't mind Prettier's odd formatting, doing 
                    anything here would add an unwanted space */}
                    {`${quiz.desc.substring(0, 140)}${
                      quiz.desc.length > 140 ? "..." : ""
                    }`}
                  </Latex>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
