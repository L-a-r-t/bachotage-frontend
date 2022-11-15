import Popup from "components/UI/Popup"
import { Dispatch, SetStateAction, useEffect } from "react"
import { FieldValues, useForm } from "react-hook-form"
import Input from "components/UI/Input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass"
import AutoComplete from "components/UI/AutoComplete"
import { Category } from "types/index"
import {
  useInstantSearch,
  useRefinementList,
  useSearchBox,
  useToggleRefinement,
} from "react-instantsearch-hooks-web"

type Props = {
  categories: Category[]
  selectedCategory: string
  setSelectedCategory: Dispatch<SetStateAction<string>>
}

export default function SearchWidget({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const { setIndexUiState } = useInstantSearch()
  const { items, refine } = useRefinementList({ attribute: "categories" })
  const { query, refine: search } = useSearchBox()
  const { refine: toggle } = useToggleRefinement({
    attribute: "published",
    on: true,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()

  useEffect(() => {
    console.log("refinementItems", items)
  }, [items])

  const handleSearch = (data: FieldValues) => {
    console.log(data)
    refine(selectedCategory)
    toggle()
    search(data.q)
    setIndexUiState((prev) => ({
      ...prev,
      refinementList: {
        categories: [selectedCategory],
      },
      toggle: {
        published: true,
      },
    }))
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-8 inset-x-0 flex flex-col justify-between md:min-w-max md:max-w-xs p-4 bg-main text-white rounded-xl">
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="flex flex-col gap-2"
          id="refine"
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
        <button
          type="submit"
          form="refine"
          className="input bg-white text-main mt-16"
        >
          Rechercher
        </button>
      </div>
      <div className="hidden sm:block flex-grow" />
    </div>
  )
}
