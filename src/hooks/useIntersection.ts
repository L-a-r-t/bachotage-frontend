import { useEffect, useState } from "react"

/**
 * This hooks is used to know if an element is visible on screen
 * @param elementRef
 * Ref of the element from useRef hook
 * @param elementKey
 * To be used when the passed ref is an array/object of elements
 * @param threshold
 * values: (0..1), Percentage of the element that has to be seen before the element is considered visible.
 * For example, 0.25 means the element will be considered visible if a least 25% of it is visible.
 * @param rootMargin
 * Works in a similar way as threshold but with absolute values.
 * (ie: '-200px' means 200px to be seen before considered visible)
 * @returns IntersectionObserverEntry
 */
const useIntersection = (
  element: Element,
  threshold = 0,
  rootMargin = "0px"
) => {
  const [entry, setState] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin, threshold }
    )

    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [element, rootMargin, threshold])

  return entry
}

export default useIntersection
