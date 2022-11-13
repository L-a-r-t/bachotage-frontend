import Header from "components/Header"
import { PropsWithChildren } from "react"

export default function WithHeader({
  children,
  stickyHeader,
  className,
}: Props) {
  return (
    <>
      <Header sticky={stickyHeader} className={className} />
      {children}
    </>
  )
}

type Props = PropsWithChildren & {
  stickyHeader?: boolean
  className?: string
}
