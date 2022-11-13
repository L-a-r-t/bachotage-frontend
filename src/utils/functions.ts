import dayjs from "dayjs"
import store from "store/index"
import { setAlert, setModal } from "store/modal.slice"
import { Message, SortedMessage } from "types/discuss"

/**
 * @param array
 * @returns Shuffled array
 */
export function randomize<T>(array: T[]) {
  return [...array].sort((a, b) => Math.random() - 0.5)
}

/**
 * @returns clamped value between min and max params
 */
export function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

/**
 * @returns range as an array of numbers from start to end
 */
export function range(start: number, end: number) {
  let length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export function sortMessages(
  messages: Message[] | undefined,
  order: "recent" | "old" | "relevant"
): SortedMessage[] {
  if (!messages) return [] as SortedMessage[]
  const msgArray = messages.map((msg, index) => ({
    ...msg,
    index,
  })) as SortedMessage[]
  if (order == "recent") {
    return [...msgArray].sort(
      (a, b) => b.published._seconds - a.published._seconds
    )
  }
  if (order == "old") {
    return [...msgArray].sort(
      (a, b) => a.published._seconds - b.published._seconds
    )
  }
  if (order == "relevant") {
    return [...msgArray].sort((a, b) =>
      b.score - a.score == 0
        ? b.published._seconds - a.published._seconds
        : b.score - a.score
    )
  }
  return msgArray
}

export function protect<T extends (...args: any) => void>(
  func: T,
  errMsg?: string
) {
  return ((...args: any) => {
    if (!store.getState().auth.user) {
      store.dispatch(
        setAlert({
          message: errMsg ?? "Vous devez être connecté pour faire ça",
          error: true,
        })
      )
      store.dispatch(setModal({ modal: "login" }))
      return
    }
    func(...args)
  }) as T
}

export function formatDate(seconds: number) {
  const day = dayjs(seconds * 1000)
  if (day.format("DD/MM/YYYY") == dayjs().format("DD/MM/YYYY")) {
    return day.format("HH[h]mm")
  }
  if (day.format("YYYY") == dayjs().format("YYYY")) {
    return day.format("DD MMM")
  }
  return day.format("DD MMM YYYY")
}

export function toSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "")
}
