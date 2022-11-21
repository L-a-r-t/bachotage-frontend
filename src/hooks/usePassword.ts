import { useState } from "react"

export default function usePassword() {
  const [type, setType] = useState<"password" | "text">("password")

  const toggle = () => {
    setType((prev) => (prev === "password" ? "text" : "password"))
  }

  return [type, toggle] as ["password" | "text", () => void]
}
