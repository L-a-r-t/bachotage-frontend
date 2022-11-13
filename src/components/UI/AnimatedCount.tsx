import { useEffect, useState } from "react"

export default function AnimatedCount({ target, duration }: Props) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const increment = target / (duration / 100)
    const incrementCount = (current: number) => {
      const timer = setTimeout(() => {
        const newValue = Math.ceil(current + increment)
        if (newValue <= target) {
          setCount(newValue)
          incrementCount(newValue)
        } else {
          setCount(target)
        }
      }, 100)
    }

    incrementCount(count)
  }, [target, duration])

  return <span>{count}</span>
}

type Props = {
  target: number
  duration: number
}
