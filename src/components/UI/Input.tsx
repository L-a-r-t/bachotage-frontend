import { PropsWithChildren } from "react"
import type { FieldErrorsImpl } from "react-hook-form"

export default function Input({
  children,
  name,
  label,
  errors,
  className,
  check,
}: InputProps) {
  return (
    <div className={`${check ? "" : ""} ${className}`}>
      <div
        className={
          check
            ? "flex flex-row-reverse justify-end gap-3 items-center"
            : "relative"
        }
      >
        {label && <label htmlFor={name}>{label}</label>}
        {children}
      </div>
      {errors[name] && (
        <div className="text-red-400 font-semibold max-w-full">
          {(errors[name]?.message as string) ?? "/!\\"}
        </div>
      )}
    </div>
  )
}

type InputProps = PropsWithChildren & {
  name: string
  label?: string
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any
    }>
  >
  className?: string
  check?: boolean
}
