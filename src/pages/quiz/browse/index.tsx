import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass"
import WithHeader from "components/Layout/WithHeader"
import WIP from "components/UI/WIP"
import { GetServerSideProps, NextPage } from "next"
import { FieldValues, useForm } from "react-hook-form"
import Input from "components/UI/Input"
import { useRouter } from "next/router"
import { LightQuiz } from "types/user"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "firebaseconfig/index"
import { Category } from "types/index"
import AutoComplete from "components/UI/AutoComplete"
import Popup from "components/UI/Popup"
import Head from "next/head"

const BrowseQuiz: NextPage<Props> = ({ results }) => {
  const router = useRouter()
  const [categories, setCategories] = useState([] as Category[])
  const [selectedCategory, setSelectedCategory] = useState("")
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()

  useEffect(() => {
    ;(async () => {
      const ref = doc(db, "global", "categories")
      const categoriesDoc = await getDoc(ref)
      const data = categoriesDoc.data()
      if (data) setCategories(Object.values(data))
    })()
  }, [])

  const handleSearch = (data: FieldValues) => {
    console.log(data)
    router.push({
      pathname: router.pathname,
      query: { ...data },
    })
  }

  return (
    <WithHeader>
      <Head>
        <title>Recherche de quiz</title>
      </Head>
      <div className="w-clamp-xl flex flex-col mx-auto h-fit-screen gap-4 py-4">
        {/* <div className="relative w-clamp mx-auto flex gap-4 text-2xl">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute top-1 left-2 text-main"
          />
          <input className="flex pl-10 grow border-b-2 border-main/20 focus:border-main focus:outline-none" />
        </div> */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-grow">
          <div className="flex flex-col justify-between w-64 p-4 bg-main text-white rounded-xl">
            <form
              onSubmit={handleSubmit(handleSearch)}
              className="flex flex-col gap-2"
            >
              <Popup
                popup="Un nom ou une catégorie suffisent à lancer la recherche"
                position="down"
              >
                <p className="text-center text-xl font-semibold">
                  Composez votre recherche
                </p>
              </Popup>
              <Input name="q" label="Nom du quiz" errors={errors}>
                <div className="relative">
                  <button
                    type="submit"
                    className="absolute top-1 right-2 text-main"
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                  <input
                    className="input bg-white border-none pr-8 text-black"
                    {...register("q")}
                  />
                </div>
              </Input>
              <div>
                <p>Catégorie</p>
                <AutoComplete
                  value={selectedCategory}
                  setValue={setSelectedCategory}
                  permittedValues={categories}
                />
              </div>
            </form>
            {/* <p>Un jour il y aura des filtres plus complexes ici</p> */}
            <button type="submit" className="input bg-white text-main">
              Rechercher
            </button>
          </div>
          <div className="flex-grow h-full overflow-y-auto md:pr-4">
            {!results ? (
              <p className="text-center text-lg">
                Lancez une recherche pour commencer
              </p>
            ) : results.length > 0 ? (
              <p className="text-center text-lg mb-2">72 results</p>
            ) : (
              <p className="text-center text-lg mb-2">0 results</p>
            )}
            <div className="flex flex-col gap-4">
              <div className="w-48 mx-auto">
                <WIP />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WithHeader>
  )
}

export default BrowseQuiz

type Props = {
  results: LightQuiz[] | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { q } = context.query

  if (!q) {
    return {
      props: {
        results: null,
      },
    }
  }

  return {
    props: {
      results: [],
    },
  }
}
