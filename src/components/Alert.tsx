import { useTDispatch, useTSelector } from "hooks/redux"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { setAlert } from "store/reducers/modal.slice"

export default function Alert() {
  const dispatch = useTDispatch()
  const { alert } = useTSelector((state) => state.modal)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let fadeTimeout: NodeJS.Timeout
    if (alert) {
      timeout = setTimeout(() => {
        setFading(true)
        fadeTimeout = setTimeout(() => {
          dispatch(setAlert(null))
          setFading(false)
        }, 1000)
      }, 3000)
    }

    return () => {
      setFading(false)
      if (timeout) clearTimeout(timeout)
      if (fadeTimeout) clearTimeout(fadeTimeout)
    }
  }, [alert, dispatch])

  return alert
    ? createPortal(
        <div
          className={`fixed bottom-8 right-8 z-50 py-3 px-5 text-white transition-opacity 
          duration-1000 rounded-lg shadow-md max-w-1/2
          ${fading ? "opacity-0" : "opacity-100"}
          ${alert.error ? "bg-red-main" : "bg-green-main"}`}
        >
          <span>{alert.message}</span>
          <button onClick={() => dispatch(setAlert(null))} className="ml-2">
            X
          </button>
        </div>,
        document.body
      )
    : null
}
