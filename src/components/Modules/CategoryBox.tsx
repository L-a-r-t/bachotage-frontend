import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSort } from "@fortawesome/free-solid-svg-icons/faSort"
import { Combobox, Transition } from "@headlessui/react"
import { useState, Fragment } from "react"
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"
import { Category } from "types/index"

export default function CategoryBox({
  categories,
  selected: _selected,
  select,
  unselect,
}: Props) {
  const [query, setQuery] = useState("")

  const filtered =
    query === ""
      ? categories.filter((category) => !_selected.includes(category.name))
      : [
          ...categories.filter(
            (category) =>
              !_selected.includes(category.name) &&
              (category.slug
                .replace(/\s+/g, "")
                .includes(query.toLowerCase().replace(/\s+/g, "")) ||
                category.name
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .includes(query.toLowerCase().replace(/\s+/g, "")))
          ),
          { slug: query, name: query, quizzes: 0 },
        ]

  return (
    <Combobox value={""} onChange={select} as={Fragment}>
      <div className="relative mt-1">
        <div
          className={`${_selected.length < 3 && "input min-h-[2.25rem]"}
        relative cursor-default text-left sm:text-sm flex flex-wrap pr-10 gap-2`}
        >
          {_selected.map((category) => (
            <span
              key={category}
              onClick={() => unselect(category)}
              className="py-1 px-3 rounded-full bg-main/50 hover:bg-main text-white text-sm cursor-pointer"
            >
              {categories.reduce(
                (acc, curr) => (acc = curr.name == category ? curr.name : acc),
                ""
              ) || category}
            </span>
          ))}
          {_selected.length < 3 && (
            <>
              <Combobox.Input
                className="bg-transparent border-b border-main text-sm w-24 leading-5 text-gray-900"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Combobox.Button className="absolute right-1 top-2.5 flex items-center pr-2">
                <FontAwesomeIcon
                  icon={faSort}
                  className="text-lg text-main/50"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </>
          )}
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filtered.length === 0 && query !== "" ? (
              <Combobox.Option
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-main/10 text-black" : "text-black"
                  }`
                }
                value={query}
              >
                <span className="block">{query}</span>
              </Combobox.Option>
            ) : (
              filtered.map((category) => (
                <Combobox.Option
                  key={`${category.slug}option`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? "bg-main/10 text-black" : "text-black"
                    }`
                  }
                  value={category.name}
                >
                  <div className="truncate flex justify-between">
                    <p>{category.name}</p>
                    <p className="text-black/50">{category.quizzes}</p>
                  </div>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

type Props = {
  categories: Category[]
  selected: string[]
  select: (option: string) => void
  unselect: (option: string) => void
}
