export default function Spinner({ white, small }: Props) {
  return (
    <div
      className={`animate-spin rounded-full border-b-transparent inline-block
        min-w-fit ${white ? "border-white" : "border-main-100"}
        ${
          small
            ? "w-4 aspect-square h-4 border-2"
            : "w-16 aspect-square h-16 border-8"
        }`}
    />
  )
}

export function ScreenSpinner() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner />
    </div>
  )
}

type Props = {
  white?: boolean
  small?: boolean
}
