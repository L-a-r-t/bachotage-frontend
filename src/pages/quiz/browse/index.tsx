import WithHeader from "components/Layout/WithHeader"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { LightQuiz } from "types/user"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { Category } from "types/index"
import Head from "next/head"
import algoliasearch from "algoliasearch/lite"
import { InstantSearch } from "react-instantsearch-hooks-web"
import SearchWidget from "components/Modules/Search/SearchWidget"
import Hits from "components/Modules/Search/Hits"

const searchClient = algoliasearch(
  "X89JRCQYV8",
  "90f76fc7d4cbe92b5d2fd2b1257da5e6"
)

const BrowseQuiz: NextPage = () => {
  const [categories, setCategories] = useState([] as Category[])
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    ;(async () => {
      const ref = doc(db, "global", "categories")
      const categoriesDoc = await getDoc(ref)
      const data = categoriesDoc.data()
      if (data)
        setCategories(
          Object.values(data)
            .filter((category) => category.quizzes > 0)
            .sort((a, b) => b.quizzes - a.quizzes)
        )
    })()
  }, [])

  return (
    <WithHeader>
      <Head>
        <title>Recherche de quiz</title>
      </Head>
      <InstantSearch
        searchClient={searchClient}
        indexName="dev_QUIZZES"
        initialUiState={{
          dev_QUIZZES: {
            toggle: {
              published: true,
            },
          },
        }}
      >
        <div className="w-clamp-xl flex flex-col mx-auto h-fit-screen gap-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-center gap-4 flex-grow">
            <SearchWidget
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <Hits />
          </div>
        </div>
      </InstantSearch>
    </WithHeader>
  )
}

export default BrowseQuiz

type Props = {
  results: LightQuiz[] | null
}
