import Header from "components/Header"
import Footer from "components/UI/Footer"
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
      <Footer />
    </>
  )
}

type Props = PropsWithChildren & {
  stickyHeader?: boolean
  className?: string
}
