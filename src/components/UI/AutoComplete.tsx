import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"
import { faSort } from "@fortawesome/free-solid-svg-icons/faSort"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Combobox, Transition } from "@headlessui/react"
import { useState, Dispatch, SetStateAction, Fragment } from "react"
import { toSlug } from "utils/functions"

export default function AutoComplete({
  value,
  setValue,
  permittedValues,
}: Props) {
  const [query, setQuery] = useState("")

  const filteredPeople =
    query === ""
      ? permittedValues
      : permittedValues.filter((_value) =>
          toSlug(_value.name).includes(query.toLowerCase().replace(/\s+/g, ""))
        )

  return (
    <Combobox defaultValue={value} onChange={setValue}>
      <div className="relative">
        <div className="relative h-8 w-full cursor-default rounded-lg bg-white text-left sm:text-sm">
          <Combobox.Input
            className="input bg-white h-8 text-black"
            displayValue={(v) => (value ?? "") as string}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <FontAwesomeIcon
              icon={faSort}
              className="text-lg text-main/50"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {query === "" && (
              <Combobox.Option
                className={({ active }) =>
                  `relative cursor-default select-none py-2 ${
                    active ? "bg-main/10 text-black" : "text-black"
                  } text-center`
                }
                value={""}
              >
                Réinitialiser
              </Combobox.Option>
            )}
            {filteredPeople.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Pas de résultat.
              </div>
            ) : (
              filteredPeople.map((_value) => (
                <Combobox.Option
                  key={`filter${_value.name}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-main/10 text-black" : "text-black"
                    }`
                  }
                  value={_value.name}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {_value.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 text-main`}
                        >
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                      {_value.quizzes ? (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-black/50">
                          {_value.quizzes}
                        </span>
                      ) : null}
                    </>
                  )}
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
  permittedValues: { name: string; quizzes?: number }[]
  value: string
  setValue: Dispatch<SetStateAction<string>>
}
