import { range } from "utils/functions"
import { useCallback, useEffect, useState } from "react"

export const DOTS = "..."

type Params = {
  defaultCurrentPage: number
  defaultPageSize?: number
  total: number
  breakpoints?: { [breakpoint: number]: number }
  onChange?: (state: PaginationState) => void
}

type PaginationState = {
  total: number
  currentPage: number
  pageSize: number
  range: (string | number)[]
}

/**
 * @param {Array} breakpoints [OPTIONAL] Array of breakpoints for number of siblings: {breakpoint: nb_of_siblings},
 * array must be sorted in ascending order before being given as a param
 */
const usePagination = ({
  defaultCurrentPage,
  defaultPageSize = 10,
  total,
  breakpoints = { 660: 1 },
  onChange,
}: Params) => {
  const [dataRange, setDataRange] = useState({ min: 0, max: 10 })
  const [paginationProps, setPaginationProps] = useState<PaginationState>({
    total,
    currentPage: defaultCurrentPage,
    pageSize: defaultPageSize,
    range: [1],
  })
  const [SIBLING_COUNT, setSiblingCount] = useState(1)

  useEffect(() => {
    setSiblingCount(
      Object.keys(breakpoints).reduce((siblingCount, breakpoint) => {
        const bp = Number(breakpoint)
        if (window?.innerWidth > bp) {
          siblingCount = breakpoints[bp]
        }
        return siblingCount
      }, 1)
    )
  }, [breakpoints])

  const handlePagination = useCallback(
    (currentPage: number, pageSize: number, latestTotal = total) => {
      const totalPageCount = Math.ceil(latestTotal / pageSize)
      currentPage = Math.max(Math.min(totalPageCount, currentPage), 1)
      setDataRange({
        min: (currentPage - 1) * pageSize,
        max: currentPage * pageSize,
      })
      // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
      const totalPageNumbers = SIBLING_COUNT + 5

      /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
      if (totalPageNumbers >= totalPageCount) {
        setPaginationProps({
          total: latestTotal,
          currentPage,
          pageSize,
          range: range(1, totalPageCount),
        })
        return
      }

      /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
      const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 1)
      const rightSiblingIndex = Math.min(
        currentPage + SIBLING_COUNT,
        totalPageCount
      )

      /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
      const shouldShowLeftDots = leftSiblingIndex > 2
      const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

      const firstPageIndex = 1
      const lastPageIndex = totalPageCount

      /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
      if (!shouldShowLeftDots && shouldShowRightDots) {
        let leftItemCount = 3 + 2 * SIBLING_COUNT
        let leftRange = range(1, leftItemCount)

        setPaginationProps({
          total: latestTotal,
          currentPage,
          pageSize,
          range: [...leftRange, DOTS, totalPageCount],
        })
        return
      }

      /*
    	Case 3: No right dots to show, but left dots to be shown
    */
      if (shouldShowLeftDots && !shouldShowRightDots) {
        let rightItemCount = 3 + 2 * SIBLING_COUNT
        let rightRange = range(
          totalPageCount - rightItemCount + 1,
          totalPageCount
        )
        setPaginationProps({
          total: latestTotal,
          currentPage,
          pageSize,
          range: [firstPageIndex, DOTS, ...rightRange],
        })
        return
      }
      /*
    	Case 4: Both left and right dots to be shown
    */
      if (shouldShowLeftDots && shouldShowRightDots) {
        let middleRange = range(leftSiblingIndex, rightSiblingIndex)
        setPaginationProps({
          total: latestTotal,
          currentPage,
          pageSize,
          range: [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex],
        })
      }
    },
    [total, SIBLING_COUNT]
  )

  useEffect(() => {
    if (total === 0) return
    handlePagination(defaultCurrentPage, defaultPageSize, total)
  }, [total])

  useEffect(() => {
    if (onChange) onChange(paginationProps)
  }, [paginationProps, onChange])

  return {
    handlePagination,
    dataRange,
    paginationProps,
  }
}

export default usePagination
