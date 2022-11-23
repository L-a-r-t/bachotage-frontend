import { useEffect, useState } from "react"
import { DOTS } from "../../hooks/usePagination"
import type { ChangeEvent } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight"

export type PaginationProps = {
  currentPage: number
  pageSize: number
  total: number
  range: (number | string)[]
  onChange: (newPage: number, pageSize: number) => void
  hideOnSinglePage?: boolean
  showSizeChanger?: boolean
  showJumper?: boolean
  sizeOptions?: number[]
  className?: string
}

const Pagination = ({
  currentPage,
  pageSize = 10,
  total,
  range = [1],
  onChange,
  hideOnSinglePage,
  showSizeChanger,
  showJumper,
  sizeOptions = [5, 10, 20],
  className,
}: PaginationProps) => {
  const [jumperValue, setJumperValue] = useState<number>()

  useEffect(() => {
    if (!jumperValue || isNaN(jumperValue)) return
    onChange(Number(jumperValue), pageSize)
  }, [jumperValue])

  useEffect(() => {
    setJumperValue(undefined)
  }, [currentPage])

  const prev = () => {
    onChange(currentPage - 1, pageSize)
  }

  const next = () => {
    onChange(currentPage + 1, pageSize)
  }

  const toPage = (newPage: any) => {
    onChange(Number(newPage), pageSize)
  }

  const changeSize = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(currentPage, Number(e.target.value.split(" /")[0]))
  }

  if (range.length < 2 && hideOnSinglePage) return null

  const pageItem =
    "list-none flex justify-center items-center w-8 h-8 bg-main-20 cursor-pointer rounded transition duration-200"
  const navItem =
    "list-none flex justify-center items-center w-8 h-8 bg-main-40 cursor-pointer rounded font-bold"

  return (
    <>
      <div className="flex sm:hidden justify-center items-center gap-2 font-bold">
        <button onClick={prev} className={navItem}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="flex w-max items-center gap-2">
          <input
            value={jumperValue}
            className="pl-2 ml-2 h-8 w-16 bg-main-20 rounded placeholder:text-gray-800"
            max={range[range.length - 1]}
            onChange={(e) => setJumperValue(Number(e.target.value))}
            placeholder={String(currentPage)}
          />
          <span>/ {range[range.length - 1]}</span>
        </div>
        <button onClick={next} className={navItem}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        {showSizeChanger && (
          <select
            onChange={changeSize}
            value={`${pageSize} / page`}
            className={`${pageItem} w-fit px-2`}
          >
            {sizeOptions.map((option) => (
              <option
                key={`size${option}`}
                className="bg-main-20"
              >{`${option} / page`}</option>
            ))}
          </select>
        )}
      </div>
      <div
        className={`hidden sm:flex justify-center items-center gap-2 font-bold`}
      >
        <ul className="flex justify-center gap-1 px-0">
          <li onClick={prev} className={navItem}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </li>
          {range.map((page, idx) =>
            page == DOTS ? (
              <li
                key={`dots${idx}`}
                className={`${pageItem} border-none cursor-auto`}
              >
                &#8230;
              </li>
            ) : (
              <li
                key={`page${page}`}
                onClick={() => toPage(page)}
                className={`list-none flex justify-center items-center w-8 h-8 cursor-pointer rounded ${
                  page == currentPage ? "bg-main-100 text-white" : "bg-main-20"
                }`}
              >
                {page}
              </li>
            )
          )}
          <li onClick={next} className={navItem}>
            <FontAwesomeIcon icon={faArrowRight} />
          </li>
        </ul>
        {showSizeChanger && (
          <select
            onChange={changeSize}
            value={`${pageSize} / page`}
            className={`${pageItem} w-fit px-2`}
          >
            {sizeOptions.map((option) => (
              <option
                key={`size${option}`}
                className="bg-main-20"
              >{`${option} / page`}</option>
            ))}
          </select>
        )}
        {showJumper && (
          <div className="flex w-max items-center gap-2">
            <span>Go to</span>
            <input
              type="number"
              value={jumperValue}
              className="pl-2 ml-2 h-8 w-16 bg-main-20 rounded placeholder:text-gray-800"
              max={range[range.length - 1]}
              onChange={(e) =>
                setJumperValue(
                  e.target.value == "" ? undefined : Number(e.target.value)
                )
              }
              placeholder="#"
            />
          </div>
        )}
      </div>
    </>
  )
}

export default Pagination
